import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Eu sou o assistente virtual da Rayssa. Posso responder perguntas sobre seus projetos, tecnologias, experiência e formação.",
    },
  ]);

  // Rola automaticamente para a mensagem mais recente
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async () => {
    const userMessage = message.trim();

    // Impede mensagem vazia ou vários envios ao mesmo tempo
    if (!userMessage || isLoading) return;

    const history = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: userMessage,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status}`
        );
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Ops! Não consegui responder agora. Tente novamente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat"
        >
          <span className="chatbot-button-text">
            Chat rAI
          </span>

          <span className="chatbot-button-icon">
            🪼
          </span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-icon">
                🪼
              </span>

              <div>
                <h2>Assistente rAI</h2>

                <p>
                  Online • Pergunte sobre meu portfólio
                </p>
              </div>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar assistente"
            >
              ×
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message-row ${msg.sender}`}
              >
                <div
                  className={`chatbot-message ${msg.sender}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message-row bot">
                <div className="chatbot-typing">
                  <span></span>
                  <span></span>
                  <span></span>

                  <small>
                    rAI está digitando...
                  </small>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="chatbot-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              className="chatbot-input"
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder={
                isLoading
                  ? "Aguarde a resposta..."
                  : "Pergunte algo sobre a Rayssa..."
              }
              disabled={isLoading}
            />

            <button
              className="chatbot-send"
              type="submit"
              disabled={
                isLoading || !message.trim()
              }
              aria-label="Enviar mensagem"
            >
              {isLoading ? "•••" : "➤"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}