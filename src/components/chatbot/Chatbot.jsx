import { SendIcon } from "../icons/Icons";
import "./Chatbot.css";

export default function Chatbot({ chatbot }) {
  const { messages, chatInput, setChatInput, sendMessage } = chatbot;

  return (
    <div className="chatbot-page">
      <h1 className="page-title">Pregunta al PM virtual</h1>
      <p className="page-subtitle">Preguntas puntuales del día a día, respondidas al momento.</p>

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
        </div>

        <div className="chatbot-input-row">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Escribe tu pregunta, por ejemplo: ¿qué tool uso para un análisis de riesgo?"
          />
          <button onClick={sendMessage} className="chatbot-send-btn">
            <SendIcon size={16} color="var(--white)" />
          </button>
        </div>
      </div>
    </div>
  );
}
