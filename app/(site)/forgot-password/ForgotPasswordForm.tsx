"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {
    error: null,
    done: false,
  });

  if (state.done) {
    return (
      <div className="border border-accent/30 bg-accent/5 px-6 py-6">
        <p className="text-sm leading-relaxed text-foreground">
          If an account exists for that email, a password reset link is on its
          way. Check your inbox (and spam folder) — the link expires in 30
          minutes.
        </p>
        <p className="mt-4">
          <Link
            href="/login"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
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

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] text-background transition-colors bg-foreground hover:bg-[#3a352c] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
        <Link
          href="/login"
          className="text-sm text-accent underline-offset-4 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}