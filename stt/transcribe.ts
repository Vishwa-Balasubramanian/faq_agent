import * as dotenv from "dotenv";
dotenv.config({ override: true });

import { File } from "node:buffer";
(globalThis as any).File = File;

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// Adjust this path if needed
const { FAQS } = require("../dist/faq/faqData.js");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type FAQItem = {
  id: string;
  question_de: string;
  answer_de: string;
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(input: string, faqQuestion: string): number {
  const inputWords = new Set(normalizeText(input).split(" "));
  const faqWords = new Set(normalizeText(faqQuestion).split(" "));

  let score = 0;
  for (const word of inputWords) {
    if (faqWords.has(word)) {
      score++;
    }
  }
  return score;
}

function findBestFAQMatch(userQuestion: string, faqs: FAQItem[]): FAQItem | null {
  let bestMatch: FAQItem | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const score = scoreMatch(userQuestion, faq.question_de);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

async function detectLanguage(transcription: string): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Identify the language of the following text. Return only the language name.

Text:
${transcription}`,
  });

  return response.output_text.trim();
}

async function run() {
  try {
    const audioFileName = "Recording.m4a";
    const audioPath = path.resolve(audioFileName);

    if (!fs.existsSync(audioPath)) {
      throw new Error(`File not found: ${audioPath}`);
    }

    const file = fs.createReadStream(audioPath);

    const transcriptionResult = await client.audio.transcriptions.create({
      model: "gpt-4o-mini-transcribe",
      file,
    });

    const transcription = transcriptionResult.text;

    console.log("\nTranscription:\n");
    console.log(transcription);

    const detectedLanguage = await detectLanguage(transcription);
    console.log("\nDetected Language:\n");
    console.log(detectedLanguage);

    const matchedFAQ = findBestFAQMatch(transcription, FAQS);

    if (matchedFAQ) {
      console.log("\nMatched FAQ Question:\n");
      console.log(matchedFAQ.question_de);

      console.log("\nFAQ Answer:\n");
      console.log(matchedFAQ.answer_de);
    } else {
      console.log("\nFAQ Answer:\n");
      console.log("No matching FAQ found.");
    }

    const outputData = {
      file: audioFileName,
      detected_language: detectedLanguage,
      transcription,
      matched_faq: matchedFAQ
        ? {
            id: matchedFAQ.id,
            question_de: matchedFAQ.question_de,
            answer_de: matchedFAQ.answer_de,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    const outputPath = path.resolve("transcription_output.json");
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), "utf-8");

    console.log(`\nSaved transcription to ${outputPath}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();