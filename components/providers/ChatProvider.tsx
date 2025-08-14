"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getChatSessions,
  createChatSession,
  deleteChatSession,
  addMessageToSession as addMessageToSessionAction,
  updateMessageContent,
} from "../../actions/chat.action";
import { usePathname } from "next/navigation";
import { User } from "@/generated/prisma-client";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  messages: ChatMessage[];
}

interface ChatContextType {
  currentMessageText: string;
  uploadedImage: string | null;
  isFileBeingDragged: boolean;
  isProcessingMessage: boolean;
  isSidebarVisible: boolean;
  isSettingUpChat: boolean;
  allChatSessions: ChatSession[];
  activeChatSessionId: string;
  currentUser?: User | null;
  currentChatMessages: ChatMessage[];

  setCurrentMessageText: (message: string) => void;
  setUploadedImage: (image: string | null) => void;
  setIsFileBeingDragged: (isDragging: boolean) => void;
  setIsProcessingMessage: (isProcessing: boolean) => void;
  setIsSidebarVisible: (isVisible: boolean) => void;
  startNewChat: () => void;
  switchToChatSession: (sessionId: string) => void;
  removeChatSession: (sessionId: string) => Promise<void>;
  sendMessageToSession: (
    sessionId: string,
    message: ChatMessage
  ) => Promise<{ sessionId?: string; messageId?: string } | undefined>;
  editMessageInSession: (
    sessionId: string,
    messageId: string,
    content: string
  ) => Promise<void>;

  messageInputRef: React.RefObject<HTMLInputElement | null>;
  chatScrollToBottomRef: React.RefObject<HTMLDivElement | null>;
  imageUploadRef: React.RefObject<HTMLInputElement | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
  user?: User | null;
  initialChatId?: string;
}

