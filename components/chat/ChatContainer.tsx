"use client";

import { useChat } from "../providers/ChatProvider";
import ChatMessages from "./ChatMessages";
import ChatMessagesSkeleton from "./ChatMessagesSkeleton";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
  const { isSettingUpChat } = useChat();
  return (
    <>
      {isSettingUpChat ? <ChatMessagesSkeleton /> : <ChatMessages />}
      <ChatInput />
    </>
  );
} 