"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword } from "./actions";

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, {
    error: null,
  });

  if (!token) {
    return (
      <div className="border border-accent/30 bg-accent/5 px-6 py-6">
        <p className="text-sm leading-relaxed text-foreground">
          This reset link is missing or incomplete. Please request a fresh one.
        </p>
        <p className="mt-4">
          <Link
            href="/forgot-password"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="token" value={token} />

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          New password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Confirm new password *
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClasses}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] text-background transition-colors bg-foreground hover:bg-[#3a352c] disabled:opacity-60"
      >
        {pending ? "Setting…" : "Set new password"}
      </button>
    </form>
  );
}