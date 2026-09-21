import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ButtonLink from "@/components/ButtonLink";
import CheckoutSteps from "@/components/CheckoutSteps";
import { getOrderById } from "../actions";

export const metadata: Metadata = {
  title: "Order confirmed — ArtBlush",
  description: "Thank you for your purchase. Your order is confirmed.",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; payment?: string }>;
}) {
  const { order: orderId, payment: paymentId } = await searchParams;
  const order = orderId ? await getOrderById(orderId) : null;

  return (
    <section className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-40 text-center sm:px-8 md:px-10">
      <Reveal>
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          ArtBlush
        </p>
        <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl md:text-6xl">
          Thank you — your order is confirmed.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-foreground/60">
          A confirmation has been sent to your email. The studio will reach out
          within 1–2 days with shipping details for your artwork.
        </p>

        <div className="mx-auto mt-10 max-w-xl">
          <CheckoutSteps current={2} />
        </div>

        <div className="mx-auto mt-12 max-w-md border border-foreground/10 bg-[#efe9dc] p-8 text-left">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-6">
              <dt className="text-foreground/45">Order reference</dt>
              <dd className="text-foreground">{order?.id.slice(0, 8) ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-foreground/45">Payment ID</dt>
              <dd className="text-foreground">{paymentId ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-foreground/45">Status</dt>
              <dd className="text-foreground">
                {order ? "Confirmed" : "Received"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <ButtonLink href="/portfolio">Explore the Collection</ButtonLink>
          <ButtonLink href="/about" variant="outline">
            About the Artist
          </ButtonLink>
        </div>

        <p className="mt-12 text-xs leading-relaxed text-foreground/50">
          Questions about your order?{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-accent">
            Contact the studio
          </Link>
          .
        </p>
      </Reveal>
    </section>
  );
}