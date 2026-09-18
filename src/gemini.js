import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const SYSTEM_PROMPT =
  "Eres el PM virtual de la app PMO Ad Hoc, un asistente de gestión de proyectos con enfoque PMO. " +
  "Responde en español, de forma breve, clara y práctica, con buenas prácticas de project management " +
  "(PMI, ágil, gestión de riesgos, plantillas, roadmap de fases). No uses jerga innecesaria. " +
  "Escribe siempre en texto plano, sin markdown (nada de asteriscos para negrita/cursiva ni almohadillas de títulos).";

export async function askGemini(history, message) {
  const chat = ai.chats.create({
    model: "gemini-3.6-flash",
    config: { systemInstruction: SYSTEM_PROMPT },
    history: history.map((m) => ({
      role: m.from === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  });
  const response = await chat.sendMessage({ message });
  return response.text;
}

export async function askKbAssistant(history, message, articles) {
  const articlesSummary = articles.map((a) => `- "${a.title}" (categoría: ${a.category})`).join("\n");
  const systemPrompt =
    "Eres el asistente de la Base de conocimiento de PMO Ad Hoc. Tu única tarea es ayudar al usuario a encontrar " +
    "qué artículo de la lista de abajo conviene leer según la duda que describa. No inventes artículos que no " +
    "estén en la lista. Recomienda 1 o 2 como máximo, explica en una frase por qué encajan, y anima a abrirlos. " +
    "Si ninguno encaja bien, dilo con honestidad en vez de forzar una recomendación. Responde en español, breve " +
    "y en texto plano, sin markdown (nada de asteriscos ni almohadillas).\n\nArtículos disponibles:\n" +
    articlesSummary;

  const chat = ai.chats.create({
    model: "gemini-3.6-flash",
    config: { systemInstruction: systemPrompt },
    history: history.map((m) => ({
      role: m.from === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  });
  const response = await chat.sendMessage({ message });
  return response.text;
}
