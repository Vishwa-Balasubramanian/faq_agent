"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTranslationPrompt = buildTranslationPrompt;
function buildTranslationPrompt(germanText) {
    return `
Translate the following German text into clear professional English.

Rules:
- Preserve meaning exactly.
- Do NOT add new information.
- Do NOT summarize.
- Return ONLY the translated text.

German text:
"""${germanText}"""
`.trim();
}
