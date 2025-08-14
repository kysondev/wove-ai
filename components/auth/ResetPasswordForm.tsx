"use client";
import { resetPassword } from "actions/auth.action";
import { Loading } from "components/ui/loading";
import Form from "next/form";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
      redirect("/auth/forgot-password");
    }
  }, [token]);
  return (
    <>
      <Form
        action={async (formData) => {
          startTransition(async () => {
            await resetPassword(formData, token as string);
          });
        }}
        className="space-y-6"
      >
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
            placeholder="Enter your new password"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-base transition-all duration-200 placeholder-neutral-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            placeholder="Confirm your new password"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 backdrop-blur-sm text-white border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-base transition-all duration-200 placeholder-neutral-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-neutral-300 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-900 font-medium py-3 px-4 text-base rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4"
        >
          {isPending ? <Loading /> : "Reset Password"}
        </button>
      </Form>
    </>
  );
};
export default ResetPasswordForm;
