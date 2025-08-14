"use client";

import { useState } from "react";
import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useChat } from "./providers/ChatProvider";
import Link from "next/link";

export default function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const {
    allChatSessions,
    activeChatSessionId,
    removeChatSession,
    currentUser,
  } = useChat();

  const [isHovered, setIsHovered] = useState<string | null>(null);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800/50 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-80 flex-shrink-0
      `}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-lg">
              <Image src="/wove.png" alt="Logo" width={32} height={32} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Wove AI</h2>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <Link
            href="/chat/new"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-800/60 hover:bg-neutral-700/60 border border-neutral-700/50 hover:border-neutral-600/50 rounded-xl text-white transition-all duration-200 group"
          >
            <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">New Chat</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {!currentUser?.id ? (
            <div className="text-center py-8 text-neutral-500 text-sm">Sign in to view your chats</div>
          ) : allChatSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">No chat history yet</p>
              <p className="text-neutral-600 text-xs mt-1">Start a conversation to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allChatSessions
                .filter((session) => session.id)
                .map((session) => (
                  <Link href={`/chat/${session.id}`} key={session.id} className="block">
                    <div
                      className={`
                      relative group cursor-pointer rounded-xl p-3 transition-all duration-200
                      ${activeChatSessionId === session.id
                        ? 'bg-neutral-800/80 border border-neutral-600/50'
                        : 'hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50'
                      }
                    `}
                      onMouseEnter={() => setIsHovered(session.id)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                            <h3 className="text-sm font-medium text-white truncate">{session.title}</h3>
                          </div>
                          <div className="flex items-center justify-between text-xs text-neutral-400">
                            <span>{session.messageCount} messages</span>
                            <span>{formatTimestamp(session.timestamp)}</span>
                          </div>
                        </div>

                        {isHovered === session.id && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeChatSession(session.id);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Delete chat"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-800/50">
          <div className="text-center text-xs text-neutral-500">
            <p>Wove AI - Your Fashion Assistant</p>
          </div>
        </div>
      </div>
    </>
  );
} 