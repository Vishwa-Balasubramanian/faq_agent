import * as readline from "readline";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { buildFaqSelectionPrompt } from "./prompts/faqPrompt";
import { buildTranslationPrompt } from "./prompts/translationPrompt";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function selectGermanAnswer(userQuestion: string): Promise<string> {
  const prompt = buildFaqSelectionPrompt(userQuestion);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  return response.choices[0]?.message?.content ?? "";
}

async function translateGermanToEnglish(germanText: string): Promise<string> {
  const prompt = buildTranslationPrompt(germanText);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  return response.choices[0]?.message?.content?.trim() ?? germanText;
}

function formatAnswer(text: string): string {
  if (!text) return "";

  let formatted = text.trim();
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, (_, p1) => p1.toUpperCase());
  formatted = formatted.replace(/\s+/g, " ");
  formatted = formatted.replace(/\. /g, ".\n\n");

  return formatted;
}

// ---------------- CLI ----------------

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function startCLI() {
  rl.question("Ask a question in English (type 'exit' to quit): ", async (input) => {
    if (input.trim().toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      const germanAnswerRaw = await selectGermanAnswer(input);
      const germanAnswer = germanAnswerRaw.trim();

      if (!germanAnswer || germanAnswer === "NOT_FOUND") {
        console.log("\nNot found in FAQ.\n");
        return startCLI();
      }

      const englishAnswer = await translateGermanToEnglish(germanAnswer);

      console.log("\nAnswer:");
      console.log(formatAnswer(englishAnswer));
      console.log("");

    } catch (error) {
      console.error("Error:", error);
      console.log("");
    }

    startCLI();
  });
}

startCLI();
