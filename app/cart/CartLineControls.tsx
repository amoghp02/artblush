"use client";

import { useTransition } from "react";
import Link from "next/link";
import ArtworkImage from "@/components/ArtworkImage";
import {
  removeFromCartAction,
  updateCartQuantityAction,
} from "@/lib/cart/actions";
import type { Artwork } from "@/lib/artworks";

interface CartLineControlsProps {
  artwork: Artwork;
  quantity: number;
}

function formatPrice(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export default function CartLineControls({
  artwork,
  quantity,
}: CartLineControlsProps) {
  const [pending, startTransition] = useTransition();

  function notifyCart() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart-updated"));
    }
  }

  function changeQty(next: number) {
    if (next < 1) return;
    startTransition(async () => {
      await updateCartQuantityAction(artwork.id, next);
      notifyCart();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeFromCartAction(artwork.id);
      notifyCart();
    });
  }

  return (
    <li className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-6">
      <Link
        href={`/artwork/${artwork.id}`}
        className="block w-28 shrink-0 sm:w-32"
        aria-label={artwork.title}
      >
        <div className="relative overflow-hidden bg-[#e8e2d3] pb-[125%]">
          <ArtworkImage src={artwork.image} alt={artwork.imageAlt} />
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/artwork/${artwork.id}`}
          className="font-display text-xl font-light leading-snug text-foreground transition-colors hover:text-accent"
        >
          {artwork.title}
        </Link>
        <p className="mt-1 text-xs tracking-wide text-foreground/55">
          {artwork.medium} · {artwork.year}
        </p>
        <p className="mt-2 font-display text-lg font-light text-foreground">
          {formatPrice((artwork.price ?? 0) * quantity)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-foreground/15">
          <button
            type="button"
            onClick={() => changeQty(quantity - 1)}
            disabled={pending || quantity <= 1}
            className="px-3 py-2 text-sm text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="min-w-8 text-center text-sm text-foreground"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => changeQty(quantity + 1)}
            disabled={pending}
            className="px-3 py-2 text-sm text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/55 transition-colors hover:text-accent disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </li>
  );
}