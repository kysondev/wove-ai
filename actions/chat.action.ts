"use server";

import { revalidatePath } from "next/cache";
import type { ChatMessage, ChatSession } from "../services/chat.service";
import {
  findSessionsByUser,
  createSessionForUser,
  deleteSessionForUser,
  createMessage,
  updateSessionTitleForUser,
  updateMessageContentForUser,
} from "../services/chat.service";

export const getChatSessions = async (
  userId: string
): Promise<ChatSession[]> => {
  return await findSessionsByUser(userId);
};

export const createChatSession = async (userId: string): Promise<ChatSession> => {
  const session = await createSessionForUser(userId);
  revalidatePath("/");
  return session;
}

export const deleteChatSession = async (
  sessionId: string,
  userId: string
): Promise<{ success: boolean }> => {
  await deleteSessionForUser(sessionId, userId);
  revalidatePath("/");
  return { success: true };
}

export const addMessageToSession = async (
  sessionId: string,
  message: ChatMessage,
  userId: string
): Promise<ChatMessage> => {
  const saved = await createMessage(sessionId, message, userId);
  revalidatePath("/");
  return saved;
}

export const updateSessionTitle = async (
  sessionId: string,
  title: string,
  userId: string
): Promise<{ success: boolean }> => {
  await updateSessionTitleForUser(sessionId, title, userId);
  revalidatePath("/");
  return { success: true };
}

export const updateMessageContent = async (
  sessionId: string,
  messageId: string,
  content: string,
  userId: string
): Promise<{ success: boolean }> => {
  await updateMessageContentForUser(sessionId, messageId, content, userId);
  revalidatePath("/");
  return { success: true };
}
