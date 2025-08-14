"use client";
import {
  signInWithGithub,
  signInWithGoogle,
  signUp,
} from "actions/auth.action";
import { Loading } from "components/ui/loading";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <Form
        action={async (formData) => {
          startTransition(async () => {
            await signUp(formData);
          });
        }}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-base transition-all duration-200 placeholder-neutral-500"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-base transition-all duration-200 placeholder-neutral-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a strong password"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-base transition-all duration-200 placeholder-neutral-500"
          />
        </div>

        <div className="flex gap-1 text-sm mt-2">
          <span className="text-neutral-400">Already have an account?</span>
          <Link
            href="login"
            className="text-neutral-200 hover:text-white transition-colors duration-200 underline"
          >
            Login
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-neutral-300 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-900 font-medium py-3 px-4 text-base rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4"
        >
          {isPending ? <Loading /> : "Sign up"}
        </button>
      </Form>
      
      <div className="mt-8 pt-6 border-t border-neutral-700/50">
        <p className="text-sm text-center text-neutral-500 mb-6">
          Or continue with
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={async () => {
              await signInWithGoogle();
            }}
            className="flex items-center justify-center w-full bg-neutral-800/60 hover:bg-neutral-700/60 text-white text-base py-3 px-4 rounded-xl border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200 backdrop-blur-sm"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-3"
            />
            Continue with Google
          </button>
          <button
            onClick={async () => {
              await signInWithGithub();
            }}
            className="flex items-center justify-center w-full bg-neutral-800/60 hover:bg-neutral-700/60 text-white text-base py-3 px-4 rounded-xl border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200 backdrop-blur-sm"
          >
            <Image
              src="/github.svg"
              alt="Github"
              width={20}
              height={20}
              className="mr-3"
            />
            Continue with GitHub
          </button>
        </div>
      </div>
    </>
  );
};
export default SignUpForm;
