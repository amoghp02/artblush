"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/auth/actions";

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

interface ProfileFormProps {
  user: { name: string; email: string; phone: string };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-10 space-y-8">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={user.name}
          autoComplete="name"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
          disabled
          className={`${inputClasses} opacity-50 disabled:cursor-not-allowed`}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone}
          autoComplete="tel"
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
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}