"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFaqSelectionPrompt = buildFaqSelectionPrompt;
const faqData_1 = require("../faq/faqData");
function buildFaqSelectionPrompt(userQuestion) {
    return `
You are an FAQ routing system.

You are given a list of FAQs in German.
Each FAQ has:
- id
- question_de
- answer_de

User questions are in English.

Your job:
- Read the user question.
- Select the FAQ whose QUESTION best matches the meaning.
- Return the EXACT "answer_de" text from that FAQ.
- Do NOT modify the answer.
- Do NOT summarize.
- Do NOT add extra text.
- If no FAQ matches clearly, return exactly:

NOT_FOUND

FAQ LIST:
${JSON.stringify(faqData_1.FAQS, null, 2)}

User Question:
"${userQuestion}"

Important:
Return ONLY the answer_de text or NOT_FOUND.
Do not explain your reasoning.
`.trim();
}
