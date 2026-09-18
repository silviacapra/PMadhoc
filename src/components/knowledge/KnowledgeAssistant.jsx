import { useState } from "react";
import { SendIcon } from "../icons/Icons";
import { askKbAssistant } from "../../gemini";
import "../chatbot/Chatbot.css";
import "./KnowledgeAssistant.css";

const INITIAL_MESSAGE = {
  from: "bot",
  text: "Cuéntame qué duda tienes y te digo qué artículo de la base de conocimiento te puede ayudar.",
};

export default function KnowledgeAssistant({ articles }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages;
    const withUser = [...history, { from: "user", text }];
    setMessages(withUser);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const reply = await askKbAssistant(history, text, articles);
      setMessages([...withUser, { from: "bot", text: reply }]);
    } catch (err) {
      setError("No se ha podido contactar con el asistente. Inténtalo de nuevo en un momento.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="kb-assistant section-card">
      <div className="kb-assistant-head">
        <span className="kb-assistant-title">✨ Asistente de la base de conocimiento</span>
        <span className="kb-assistant-subtitle">Pregúntale cuál es el mejor artículo para tu duda</span>
      </div>

      <div className="kb-assistant-messages chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className="chatbot-message-row" style={{ justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
            <div
              className="chatbot-bubble"
              style={{
                background: msg.from === "user" ? "var(--accent)" : "var(--gray-light)",
                color: msg.from === "user" ? "#FFFFFF" : "#333333",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chatbot-message-row" style={{ justifyContent: "flex-start" }}>
            <div className="chatbot-bubble chatbot-bubble--typing" style={{ background: "var(--gray-light)", color: "#333333" }}>
              Pensando...
            </div>
          </div>
        )}
      </div>

      {error && <p className="chatbot-error">{error}</p>}

      <div className="chatbot-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: no sé quién tiene que aprobar las tareas del equipo"
          disabled={loading}
        />
        <button onClick={sendMessage} className="chatbot-send-btn" disabled={loading}>
          <SendIcon size={16} color="var(--white)" />
        </button>
      </div>
    </div>
  );
}
