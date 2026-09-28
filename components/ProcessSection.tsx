import { RevealGroup, RevealItem } from "./motion/fade-in";

interface ProcessStep {
  number: string;
  title: string;
  text: string;
}

interface ProcessSectionProps {
  steps: ProcessStep[];
  className?: string;
}

export default function ProcessSection({ steps, className = "" }: ProcessSectionProps) {
  return (
    <RevealGroup
      className={`grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      staggerDelay={0.08}
    >
      {steps.map((step) => (
        <RevealItem
          key={step.number}
          className="bg-[#efe9dc] p-8 transition-colors duration-500 hover:bg-[#e9e2d2]"
        >
          <p className="font-display text-sm italic text-accent">{step.number}</p>
          <h3 className="mt-5 font-display text-xl font-light text-foreground">
            {step.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/60">{step.text}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}