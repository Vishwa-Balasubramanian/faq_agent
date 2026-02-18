import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing. Set it in your .env file.");
}

export const openai = new OpenAI({ apiKey });
export const MODEL = process.env.OPENAI_MODEL || "gpt-5.1";
