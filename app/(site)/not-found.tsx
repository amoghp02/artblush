import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "Page not found — ArtBlush",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-[1400px] flex-1 flex-col items-center justify-center px-5 py-40 text-center sm:px-8 md:px-10">
      <p className="font-display text-7xl font-light text-foreground/20">404</p>
      <h1 className="mt-4 font-display text-3xl font-light text-foreground sm:text-4xl">
        This page has yet to be drawn.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
        The link may be old, or the page may never have existed. Either way, the
        collection is one click away.
      </p>
      <div className="mt-10">
        <ButtonLink href="/portfolio">Back to the Collection</ButtonLink>
      </div>
    </section>
  );
}