import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";

const STORAGE_KEY = "rai-chat-v2";
const MAX_HISTORY = 20;
const WELCOME = {
  sender: "bot",
  text: "Olá! Eu sou o rAI, assistente virtual da Rayssa. Posso apresentar seus projetos, tecnologias, experiências e formação. O que gostaria de saber?",
  includeInHistory: false,
};
const SUGGESTIONS = [
  "Quais tecnologias a Rayssa conhece?",
  "Quais projetos ela desenvolveu?",
  "Qual é a experiência profissional dela?",
];

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [WELCOME];
    const valid = saved
      .filter((item) =>
        item &&
        (item.sender === "user" || item.sender === "bot") &&
        typeof item.text === "string" &&
        item.text.trim() &&
        item.text.length <= 4000
      )
      .slice(-MAX_HISTORY)
      .map(({ sender, text }) => ({ sender, text }));
    return [WELCOME, ...valid];
  } catch {
    return [WELCOME];
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);
  const windowRef = useRef(null);
  const launcherRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const viewport = window.visualViewport;
    const updateViewport = () => {
      const panel = windowRef.current;
      if (!panel) return;
      panel.style.setProperty("--chat-visible-height", `${viewport?.height ?? window.innerHeight}px`);
      panel.style.setProperty("--chat-visible-top", `${viewport?.offsetTop ?? 0}px`);
    };
    updateViewport();
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    // Focus the close control without opening the virtual keyboard automatically.
    windowRef.current?.querySelector(".chatbot-close")?.focus({ preventScroll: true });
    return () => {
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [isOpen]);

  const closeChat = () => {
    setIsOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    try {
      const toSave = messages
        .filter((item) => item.includeInHistory !== false)
        .slice(-MAX_HISTORY)
        .map(({ sender, text }) => ({ sender, text }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.warn("Não foi possível salvar o histórico:", error);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const scroller = messagesEndRef.current?.parentElement;
      scroller?.scrollTo({ top: scroller.scrollHeight, behavior: "instant" });
    }
  }, [messages, isLoading, isOpen]);

  const clearChat = () => {
    if (sendingRef.current) return;
    setMessages([WELCOME]);
    setMessage("");
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Armazenamento indisponível */ }
  };

  const sendMessage = async (suggestion) => {
    const userMessage = (typeof suggestion === "string" ? suggestion : message).trim();
    if (!userMessage || userMessage.length > 4000 || sendingRef.current) return;

    const history = messages
      .filter((item) => item.includeInHistory !== false)
      .slice(-MAX_HISTORY)
      .map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
        content: item.text,
      }));

    sendingRef.current = true;
    setIsLoading(true);
    setMessage("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });
      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
      const data = await response.json();
      if (typeof data.response !== "string" || !data.response.trim()) {
        throw new Error("Resposta inválida do servidor");
      }
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Ops! Não consegui responder agora. Tente novamente.",
          includeInHistory: false,
        },
      ]);
    } finally {
      sendingRef.current = false;
      setIsLoading(false);
    }
  };

  const showSuggestions =
    !messages.some((msg) => msg.sender === "user");

  return (
    <>
      {!isOpen && (
        <button
          ref={launcherRef}
          aria-haspopup="dialog"
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
        <div ref={windowRef} className="chatbot-window" role="dialog" aria-labelledby="rai-title"
          onKeyDown={(event) => { if (event.key === "Escape") closeChat(); }}>
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-icon">🪼</span>

              <div>
                <h2 id="rai-title">Assistente rAI </h2>
                <p>Assistente virtual • Portfólio</p>
              </div>
            </div>

            <div className="rai-header-actions">
              <button
                type="button"
                className="rai-clear"
                onClick={clearChat}
                disabled={isLoading}
                title="Limpar conversa"
                aria-label="Limpar conversa"
              >
                ↺
              </button>

              <button
                className="chatbot-close"
                onClick={closeChat}
                aria-label="Fechar assistente"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chatbot-messages" role="log" aria-label="Conversa com rAI" aria-live="polite">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message-row ${msg.sender}`}
              >

                <div className={`chatbot-message ${msg.sender}`}>
                  {msg.sender === "bot" ? (
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>

              </div>
            ))}

            {showSuggestions && !isLoading && (
              <div className="rai-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="chatbot-message-row bot">
                <div className="chatbot-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                  <small>rAI está digitando...</small>
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
              aria-label="Mensagem para rAI"
              className="chatbot-input"
              type="text"
              value={message}
              maxLength={4000}
              onChange={(e) => setMessage(e.target.value)}
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
              disabled={isLoading || !message.trim()}
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
