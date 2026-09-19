"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth/actions";

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="next" value={next} />

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

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}