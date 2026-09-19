import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ButtonLink from "@/components/ButtonLink";
import { getCartLines, cartTotal } from "@/lib/cart/server";
import CartLineControls from "./CartLineControls";

export const metadata: Metadata = {
  title: "Cart — ArtBlush",
  description: "Your selected ArtBlush artworks, ready to check out.",
};

function formatPrice(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default async function CartPage() {
  const lines = await getCartLines();
  const total = cartTotal(lines);

  if (lines.length === 0) {
    return (
      <section className="mx-auto flex max-w-[1400px] flex-1 flex-col items-center justify-center px-5 py-40 text-center sm:px-8 md:px-10">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Cart
        </p>
        <h1 className="font-display text-4xl font-light text-foreground sm:text-5xl">
          Your cart is empty.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">
          Nothing selected yet — the collection is one click away.
        </p>
        <div className="mt-10">
          <ButtonLink href="/portfolio">Browse the Collection</ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-40">
      <Reveal>
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Cart
        </p>
        <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl md:text-6xl">
          Your selection.
        </h1>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
        <Reveal>
          <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
            {lines.map((line) => (
              <CartLineControls
                key={line.artwork.id}
                artwork={line.artwork}
                quantity={line.quantity}
              />
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="border border-foreground/10 bg-[#efe9dc] p-8 lg:sticky lg:top-28">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Order summary
            </h2>
            <div className="mt-6 space-y-3">
              <div className="flex items-baseline justify-between text-sm text-foreground/70">
                <span>Items ({lines.length})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex items-baseline justify-between text-sm text-foreground/70">
                <span>Shipping</span>
                <span>Included</span>
              </div>
            </div>
            <div className="mt-6 flex items-baseline justify-between border-t border-foreground/15 pt-6">
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60">
                Total
              </span>
              <span className="font-display text-2xl font-light text-foreground">
                {formatPrice(total)}
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <ButtonLink href="/checkout">Proceed to Checkout</ButtonLink>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-out border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}