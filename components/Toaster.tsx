"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { TOAST_EVENT, type ToastDetail, type ToastTone } from "@/lib/toast";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 1;

    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      const id = nextId++;
      setToasts((prev) => [...prev.slice(-2), { id, message: detail.message, tone: detail.tone ?? "default" }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    }

    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`artblush-toast pointer-events-auto flex items-center gap-2.5 px-5 py-3 text-sm shadow-lg ${
            t.tone === "success"
              ? "bg-accent text-background"
              : "bg-foreground text-background"
          }`}
        >
          {t.tone === "success" && <Check size={15} strokeWidth={2.5} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}