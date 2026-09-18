import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ButtonLink from "./ButtonLink";

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export default function CTASection({
  eyebrow,
  title,
  text,
  primary,
  secondary,
}: CTASectionProps) {
  return (
    <section className="border-t border-foreground/10">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={text}
            align="center"
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="outline">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}