import ForgotPasswordForm from "components/auth/ForgotPasswordForm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800/50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-neutral-400" />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-lg">
              <Image src="/wove.png" alt="Logo" width={32} height={32} />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">Wove AI</h1>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl p-8 rounded-2xl border border-neutral-800/50 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Reset your password</h2>
            <p className="text-neutral-400 text-sm">Enter your email to receive reset instructions</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
