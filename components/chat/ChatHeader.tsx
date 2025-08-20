"use client";

import { useChat } from "../providers/ChatProvider";
import Link from "next/link";
import { Home, Menu, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  const { activeChatSessionId, allChatSessions, currentUser } = useChat();

  const currentSession = allChatSessions.find((session) => session.id === activeChatSessionId);

  const handleLogout = async () => {
    await authClient.signOut();
    redirect("/auth/login");
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/50 px-6 py-4 h-[65px] flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{currentSession?.title || "New Chat"}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser?.id ? (
          <>
            <span className="text-sm text-neutral-300 truncate max-w-[160px]">{currentUser.name || currentUser.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="px-4 py-2 text-neutral-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 