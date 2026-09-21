import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ArtworkImage from "@/components/ArtworkImage";
import ProcessSection from "@/components/ProcessSection";
import ButtonLink from "@/components/ButtonLink";

export const metadata: Metadata = {
  title: "About — ArtBlush",
  description:
    "Behind every sketch is a story. Meet the artist behind ArtBlush and discover the hands and philosophy shaping each hand-drawn piece.",
};

const steps = [
  { number: "01", title: "Reference", text: "A photograph, a memory, a brief — the seed of the work." },
  { number: "02", title: "Composition", text: "Gesture and placement — deciding where the eye travels first." },
  { number: "03", title: "Sketch", text: "Loose lines establish structure, likeness and proportion." },
  { number: "04", title: "Detail", text: "Values deepen in layers; surfaces begin to feel like skin and cloth." },
  { number: "05", title: "Final", text: "A finished, signed artwork — refined to the point of effortless." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-44">
        <Reveal>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            The artist & studio
          </p>
          <h1 className="max-w-4xl font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl md:text-6xl">
            Behind every sketch is a story.
          </h1>
        </Reveal>
      </section>

      {/* Artist intro */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="relative overflow-hidden bg-[#e8e2d3] pb-[120%]">
              <ArtworkImage
                src="/portfolio-photos/with-a-bow.png"
                alt="A finished portrait study — graphite, signed and ready for its frame"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 border border-foreground/5" />
            </div>
            <p className="mt-4 text-xs tracking-wide text-foreground/50">
              A finished portrait — drawn by hand, signed by the artist.
            </p>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                  Introduction
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-foreground/80">
                  I am a pencil-and-charcoal artist working from a small sunlit studio,
                  drawing the people and moments that matter. I began with graphite
                  studies of my own family; today that same slow, patient practice
                  shapes every portrait that leaves the studio.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                  Philosophy
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-foreground/80">
                  A drawing does not need to shout. The strongest portraits are quiet
                  ones — built from weight of line, honesty of shadow, and the trust
                  between sitter and artist. I draw people as they are, held in the
                  most human light I can find.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                  Creative process
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-foreground/80">
                  Every commission begins with a conversation, not a canvas. I listen
                  for the story before I reach for the pencil — the way a person sits,
                  the joke they share, the person they were in a favourite photograph.
                  Likeness is technique; feeling is listening.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                  Why ArtBlush exists
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-foreground/80">
                  ArtBlush exists because a photograph can be lost, but a drawing can
                  be felt. I wanted to make work that keeps people near — grandparents,
                  children, friends — in a medium slow enough to carry meaning. When a
                  home receives a portrait, it stops being decoration and becomes a
                  presence.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The ArtBlush Process */}
      <section className="border-t border-foreground/10 bg-[#efe9dc]">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:px-10 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="The ArtBlush Process"
              description="From the first photograph to the final stroke — a slow, considered approach to every piece."
              className="mb-14"
            />
          </Reveal>
          <ProcessSection steps={steps} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8 md:px-10 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Commission"
            title="Have an idea for a portrait?"
            description="Tell me about the person, the photograph, or the moment you want drawn."
            align="center"
          />
          <div className="mt-10">
            <ButtonLink href="/contact">Start a Conversation →</ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}