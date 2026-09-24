"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { getWishlistIdsAction, toggleWishlistAction } from "@/lib/wishlist/actions";
import { toast } from "@/lib/toast";

interface WishlistButtonProps {
  artworkId: string;
  title: string;
  variant?: "card" | "inline";
}

export default function WishlistButton({
  artworkId,
  title,
  variant = "inline",
}: WishlistButtonProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    getWishlistIdsAction().then((ids) => {
      if (cancelled) return;
      setWishlisted(ids.includes(artworkId));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  function handleToggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;

    const next = !wishlisted;
    setWishlisted(next);
    startTransition(async () => {
      const res = await toggleWishlistAction(artworkId, next);
      if (res.ok) {
        window.dispatchEvent(new Event("wishlist-updated"));
        toast(
          res.wishlisted ? `Saved "${title}" to your wishlist` : `Removed "${title}" from wishes`,
          res.wishlisted ? "success" : "default",
        );
        router.refresh();
      } else {
        setWishlisted(!next);
      }
    });
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
          wishlisted
            ? "bg-accent text-background"
            : "bg-background/85 text-foreground/80 hover:bg-background hover:text-accent"
        } ${pending ? "opacity-60" : ""}`}
      >
        <Heart
          size={16}
          strokeWidth={1.6}
          fill={wishlisted ? "currentColor" : "none"}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
      className={`inline-flex items-center gap-2 border px-5 py-3 text-[13px] font-medium uppercase tracking-[0.18em] transition-colors ${
        wishlisted
          ? "border-accent/40 bg-accent/5 text-accent"
          : "border-foreground/20 text-foreground/80 hover:border-accent hover:text-accent"
      } ${!loaded ? "opacity-50" : ""} ${pending ? "opacity-60" : ""}`}
    >
      <Heart
        size={15}
        strokeWidth={1.6}
        fill={wishlisted ? "currentColor" : "none"}
      />
      {wishlisted ? "Wishlisted" : "Wishlist"}
    </button>
  );
}