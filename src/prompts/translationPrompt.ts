export function buildTranslationPrompt(germanText: string): string {
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
