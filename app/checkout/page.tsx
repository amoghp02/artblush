import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getCartLines, cartTotal } from "@/lib/cart/server";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — ArtBlush",
  description: "Complete your purchase of selected ArtBlush artworks.",
};

export default async function CheckoutPage() {
  const lines = await getCartLines();
  const total = cartTotal(lines);

  if (lines.length === 0) {
    redirect("/cart");
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-40">
      <Reveal>
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Checkout
        </p>
        <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl md:text-6xl">
          Secure checkout.
        </h1>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <Reveal>
          <CheckoutForm totalPaise={total} />
        </Reveal>

        <Reveal delay={100}>
          <div className="border border-foreground/10 bg-[#efe9dc] p-8 lg:sticky lg:top-28">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Order summary
            </h2>
            <ul className="mt-6 space-y-4 divide-y divide-foreground/10">
              {lines.map((line) => (
                <li
                  key={line.artwork.id}
                  className="flex items-baseline justify-between gap-4 pt-4 text-sm"
                >
                  <span className="text-foreground/80">
                    {line.artwork.title}
                    {line.quantity > 1 && (
                      <span className="text-foreground/50"> × {line.quantity}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-foreground">
                    ₹{(((line.artwork.price ?? 0) * line.quantity) / 100).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline justify-between border-t border-foreground/15 pt-6">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60">
                Total (incl. shipping)
              </span>
              <span className="font-display text-2xl font-light text-foreground">
                ₹{(total / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-foreground/50">
              Payments are processed securely by Razorpay. Your card details never
              touch this site.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}