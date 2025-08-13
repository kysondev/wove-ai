"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Image as ImageIcon, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export default function FashionAI() {
  const [chatMessage, setChatMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello there, I am Wove, your personal fashion Assistant! Ready to help you with all your fashion/styling needs! To get started, do you have any specific outfit choices you have in mind?👔",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((chatMessage.trim() || selectedImage) && !isLoading) {
      const userMessageContent = chatMessage.trim();

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: userMessageContent,
        image: selectedImage || undefined,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, userMessage]);
      setChatMessage("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsLoading(true);

      try {
        const conversationHistory = chatHistory.map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
          image: msg.image,
        }));

        conversationHistory.push({
          role: "user",
          content: userMessageContent,
          image: selectedImage || undefined,
        });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessageContent,
            image: selectedImage,
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
          "Hello there, I am Wove, your personal fashion Assistant! Ready to help you with all your fashion/styling needs! To get started, do you have any specific outfit choices you have in mind?👔",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-lg">
            <Image src="/wove.png" alt="Logo" width={32} height={32} />
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
                  <Image src="/wove.png" alt="Logo" width={32} height={32} />
                </div>
              )}

              <div
                className={`max-w-3xl px-6 py-4 rounded-2xl shadow-lg ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-900 ml-auto shadow-xl"
                    : "bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50"
                }`}
              >
                {message.image && (
                  <div className="mb-4">
                    <img
                      src={message.image}
                      alt="Uploaded image"
                      className="max-w-full h-auto rounded-lg shadow-md"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
                {message.type === "user" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="whitespace-pre-wrap leading-relaxed text-base mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li>{children}</li>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="whitespace-pre-wrap leading-relaxed text-base mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-3 text-white">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold mb-2 text-white">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold mb-2 text-white">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-base font-bold mb-2 text-white">
                          {children}
                        </h4>
                      ),
                      h5: ({ children }) => (
                        <h5 className="text-sm font-bold mb-2 text-white">
                          {children}
                        </h5>
                      ),
                      h6: ({ children }) => (
                        <h6 className="text-xs font-bold mb-2 text-white">
                          {children}
                        </h6>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-neutral-200">{children}</em>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code className="bg-neutral-700/60 px-1.5 py-0.5 rounded text-sm font-mono text-neutral-200">
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="bg-neutral-800/80 p-4 rounded-lg overflow-x-auto mb-3">
                            <code className="text-sm font-mono text-neutral-200">
                              {children}
                            </code>
                          </pre>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-neutral-500 pl-4 italic text-neutral-300 mb-3">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-neutral-200">{children}</li>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-blue-400 hover:text-blue-300 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      hr: () => <hr className="border-neutral-600 my-4" />,
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                          <table className="min-w-full border-collapse border border-neutral-600">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-neutral-600 px-3 py-2 bg-neutral-700/60 text-left font-semibold text-white">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-neutral-600 px-3 py-2 text-neutral-200">
                          {children}
                        </td>
                      ),
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt}
                          className="max-w-full h-auto rounded-lg shadow-md"
                          style={{ maxHeight: "300px" }}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
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
                <Image src="/wove.png" alt="Logo" width={32} height={32} />
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
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img
                src={selectedImage}
                alt="Selected image"
                className="max-w-full h-auto rounded-lg shadow-md"
                style={{ maxHeight: "150px" }}
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleChatSubmit} className="relative">
            <div
              className={`relative flex items-center gap-2 transition-all duration-200 ${
                isDragOver
                  ? "bg-neutral-700/60 border-2 border-dashed border-neutral-400 rounded-2xl p-2"
                  : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={chatInputRef}
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={
                  isDragOver ? "Drop image here..." : "Message Wove AI..."
                }
                className="flex-1 px-6 py-4 pr-32 bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent resize-none text-white placeholder-neutral-400 text-base transition-all duration-200 shadow-lg"
                disabled={isLoading}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="p-3 bg-neutral-700/80 hover:bg-neutral-600/80 border border-neutral-600/50 hover:border-neutral-500/50 rounded-xl text-neutral-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading || (!chatMessage.trim() && !selectedImage)
                  }
                  className="p-3 bg-neutral-300 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-900 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isDragOver && (
              <div className="text-center text-neutral-400 text-sm mt-2">
                Drop your image here to upload
              </div>
            )}
          </form>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-neutral-500">
            <span>
              Tip: Upload fashion images for personalized styling advice
            </span>
            <span>•</span>
            <span>Drag & drop or click the image icon</span>
            <span>•</span>
            <span>Max size: 5MB</span>
          </div>
          <p className="text-xs text-neutral-500 mt-3 text-center">
            Wove AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
