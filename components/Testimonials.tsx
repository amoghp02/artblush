import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    quote:
      "The portrait of my grandmother arrived framed and signed — my mother cried when she opened it. You can feel the hours in every stroke.",
    name: "Ananya R.",
    context: "Portrait commission · Bengaluru",
  },
  {
    quote:
      "Ordered online, it shipped fast and the packaging was exquisite — like receiving a gallery piece. The darkest shading is impossibly soft.",
    name: "Karan M.",
    context: "Original artwork · Mumbai",
  },
  {
    quote:
      "From photograph to finished sketch was easy. The studio kept me updated at every stage and delivered exactly the warmth I hoped for.",
    name: "Sarah D.",
    context: "Couple portrait · Singapore",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-foreground/10 bg-[#efe9dc]">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:px-10 md:py-32">
        <SectionHeading
          eyebrow="Kind words"
          title="Loved by collectors"
          description="Notes from people who welcomed ArtBlush pieces into their homes."
          className="mb-14"
        />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border border-foreground/10 bg-background p-8"
            >
              <span aria-hidden="true" className="font-display text-5xl leading-none text-accent">
                “
              </span>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground/75">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 border-t border-foreground/10 pt-5">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs text-foreground/50">{t.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}