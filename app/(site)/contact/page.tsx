import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — ArtBlush",
  description:
    "Commission a hand-drawn portrait, enquire about an artwork, or start a conversation with the ArtBlush studio.",
};

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-44">
        <Reveal>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Contact & commissions
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl md:text-6xl">
            Let’s create something meaningful.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-10 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={100}>
            <div className="border-t border-foreground/10 pt-8 lg:pt-0 lg:border-t-0 lg:border-l lg:border-l-foreground/10 lg:pl-16">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                Direct lines
              </h2>

              <dl className="mt-8 space-y-8">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
                    Instagram
                  </dt>
                  <dd className="mt-2">
                    <a
                      href="https://www.instagram.com/_artblush_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-base text-foreground transition-colors hover:text-accent"
                    >
                      @_artblush_
                      <span aria-hidden="true" className="text-sm">
                        ↗
                      </span>
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href="mailto:hello.artblush@gmail.com"
                      className="text-base text-foreground transition-colors hover:text-accent"
                    >
                      hello.artblush@gmail.com
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
                    Response time
                  </dt>
                  <dd className="mt-2 text-base text-foreground/70">
                    Usually within 1–2 days, always by hand.
                  </dd>
                </div>
              </dl>

              <p className="mt-12 text-sm leading-relaxed text-foreground/55">
                The email address shown is a placeholder — swap it with the studio’s
                real email before launch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}