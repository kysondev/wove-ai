"use client";

import { PropsWithChildren } from "react";
import { useChat } from "../providers/ChatProvider";
import Sidebar from "../Sidebar";
import ChatHeader from "./ChatHeader";

export default function ChatLayout({ children }: PropsWithChildren) {
	const { isSidebarVisible, setIsSidebarVisible } = useChat();
	return (
		<div className="flex h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
			<Sidebar isOpen={isSidebarVisible} onToggle={() => setIsSidebarVisible(!isSidebarVisible)} />
			<div className="flex-1 flex flex-col">
				<ChatHeader onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
				{children}
			</div>
		</div>
	);
}