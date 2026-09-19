"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCheckoutOrder, confirmPaidOrder } from "./actions";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      on: (
        event: string,
        handler: (response: Record<string, unknown>) => void,
      ) => void;
      open: () => void;
    };
  }
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CheckoutFormProps {
  totalPaise: number;
}

const inputClasses =
  "w-full border-b border-foreground/15 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none";

export default function CheckoutForm({ totalPaise }: CheckoutFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await createCheckoutOrder({
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone")),
          addressLine1: String(form.get("addressLine1")),
          addressLine2: String(form.get("addressLine2") || ""),
          city: String(form.get("city")),
          state: String(form.get("state")),
          postalCode: String(form.get("postalCode")),
        });

        await openRazorpay(result, {
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone")),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      }
    });
  }

  function openRazorpay(
    result: Awaited<ReturnType<typeof createCheckoutOrder>>,
    prefill: { name: string; email: string; phone: string },
  ) {
    return new Promise<void>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onerror = () => {
        setError(
          "Unable to load the payment gateway. Check your connection and try again.",
        );
        resolve();
      };
      script.onload = () => {
        setProcessing(true);
        const checkout = new window.Razorpay!({
          key: result.keyId,
          order_id: result.razorpayOrderId,
          amount: result.amountPaise,
          currency: result.currency,
          name: "ArtBlush",
          description: "ArtBlush artwork purchase",
          prefill,
          handler: async (response: RazorpaySuccessResponse) => {
            const confirmed = await confirmPaidOrder({
              razorpayOrderId: String(response.razorpay_order_id),
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              dbOrderId: result.dbOrderId,
            });
            if (!confirmed.ok) {
              setProcessing(false);
              setError(confirmed.error ?? "Could not confirm your payment.");
              resolve();
              return;
            }
            window.dispatchEvent(new Event("cart-updated"));
            router.push(
              `/checkout/success?order=${result.dbOrderId}&payment=${response.razorpay_payment_id}`,
            );
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              resolve();
            },
          },
        });
        checkout.on("payment.failed", () => {
          setProcessing(false);
          setError(
            "Payment failed. Your cart is intact — you can try again or contact us.",
          );
          resolve();
        });
        checkout.open();
      };
      document.body.appendChild(script);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          Delivery details
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              Name *
            </label>
            <input id="name" name="name" type="text" required autoComplete="name" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              Email *
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              Phone *
            </label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="addressLine1" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              Address line 1 *
            </label>
            <input id="addressLine1" name="addressLine1" type="text" required autoComplete="address-line1" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="addressLine2" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              Address line 2
            </label>
            <input id="addressLine2" name="addressLine2" type="text" autoComplete="address-line2" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              City *
            </label>
            <input id="city" name="city" type="text" required autoComplete="address-level2" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="state" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              State *
            </label>
            <input id="state" name="state" type="text" required autoComplete="address-level1" className={inputClasses} />
          </div>
          <div>
            <label htmlFor="postalCode" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
              PIN code *
            </label>
            <input id="postalCode" name="postalCode" type="text" required autoComplete="postal-code" className={inputClasses} />
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || processing}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] text-background transition-colors bg-foreground hover:bg-[#3a352c] disabled:opacity-60"
      >
        {processing ? "Opening payment…" : pending ? "Preparing order…" : `Pay ₹${(totalPaise / 100).toLocaleString("en-IN")}`}
      </button>
    </form>
  );
}