export function ChatProvider({
  children,
  user,
  initialChatId,
}: ChatProviderProps) {
  const pathname = usePathname();
  const detectedChatId =
    initialChatId ??
    (pathname?.startsWith("/chat/new")
      ? "new"
      : pathname?.startsWith("/chat/")
        ? pathname.split("/")[2]
        : undefined);
  const [currentMessageText, setCurrentMessageText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isFileBeingDragged, setIsFileBeingDragged] = useState(false);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSettingUpChat, setIsSettingUpChat] = useState(true);

  const [allChatSessions, setAllChatSessions] = useState<ChatSession[]>([]);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string>(
    detectedChatId === "new" ? "" : ""
  );

  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatScrollToBottomRef = useRef<HTMLDivElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const activeChatSession = allChatSessions.find(
    (session) => session.id === activeChatSessionId
  );
  const currentChatMessages = activeChatSession?.messages || [];

  const createWelcomeChatSession = (): ChatSession => ({
    id: "",
    title: "New Chat",
    timestamp: new Date(),
    messageCount: 1,
    messages: [
      {
        id: "greeting",
        type: "assistant",
        content:
          "Hello there, I am Wove, your personal fashion Assistant! Ready to help you with all your fashion/styling needs! To get started, do you have any specific outfit choices you have in mind?👔",
        timestamp: new Date(),
      },
    ],
  });

  const startNewChat = useCallback(() => {
    setAllChatSessions((previousSessions) => [
      createWelcomeChatSession(),
      ...previousSessions.filter((session) => session.id !== ""),
    ]);
    setActiveChatSessionId("");
    setIsSidebarVisible(false);
    setCurrentMessageText("");
    setUploadedImage(null);
  }, []);

  useEffect(() => {
    const setupInitialChatState = async () => {
      setIsSettingUpChat(true);
      try {
        let userChatSessions: ChatSession[] = [];
        if (user?.id) {
          userChatSessions = await getChatSessions(user.id);
        }

        if (detectedChatId === "new") {
          setAllChatSessions([createWelcomeChatSession(), ...userChatSessions]);
          setActiveChatSessionId("");
        } else if (detectedChatId) {
          setAllChatSessions(userChatSessions);
          const foundSession = userChatSessions.find((session) => session.id === detectedChatId);
          if (foundSession) setActiveChatSessionId(foundSession.id);
          else if (userChatSessions[0]) setActiveChatSessionId(userChatSessions[0].id);
        } else {
          setAllChatSessions(userChatSessions);
          if (userChatSessions[0]) setActiveChatSessionId(userChatSessions[0].id);
        }
      } finally {
        setIsSettingUpChat(false);
      }
    };
    setupInitialChatState();
  }, [user?.id, detectedChatId]);

  useEffect(() => {
    chatScrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  const switchToChatSession = (sessionId: string) => {
    setActiveChatSessionId(sessionId);
    setIsSidebarVisible(false);
  };

  const removeSessionFromLocalState = (sessionId: string) => {
    setAllChatSessions((previousSessions) => previousSessions.filter((session) => session.id !== sessionId));
    if (activeChatSessionId === sessionId) {
      const remainingSessions = allChatSessions.filter((session) => session.id !== sessionId);
      setActiveChatSessionId(remainingSessions[0]?.id || "");
    }
  };

  const removeChatSession = async (sessionId: string) => {
    try {
      if (!user?.id) return;
      await deleteChatSession(sessionId, user.id);
      removeSessionFromLocalState(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const sendMessageToSession = async (
    sessionId: string,
    message: ChatMessage
  ): Promise<{ sessionId?: string; messageId?: string } | undefined> => {
    try {
      let targetSessionId = sessionId;

      if (!targetSessionId && user?.id) {
        const newSession = await createChatSession(user.id);
        setAllChatSessions((previousSessions) => [
          newSession,
          ...previousSessions.filter((session) => session.id !== ""),
        ]);
        setActiveChatSessionId(newSession.id);
        targetSessionId = newSession.id;
      }

      setAllChatSessions((previousSessions) =>
        previousSessions.map((session) => {
          const isTargetSession = targetSessionId
            ? session.id === targetSessionId
            : session.id === "";
          if (!isTargetSession) return session;
          const updatedMessages = [...session.messages, message];
          const newMessageCount = session.messages.length + 1;
          const shouldUpdateTitle =
            message.type === "user" && session.messages.length === 1;
          const newTitle = shouldUpdateTitle
            ? message.content.length > 50
              ? message.content.slice(0, 50) + "..."
              : message.content
            : session.title;
          return {
            ...session,
            title: newTitle,
            messages: updatedMessages,
            messageCount: newMessageCount,
          };
        })
      );

      let savedMessageId: string | undefined;
      if (targetSessionId && user?.id) {
        const savedMessage = await addMessageToSessionAction(
          targetSessionId,
          message,
          user.id
        );
        setAllChatSessions((previousSessions) =>
          previousSessions.map((session) =>
            session.id === targetSessionId
              ? {
                  ...session,
                  messages: session.messages.map((msg) =>
                    msg.id === message.id ? { ...msg, id: savedMessage.id } : msg
                  ),
                }
              : session
          )
        );
        savedMessageId = savedMessage.id;
      }

      return {
        sessionId: targetSessionId || undefined,
        messageId: savedMessageId,
      };
    } catch (error) {
      console.error("Failed to add message:", error);
      return undefined;
    }
  };

  const editMessageInSession = async (
    sessionId: string,
    messageId: string,
    content: string
  ) => {
    setAllChatSessions((previousSessions) =>
      previousSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: session.messages.map((msg) =>
                msg.id === messageId ? { ...msg, content } : msg
              ),
            }
          : session
      )
    );

    if (user?.id && sessionId) {
      try {
        await updateMessageContent(sessionId, messageId, content, user.id);
      } catch (error) {
        console.error("Failed to persist message update:", error);
      }
    }
  };

  const contextValue: ChatContextType = {
    currentMessageText,
    uploadedImage,
    isFileBeingDragged,
    isProcessingMessage,
    isSidebarVisible,
    isSettingUpChat,
    allChatSessions,
    activeChatSessionId,
    currentUser: user,
    currentChatMessages,
    setCurrentMessageText,
    setUploadedImage,
    setIsFileBeingDragged,
    setIsProcessingMessage,
    setIsSidebarVisible,
    startNewChat,
    switchToChatSession,
    removeChatSession,
    sendMessageToSession,
    editMessageInSession,
    messageInputRef,
    chatScrollToBottomRef,
    imageUploadRef,
  };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
