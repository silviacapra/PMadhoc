import { SendIcon } from "../icons/Icons";
import "./Chatbot.css";

export default function Chatbot({ chatbot }) {
  const { messages, chatInput, setChatInput, sendMessage, loading, error } = chatbot;

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="chatbot-page">
      <h1 className="page-title">Pregunta al PM virtual</h1>
      <p className="page-subtitle">Preguntas puntuales del día a día, respondidas al momento por IA (Gemini).</p>

      <div className="chatbot-panel">
        <div className="chatbot-messages">
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
                El PM virtual está escribiendo...
              </div>
            </div>
          )}
        </div>

        {error && <p className="chatbot-error">{error}</p>}

        <div className="chatbot-input-row">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta, por ejemplo: ¿qué tool uso para un análisis de riesgo?"
            disabled={loading}
          />
          <button onClick={sendMessage} className="chatbot-send-btn" disabled={loading}>
            <SendIcon size={16} color="var(--white)" />
          </button>
        </div>
      </div>
    </div>
  );
}
