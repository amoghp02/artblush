"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Package, User } from "lucide-react";
import { logout } from "@/lib/auth/actions";

interface MeUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface MeResponse {
  user: MeUser | null;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function AccountMenu() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store" })
      .then((res) => res.json() as Promise<MeResponse>)
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoaded(true);
        }
      });

    function onAuth() {
      fetch("/api/me", { cache: "no-store" })
        .then((res) => res.json() as Promise<MeResponse>)
        .then((data) => setUser(data.user))
        .catch(() => setUser(null));
    }

    window.addEventListener("auth-updated", onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener("auth-updated", onAuth);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!loaded) {
    return (
      <span
        aria-hidden="true"
        className="h-8 w-8 rounded-full border border-foreground/15"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 items-center rounded-full border border-foreground/20 px-4 text-[12px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        className="flex items-center gap-1.5 rounded-full border border-foreground/15 py-1 pl-1 pr-2 transition-colors hover:border-accent/50"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-background">
          {initials(user.name)}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-3 w-56 border border-foreground/10 bg-background shadow-[0_16px_40px_-12px_rgba(31,27,21,0.25)]"
        >
          <div className="border-b border-foreground/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-foreground/55">{user.email}</p>
          </div>

          <div className="py-1.5">
            <MenuLink href="/account" icon={<User size={15} strokeWidth={1.6} />} label="Dashboard" onNavigate={() => setOpen(false)} />
            <MenuLink
              href="/account/orders"
              icon={<Package size={15} strokeWidth={1.6} />}
              label="Orders"
              onNavigate={() => setOpen(false)}
            />
          </div>

          <div className="border-t border-foreground/10 py-1.5">
            <form
              action={async () => {
                await logout();
                setUser(null);
                window.dispatchEvent(new Event("auth-updated"));
              }}
            >
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <LogOut size={15} strokeWidth={1.6} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      {icon}
      {label}
    </Link>
  );
}