import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const SYSTEM_PROMPT =
  "Eres el PM virtual de la app PM Ad Hoc, un asistente de gestión de proyectos con enfoque PMO. " +
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
