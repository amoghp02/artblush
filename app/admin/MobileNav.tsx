"use client";

import { useState } from "react";
import { ExternalLink, Menu, X } from "lucide-react";
import { AdminNav } from "./AdminNav";
import { Separator } from "@/components/ui/separator";

const tabs = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Orders", href: "/admin/orders", icon: "orders" },
  { label: "Artworks", href: "/admin/artworks", icon: "artworks" },
  { label: "Commissions", href: "/admin/commissions", icon: "commissions" },
];

/** Hamburger nav for small screens — the sidebar is hidden below md. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-lg">
          <nav aria-label="Admin" className="space-y-1">
            {tabs.map((tab) => (
              <AdminNav key={tab.href} item={tab} onClick={() => setOpen(false)} />
            ))}
          </nav>
          <Separator className="my-2" />
          <a
            href="https://www.artblush.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink size={14} />
            View public site
          </a>
        </div>
      )}
    </div>
  );
}