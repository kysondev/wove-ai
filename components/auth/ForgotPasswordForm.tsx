"use client";
import { forgotPassword, signUp } from "actions/auth.action";
import { Loading } from "components/ui/loading";
import Form from "next/form";
import { useTransition } from "react";

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <Form
        action={async (formData) => {
          startTransition(async () => {
            await forgotPassword(formData);
            console.log("Password reset link sent to your email.");
          });
        }}
        className="space-y-6"
      >
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
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-neutral-300 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-900 font-medium py-3 px-4 text-base rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4"
        >
          {isPending ? <Loading /> : "Send Reset Link"}
        </button>
      </Form>
    </>
  );
};
export default ForgotPasswordForm;
