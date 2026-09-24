import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create account — ArtBlush",
  description: "Create an ArtBlush account to check out and track your orders.",
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-40">
      <Reveal>
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Account
        </p>
        <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl">
          Create your account.
        </h1>
      </Reveal>

      <div className="mt-14 max-w-md">
        <Reveal>
          <SignupForm next={next ?? "/account"} />
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 text-sm text-foreground/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}