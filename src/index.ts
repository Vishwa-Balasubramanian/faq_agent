import readline from "node:readline";
import { FAQS } from "./faq/faqData";
import { selectFaq } from "./llm/faqSelector";
import { translateAnswer } from "./llm/translateAnswer";

function isYes(text: string): boolean {
  const t = text.trim().toLowerCase();
  return ["yes", "y", "yeah", "yep", "true", "correct", "right", "ok", "okay", "sure"].includes(t);
}

function isNo(text: string): boolean {
  const t = text.trim().toLowerCase();
  return ["no", "n", "nope", "false", "not really"].includes(t);
}

async function main() {
  console.log("FAQ Agent CLI ✅ (LLM selector, German FAQ → multilingual answers)");
  console.log("Type a question. Type 'exit' to quit.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (prompt: string) =>
    new Promise<string>((resolve) => rl.question(prompt, resolve));

  
  let awaitingConfirmation = false;
  let pendingFaqId: string | null = null;
  let pendingLang: string = "unknown";
  let pendingClarifyQuestion: string | undefined = undefined;

  while (true) {
    const msg = (await ask("> ")).trim();
    if (!msg) continue;
    if (msg.toLowerCase() === "exit") break;

    try {
      
      if (awaitingConfirmation && pendingFaqId) {
        if (isYes(msg)) {
          const faq = FAQS.find((f) => f.id === pendingFaqId);

          console.log(
            `\n[debug] clarification_confirmed=true selected_id=${pendingFaqId} lang=${pendingLang}\n`
          );

          if (!faq) {
            const errText = await translateAnswer(
              "I selected an FAQ entry, but could not find it in the local FAQ list.",
              pendingLang
            );
            console.log(errText);
          } else {
            const finalAnswer = await translateAnswer(faq.answer_de, pendingLang);
            console.log(finalAnswer);
          }

          // reset state
          awaitingConfirmation = false;
          pendingFaqId = null;
          pendingLang = "unknown";
          pendingClarifyQuestion = undefined;

          console.log("");
          continue;
        }

        if (isNo(msg)) {
          console.log(
            `\n[debug] clarification_confirmed=false selected_id=${pendingFaqId} lang=${pendingLang}\n`
          );

          const fb = await translateAnswer(
            "Okay—could you tell me what exactly you want help with (e.g., requesting an expert, booking a slot, rescheduling, or joining the call)?",
            pendingLang
          );
          console.log(fb);

          // reset state
          awaitingConfirmation = false;
          pendingFaqId = null;
          pendingLang = "unknown";
          pendingClarifyQuestion = undefined;

          console.log("");
          continue;
        }

       
        const contextualMsg =
          pendingClarifyQuestion
            ? `${msg}\n\n(Previous clarification question from the assistant: "${pendingClarifyQuestion}")`
            : msg;

        
        awaitingConfirmation = false;
        pendingFaqId = null;
        pendingLang = "unknown";
        pendingClarifyQuestion = undefined;

        const sel2 = await selectFaq(contextualMsg, FAQS);

        console.log(
          `\n[debug] lang=${sel2.detected_language} confidence=${sel2.confidence} selected_id=${sel2.selected_id}\n`
        );

        if (sel2.confidence === "high" && sel2.selected_id) {
          const faq2 = FAQS.find((f) => f.id === sel2.selected_id);
          if (!faq2) {
            const errText = await translateAnswer(
              "I selected an FAQ entry, but could not find it in the local FAQ list.",
              sel2.detected_language || "unknown"
            );
            console.log(errText);
          } else {
            const finalAnswer = await translateAnswer(
              faq2.answer_de,
              sel2.detected_language || "unknown"
            );
            console.log(finalAnswer);
          }
        } else if (sel2.clarifying_question) {
          // store pending confirmation
          awaitingConfirmation = true;
          pendingFaqId = sel2.selected_id ?? null;
          pendingLang = sel2.detected_language || "unknown";
          pendingClarifyQuestion = sel2.clarifying_question;

          const q = await translateAnswer(sel2.clarifying_question, pendingLang);
          console.log(q);
        } else {
          const fb = await translateAnswer(
            "I’m not sure which FAQ this relates to. Could you rephrase your question?",
            sel2.detected_language || "unknown"
          );
          console.log(fb);
        }

        console.log("");
        continue;
      }

      const sel = await selectFaq(msg, FAQS);

      console.log(
        `\n[debug] lang=${sel.detected_language} confidence=${sel.confidence} selected_id=${sel.selected_id}\n`
      );

      if (sel.confidence === "high" && sel.selected_id) {
        const faq = FAQS.find((f) => f.id === sel.selected_id);

        if (!faq) {
          const errText = await translateAnswer(
            "I selected an FAQ entry, but could not find it in the local FAQ list.",
            sel.detected_language || "unknown"
          );
          console.log(errText);
        } else {
          const finalAnswer = await translateAnswer(
            faq.answer_de,
            sel.detected_language || "unknown"
          );
          console.log(finalAnswer);
        }
      } else if (sel.clarifying_question) {
        // store pending confirmation state
        awaitingConfirmation = true;
        pendingFaqId = sel.selected_id ?? null;
        pendingLang = sel.detected_language || "unknown";
        pendingClarifyQuestion = sel.clarifying_question;

        const q = await translateAnswer(sel.clarifying_question, pendingLang);
        console.log(q);
      } else {
        const fb = await translateAnswer(
          "I’m not sure which FAQ this relates to. Could you rephrase your question?",
          sel.detected_language || "unknown"
        );
        console.log(fb);
      }

      console.log("");
    } catch (e: any) {
      console.error("\nError:", e?.message || e);
      console.log("");
    }
  }

  rl.close();
}

main();
