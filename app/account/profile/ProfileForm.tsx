"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/auth/actions";

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
  };
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

      <div className="space-y-8 pt-4">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Saved address
        </h3>
        <p className="text-xs leading-relaxed text-foreground/50">
          Prefilled at checkout. Leave all fields blank to clear your saved
          address.
        </p>

        <div>
          <label
            htmlFor="addressLine1"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            Address line 1 *
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            defaultValue={user.addressLine1}
            autoComplete="address-line1"
            className={inputClasses}
          />
        </div>

        <div>
          <label
            htmlFor="addressLine2"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            Address line 2
          </label>
          <input
            id="addressLine2"
            name="addressLine2"
            type="text"
            defaultValue={user.addressLine2}
            autoComplete="address-line2"
            className={inputClasses}
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
            >
              City *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={user.city}
              autoComplete="address-level2"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
            >
              State *
            </label>
            <input
              id="state"
              name="state"
              type="text"
              defaultValue={user.state}
              autoComplete="address-level1"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="max-w-[160px]">
          <label
            htmlFor="postalCode"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            PIN code *
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            defaultValue={user.postalCode}
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            className={inputClasses}
          />
        </div>
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