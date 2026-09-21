"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "@/lib/toast";

function whatsappUrl(title: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${title} — by ArtBlush.\n${url}`)}`;
}

export default function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} — by ArtBlush`, url });
      } catch {
        // User dismissed the share sheet — no action needed.
      }
    } else {
      window.open(whatsappUrl(title, url), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="flex items-center gap-5">
      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/45">
        Share
      </span>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:text-accent"
        aria-label="Copy link to this artwork"
      >
        {copied ? <Check size={15} strokeWidth={2} /> : <Link2 size={15} strokeWidth={1.6} />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
        aria-label="Share this artwork"
      >
        Share
      </button>
    </div>
  );
}