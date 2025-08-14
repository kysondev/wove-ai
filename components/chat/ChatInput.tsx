"use client";

import { Send, Image as ImageIcon, X } from "lucide-react";
import { useChat } from "../providers/ChatProvider";

export default function ChatInput() {
  const {
    currentMessageText,
    setCurrentMessageText,
    uploadedImage,
    setUploadedImage,
    isFileBeingDragged,
    setIsFileBeingDragged,
    isProcessingMessage,
    setIsProcessingMessage,
    activeChatSessionId,
    sendMessageToSession,
    editMessageInSession,
    messageInputRef,
    imageUploadRef,
    allChatSessions,
  } = useChat();

  const currentSession = allChatSessions.find(
    (session) => session.id === activeChatSessionId
  );
  const conversationHistory = currentSession?.messages || [];

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
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileBeingDragged(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileBeingDragged(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileBeingDragged(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (imageUploadRef.current) {
      imageUploadRef.current.value = "";
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((currentMessageText.trim() || uploadedImage) && !isProcessingMessage) {
      const userMessageContent = currentMessageText.trim();

      const userMessage = {
        id: Date.now().toString(),
        type: "user" as const,
        content: userMessageContent,
        image: uploadedImage || undefined,
        timestamp: new Date(),
      };

      setCurrentMessageText("");
      setUploadedImage(null);
      if (imageUploadRef.current) {
        imageUploadRef.current.value = "";
      }

      setIsProcessingMessage(true);

      const creation = await sendMessageToSession(
        activeChatSessionId,
        userMessage
      );
      const newSessionId = creation?.sessionId;
      const effectiveSessionId = newSessionId || activeChatSessionId;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessageContent,
            image: uploadedImage,
            conversationHistory: conversationHistory.map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content,
              image: msg.image,
            })),
          }),
        });

        if (!res.ok) throw new Error("Chat API error");

        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant" as const,
          content: "",
          timestamp: new Date(),
        };

        const aiCreation = await sendMessageToSession(
          effectiveSessionId,
          aiResponse
        );
        const savedAiMessageId = aiCreation?.messageId || aiResponse.id;

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullContent += chunk;

            editMessageInSession(
              effectiveSessionId,
              savedAiMessageId,
              fullContent
            );
          }
        }
      } catch (err) {
        console.error("Chat API error:", err);
        const errorResponse = {
          id: (Date.now() + 2).toString(),
          type: "assistant" as const,
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        };
        await sendMessageToSession(effectiveSessionId, errorResponse);
      } finally {
        setIsProcessingMessage(false);
      }
    }
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800/50 px-6 py-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {uploadedImage && (
          <div className="mb-4 relative inline-block">
            <img
              src={uploadedImage}
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
              isFileBeingDragged
                ? "bg-neutral-700/60 border-2 border-dashed border-neutral-400 rounded-2xl p-2"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={messageInputRef}
              type="text"
              value={currentMessageText}
              onChange={(e) => setCurrentMessageText(e.target.value)}
              placeholder={
                isFileBeingDragged ? "Drop image here..." : "Message Wove AI..."
              }
              className="flex-1 px-6 py-4 pr-32 bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent resize-none text-white placeholder-neutral-400 text-base transition-all duration-200 shadow-lg"
              disabled={isProcessingMessage}
            />
            <input
              ref={imageUploadRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => imageUploadRef.current?.click()}
                disabled={isProcessingMessage}
                className="p-3 bg-neutral-700/80 hover:bg-neutral-600/80 border border-neutral-600/50 hover:border-neutral-500/50 rounded-xl text-neutral-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload image"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={
                  isProcessingMessage ||
                  (!currentMessageText.trim() && !uploadedImage)
                }
                className="p-3 bg-neutral-300 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-900 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          {isFileBeingDragged && (
            <div className="text-center text-neutral-400 text-sm mt-2">
              Drop your image here to upload
            </div>
          )}
        </form>
        <div className="sm:flex items-center justify-center gap-4 mt-3 text-xs text-neutral-500 hidden">
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
  );
}
