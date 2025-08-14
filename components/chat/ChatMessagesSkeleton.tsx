"use client";

export default function ChatMessagesSkeleton() {
	return (
		<div className="flex-1 overflow-y-auto px-6 py-8 animate-pulse">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex gap-4 justify-start">
					<div className="w-10 h-10 rounded-full bg-neutral-800/70 flex-shrink-0" />
					<div className="bg-neutral-800/70 border border-neutral-700/50 rounded-2xl w-3/4 h-20" />
				</div>
				<div className="flex gap-4 justify-end">
					<div className="bg-neutral-200/10 rounded-2xl w-1/2 h-12" />
				</div>
				<div className="flex gap-4 justify-start">
					<div className="w-10 h-10 rounded-full bg-neutral-800/70 flex-shrink-0" />
					<div className="bg-neutral-800/70 border border-neutral-700/50 rounded-2xl w-2/3 h-24" />
				</div>
			</div>
		</div>
	);
}