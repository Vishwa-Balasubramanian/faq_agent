import { openai, MODEL } from "./openaiClient";

export async function translateAnswer(answerDe: string, targetLang: string): Promise<string> {
  // If language is German or unknown, keep German
  if (!targetLang || targetLang === "de" || targetLang === "unknown") return answerDe;

  const system = `
You are a professional translator for a medical education app.
Translate the given German text into the target language.
Do NOT add any new information. Do NOT change meaning.
Keep formatting (line breaks, bullets) as-is.
Return only the translated text.
`.trim();

  const user = `
Target language: ${targetLang}

German text:
"""${answerDe}"""
`.trim();

  const resp = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return resp.choices[0]?.message?.content?.trim() || answerDe;
}
