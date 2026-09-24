import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password — ArtBlush",
  description: "Request a reset link for your ArtBlush account password.",
};

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-40">
      <Reveal>
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Account
        </p>
        <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl">
          Forgot your password?
        </h1>
      </Reveal>

      <div className="mt-14 max-w-md">
        <Reveal>
          <ForgotPasswordForm />
        </Reveal>
      </div>
    </section>
  );
}