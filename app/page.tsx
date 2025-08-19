import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-lg">
            <Image src="/wove.png" alt="Logo" width={32} height={32} />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Wove AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-neutral-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Image src="/wove.png" alt="Logo" width={64} height={64} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
              Your Personal Fashion Assistant
            </h1>
            <p className="text-xl text-neutral-300 leading-relaxed">
              Get personalized styling advice, outfit recommendations, and
              fashion insights powered by AI
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/chat/new"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900 font-semibold rounded-xl hover:from-neutral-200 hover:to-neutral-300 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Start New Chat
            </Link>
            <div className="text-sm text-neutral-500">
              No account required • Start chatting immediately
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
