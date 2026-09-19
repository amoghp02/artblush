"use client";

import { useState, useTransition } from "react";
import { addToCartAction } from "@/lib/cart/actions";

interface AddToCartButtonProps {
  artworkId: string;
  price: number;
  currency?: string;
  title: string;
}

function formatPrice(paise: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default function AddToCartButton({
  artworkId,
  price,
  currency = "INR",
  title,
}: AddToCartButtonProps) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    startTransition(async () => {
      const res = await addToCartAction(artworkId);
      if (res.ok) {
        setAdded(true);
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setAdded(false), 2000);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-light text-foreground">
          {formatPrice(price, currency)}
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-foreground/45">
          incl. shipping
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={pending}
        className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-out ${
          added
            ? "bg-accent text-background"
            : "bg-foreground text-background hover:bg-[#3a352c]"
        } disabled:opacity-60`}
        aria-live="polite"
      >
        {pending
          ? "Adding…"
          : added
            ? `Added — ${title}`
            : "Add to Cart"}
      </button>
    </div>
  );
}