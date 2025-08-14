import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-2xl mx-auto mb-6">
          <Image src="/wove.png" alt="Logo" width={48} height={48} />
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <p className="text-neutral-400 mt-4">Loading Wove AI...</p>
      </div>
    </div>
  );
} 