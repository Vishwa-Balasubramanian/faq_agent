import { openai, MODEL } from "./openaiClient";
import { FaqItem } from "../faq/types";

export type Confidence = "high" | "medium" | "low";

export type FaqSelection = {
  selected_id: string | null;
  confidence: Confidence;
  clarifying_question?: string;
  detected_language?: string; // "en", "de", "fr", etc.
};

function buildFaqList(faqs: FaqItem[]): string {
  return faqs
    .map(
      (f) =>
        `- ${f.id}: ${f.question_de}${f.category ? ` (Kategorie: ${f.category})` : ""}`
    )
    .join("\n");
}

export async function selectFaq(userMessage: string, faqs: FaqItem[]): Promise<FaqSelection> {
  const faqList = buildFaqList(faqs);

  const system = `
You are a strict FAQ router for a medical education app.
You must ONLY choose an FAQ id from the list, or ask ONE clarifying question.
The FAQ list is in German, but the user may ask in any language. Still select the best FAQ id.
Do not write the final FAQ answer. Do not invent ids.
Return JSON only.
`.trim();

  const user = `
User message:
"""${userMessage}"""

FAQ list (German):
${faqList}

Return JSON with:
- selected_id: string | null
- confidence: "high" | "medium" | "low"
- clarifying_question: string (only if confidence is medium or low)
- detected_language: ISO 639-1 code (e.g., "en", "de", "fr") or "unknown"
`.trim();

  const resp = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = resp.choices[0]?.message?.content ?? "{}";

  let parsed: any = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const selected_id = typeof parsed.selected_id === "string" ? parsed.selected_id : null;

  const confidence: Confidence =
    parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
      ? parsed.confidence
      : "low";

  const clarifying_question =
    typeof parsed.clarifying_question === "string" ? parsed.clarifying_question : undefined;

  const detected_language =
    typeof parsed.detected_language === "string" ? parsed.detected_language : "unknown";

  return { selected_id, confidence, clarifying_question, detected_language };
}
