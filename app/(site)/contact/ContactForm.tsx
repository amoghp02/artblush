"use client";

import { useActionState, useState } from "react";
import { submitCommission } from "./actions";

const enquiryTypes = [
  "Custom Portrait",
  "Original Artwork",
  "Collaboration",
  "General Enquiry",
];

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitCommission, {
    ok: false,
    error: null,
  });
  const [reset, setReset] = useState(false);

  if (state.ok && !reset) {
    return (
      <div className="border border-foreground/10 bg-[#efe9dc] p-8 sm:p-10" role="status">
        <p className="font-display text-2xl font-light text-foreground sm:text-3xl">
          Thank you — your enquiry is on its way.
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
          We’ll be in touch within 1–2 days. If it’s urgent, reach out on Instagram or
          by email and mention your enquiry.
        </p>
        <button
          type="button"
          onClick={() => setReset(true)}
          className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
        >
          Send another enquiry →
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={() => setReset(false)} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            Name *
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClasses} />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            Email *
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClasses} />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </div>
        <div>
          <label
            htmlFor="enquiryType"
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
          >
            What are you looking for? *
          </label>
          <select id="enquiryType" name="enquiryType" required defaultValue="" className={`${inputClasses} cursor-pointer`}>
            <option value="" disabled>
              Select a reason
            </option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about the person, photograph, or idea&hellip;"
          className={`${inputClasses} resize-none`}
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
        {pending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}