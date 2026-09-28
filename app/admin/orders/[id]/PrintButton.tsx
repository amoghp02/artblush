"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors hover:bg-muted hover:text-foreground"
    >
      <Printer size={14} />
      Print / Save PDF
    </button>
  );
}