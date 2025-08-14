import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-2xl">
            <Image src="/wove.png" alt="Logo" width={64} height={64} />
          </div>
        </div>
        
        <h1 className="text-8xl font-bold text-white tracking-tight mb-6">
          404
        </h1>
        
        <p className="text-2xl text-neutral-300 font-medium mb-8">
          Oops! This page doesn't exist.
        </p>
        
        <p className="text-lg text-neutral-400 mb-12 max-w-md mx-auto leading-relaxed">
          The page you're looking for might have been moved, deleted, or never existed in the first place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900 font-semibold rounded-2xl hover:from-neutral-200 hover:to-neutral-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-800/60 backdrop-blur-sm text-white font-semibold rounded-2xl border border-neutral-700/50 hover:bg-neutral-700/60 hover:border-neutral-600/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
