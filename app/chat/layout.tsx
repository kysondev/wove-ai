import { ReactNode } from "react";
import { getUser } from "@/services/user.service";
import { ChatProvider } from "../../components/providers/ChatProvider";
import ChatLayout from "../../components/chat/ChatLayout";
import { User } from "@/generated/prisma-client";

export default async function ChatRouteLayout({ children }: { children: ReactNode }) {
	const result = await getUser();
	const user = result.success ? result.data : null;
	return (
		<ChatProvider user={user as User}>
			<ChatLayout>{children}</ChatLayout>
		</ChatProvider>
	);
}