import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Eu sou o assistente virtual da Rayssa. Posso responder perguntas sobre seus projetos, tecnologias, experiência e formação.",
    },
  ]);

  const sendMessage = async () => {
    // Não envia mensagem vazia
    if (!message.trim()) return;

    const userMessage = message;

    // Adiciona a mensagem do usuário ao chat
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    // Limpa o campo de texto
    setMessage("");

    try {
      // Envia a mensagem para o backend Python
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      // Verifica se ocorreu algum erro no backend
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Adiciona a resposta do backend ao chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Ops! Não consegui responder agora. Tente novamente.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Botão flutuante do chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-2xl shadow-lg transition hover:scale-110"
          aria-label="Abrir assistente"
        >
          🪼
        </button>
      )}

      {/* Janela do chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-purple-400/20 bg-[#12091f] shadow-2xl">

          {/* Cabeçalho */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <div>
              <h2 className="font-semibold text-white">
                Assistente da Rayssa
              </h2>

              <p className="text-xs text-purple-300">
                Posso falar sobre meu portfólio
              </p>
            </div>

            {/* Botão fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl text-gray-400 transition hover:text-white"
              aria-label="Fechar assistente"
            >
              ×
            </button>
          </div>

          {/* Área das mensagens */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === "user"
                      ? "rounded-br-none bg-purple-600 text-white"
                      : "rounded-tl-none bg-purple-600/20 text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Campo para escrever */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="min-w-0 flex-1 rounded-xl bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-purple-500"
            />

            {/* Botão enviar */}
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-4 text-white transition hover:bg-purple-500"
              aria-label="Enviar mensagem"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}