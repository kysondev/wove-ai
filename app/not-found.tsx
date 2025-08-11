import Link from "next/link";
import { Bot, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8">
      <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-2xl">
          <Bot className="h-12 w-12 text-neutral-800" />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-white tracking-tight font-sans">
            404
          </h1>
          <p className="text-2xl text-neutral-300 font-medium">
            Page Not Found
          </p>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-8 shadow-lg max-w-lg">
          <p className="text-lg text-neutral-300 leading-relaxed mb-6">
            The page you are looking for might have been moved or doesn&apos;t
            exist.
          </p>
          
          <div className="space-y-3 text-left">
            <p className="text-base text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-500 rounded-full"></span>
              Check if the URL is correct
            </p>
            <p className="text-base text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-500 rounded-full"></span>
              Go back to the homepage
            </p>
          </div>
        </div>
        
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900 font-semibold rounded-2xl hover:from-neutral-200 hover:to-neutral-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Home className="h-5 w-5" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
