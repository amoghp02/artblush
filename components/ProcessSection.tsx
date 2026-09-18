import Reveal from "./Reveal";

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
    <ol className={`grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {steps.map((step, i) => (
        <li key={step.number} className="bg-[#efe9dc] p-8 transition-colors duration-500 hover:bg-[#e9e2d2]">
          <Reveal delay={i * 80}>
            <p className="font-display text-sm italic text-accent">{step.number}</p>
            <h3 className="mt-5 font-display text-xl font-light text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60">{step.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}