"use server";

import { PrismaClient } from "../generated/prisma-client";

const prisma = new PrismaClient();

export interface ChatMessage {
	id: string;
	type: "user" | "assistant";
	content: string;
	image?: string;
	timestamp: Date;
}

export interface ChatSession {
	id: string;
	title: string;
	timestamp: Date;
	messageCount: number;
	messages: ChatMessage[];
}

export const findSessionsByUser = async (userId: string): Promise<ChatSession[]> => {
	const sessions = await prisma.chatSession.findMany({
		where: { userId, isArchived: false },
		include: { messages: { orderBy: { createdAt: "asc" } } },
		orderBy: { updatedAt: "desc" },
	});

	return sessions.map((session) => ({
		id: session.id,
		title: session.title,
		timestamp: session.updatedAt,
		messageCount: session.messages.length,
		messages: session.messages.map((msg) => ({
			id: msg.id,
			type: (msg.type === "user" ? "user" : "assistant") as "user" | "assistant",
			content: msg.content,
			image: msg.imageUrl || undefined,
			timestamp: msg.createdAt,
		})),
	}));
}

export const createSessionForUser = async (userId: string): Promise<ChatSession> => {
	const newSession = await prisma.chatSession.create({
		data: {
			userId,
			title: "New Chat",
			messages: {
				create: {
					content:
						"Hello there, I am Wove, your personal fashion Assistant! Ready to help you with all your fashion/styling needs! To get started, do you have any specific outfit choices you have in mind?👔",
					type: "assistant",
				},
			},
		},
		include: { messages: true },
	});

	return {
		id: newSession.id,
		title: newSession.title,
		timestamp: newSession.createdAt,
		messageCount: newSession.messages.length,
		messages: newSession.messages.map((msg) => ({
			id: msg.id,
			type: (msg.type === "user" ? "user" : "assistant") as "user" | "assistant",
			content: msg.content,
			image: msg.imageUrl || undefined,
			timestamp: msg.createdAt,
		})),
	};
}

export const deleteSessionForUser = async (sessionId: string, userId: string): Promise<boolean> => {
	const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
	if (!session) throw new Error("Session not found or access denied");
	await prisma.chatSession.delete({ where: { id: sessionId } });
	return true;
}

export const createMessage = async (
	sessionId: string,
	message: ChatMessage,
	userId: string,
): Promise<ChatMessage> => {
	const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
	if (!session) throw new Error("Session not found or access denied");

	const savedMessage = await prisma.chatMessage.create({
		data: {
			content: message.content,
			type: message.type,
			imageUrl: message.image,
			sessionId,
			metadata: { timestamp: message.timestamp.toISOString() },
		},
	});

	if (message.type === "user") {
		const messageCount = await prisma.chatMessage.count({ where: { sessionId } });
		if (messageCount === 2) {
			await prisma.chatSession.update({
				where: { id: sessionId },
				data: {
					title: message.content.slice(0, 50) + (message.content.length > 50 ? "..." : ""),
					updatedAt: new Date(),
				},
			});
		}
	}

	await prisma.chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

	return {
		id: savedMessage.id,
		type: (savedMessage.type === "user" ? "user" : "assistant") as "user" | "assistant",
		content: savedMessage.content,
		image: savedMessage.imageUrl || undefined,
		timestamp: savedMessage.createdAt,
	};
}

export const updateSessionTitleForUser = async (
	sessionId: string,
	title: string,
	userId: string,
): Promise<boolean> => {
	const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
	if (!session) throw new Error("Session not found or access denied");
	await prisma.chatSession.update({ where: { id: sessionId }, data: { title, updatedAt: new Date() } });
	return true;
}

export const updateMessageContentForUser = async (
	sessionId: string,
	messageId: string,
	content: string,
	userId: string,
): Promise<boolean> => {
	const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
	if (!session) throw new Error("Session not found or access denied");
	await prisma.chatMessage.update({
		where: { id: messageId },
		data: { content, updatedAt: new Date(), isEdited: true, editedAt: new Date() },
	});
	return true;
}