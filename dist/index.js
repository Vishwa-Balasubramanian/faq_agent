"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const dotenv = __importStar(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const faqPrompt_1 = require("./prompts/faqPrompt");
const translationPrompt_1 = require("./prompts/translationPrompt");
dotenv.config();
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
async function selectGermanAnswer(userQuestion) {
    const prompt = (0, faqPrompt_1.buildFaqSelectionPrompt)(userQuestion);
    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    });
    return response.choices[0]?.message?.content ?? "";
}
async function translateGermanToEnglish(germanText) {
    const prompt = (0, translationPrompt_1.buildTranslationPrompt)(germanText);
    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    });
    return response.choices[0]?.message?.content?.trim() ?? germanText;
}
function formatAnswer(text) {
    if (!text)
        return "";
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
        }
        catch (error) {
            console.error("Error:", error);
            console.log("");
        }
        startCLI();
    });
}
startCLI();
