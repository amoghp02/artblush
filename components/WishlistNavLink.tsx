"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getWishlistIdsAction } from "@/lib/wishlist/actions";

export default function WishlistNavLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      const ids = await getWishlistIdsAction();
      if (!cancelled) setCount(ids.length);
    }
    refresh();
    window.addEventListener("wishlist-updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("wishlist-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <Link
      href="/wishlist"
      className="group relative inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
      aria-label={`Wishlist, ${count} item${count === 1 ? "" : "s"}`}
    >
      <Heart size={18} strokeWidth={1.5} />
      {count > 0 && (
        <span
        key={count}
        className="artblush-badge-pop absolute -top-2 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-background"
      >
          {count}
        </span>
      )}
    </Link>
  );
}