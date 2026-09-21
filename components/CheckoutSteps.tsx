import Link from "next/link";
import { Check } from "lucide-react";

const steps = [
  { label: "Bag", href: "/cart" },
  { label: "Details & Payment", href: "/checkout" },
  { label: "Confirmation", href: "/checkout/success" },
];

export default function CheckoutSteps({ current }: { current: number }) {
  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          return (
            <li key={step.label} className="flex flex-1 items-center last:flex-none">
              {isDone ? (
                <Link
                  href={step.href}
                  className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-accent"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-background">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] ${
                    isCurrent ? "text-foreground" : "text-foreground/40"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                      isCurrent
                        ? "border-accent text-accent"
                        : "border-foreground/20 text-foreground/40"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              )}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mx-3 h-px flex-1 ${
                    index < current ? "bg-accent" : "bg-foreground/15"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}