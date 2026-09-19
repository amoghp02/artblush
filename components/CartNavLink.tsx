"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCartCountAction } from "@/lib/cart/actions";

export default function CartNavLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      const c = await getCartCountAction();
      if (!cancelled) setCount(c);
    }
    refresh();
    window.addEventListener("cart-updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("cart-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="group relative inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingBag size={18} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-2 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-background">
          {count}
        </span>
      )}
    </Link>
  );
}