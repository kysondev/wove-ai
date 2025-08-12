"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function FashionAI() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello there, I am Wove, your personal fashion Assistant! Ready to help you with all your fashion/styling needs!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && !isLoading) {
      const userMessageContent = chatMessage.trim();

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: userMessageContent,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, userMessage]);
      setChatMessage("");
      setIsLoading(true);

      try {
        const conversationHistory = chatHistory.map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        }));

        conversationHistory.push({
          role: "user",
          content: userMessageContent,
        });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessageContent,
            conversationHistory: conversationHistory,
          }),
        });

        if (!res.ok) throw new Error("Chat API error");

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setChatHistory((prev) => [...prev, aiResponse]);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullContent += chunk;

            setChatHistory((prev) =>
              prev.map((msg) =>
                msg.id === aiResponse.id
                  ? { ...msg, content: fullContent }
                  : msg
              )
            );
          }
        }
      } catch (err) {
        console.error("Chat API error:", err);
        const errorResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearChat = () => {
    setChatHistory([
      {
        id: "1",
        type: "assistant",
        content:
          "Hello there, I am Wove, your personal fashion Assistant! Ready to help you with all your fashion/styling needs!",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-lg">
            <Bot className="h-5 w-5 text-neutral-800" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight font-sans">
            Wove AI
          </h1>
        </div>
        <button
          onClick={clearChat}
          className="text-sm text-neutral-300 hover:text-white px-4 py-2 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600"
        >
          Clear chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="h-6 w-6 text-neutral-800" />
                </div>
              )}

              <div
                className={`max-w-3xl px-6 py-4 rounded-2xl shadow-lg ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-900 ml-auto shadow-xl"
                    : "bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-base">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-3 ${
                    message.type === "user"
                      ? "text-neutral-600"
                      : "text-neutral-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.type === "user" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="h-6 w-6 text-neutral-800" />
              </div>
              <div className="bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800/50 px-6 py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleChatSubmit} className="relative">
            <input
              ref={chatInputRef}
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Message Wove AI..."
              className="w-full px-6 py-4 pr-16 bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent resize-none text-white placeholder-neutral-400 text-base transition-all duration-200 shadow-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !chatMessage.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 text-neutral-400 hover:text-white disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 hover:bg-neutral-700/50 rounded-xl"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="text-xs text-neutral-500 mt-3 text-center">
            Wove AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
