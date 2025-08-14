"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { User } from "lucide-react";
import { useChat } from "../providers/ChatProvider";

export default function ChatMessages() {
  const {
    allChatSessions,
    activeChatSessionId,
    isProcessingMessage,
    chatScrollToBottomRef,
  } = useChat();

  const currentSession = allChatSessions.find(
    (session) => session.id === activeChatSessionId
  );
  const chatHistory = currentSession?.messages || [];

  return (
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

        {isProcessingMessage && (
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

        <div ref={chatScrollToBottomRef} />
      </div>
    </div>
  );
} 