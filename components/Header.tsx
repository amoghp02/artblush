"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import CartNavLink from "./CartNavLink";
import WishlistNavLink from "./WishlistNavLink";
import AccountMenu from "./AccountMenu";

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Custom Art", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-background/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(31,27,21,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 md:px-10">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-display text-[22px] font-medium tracking-tight text-foreground"
        >
          ArtBlush
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
          >
            Explore Art
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <WishlistNavLink />
          <CartNavLink />
          <AccountMenu />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <WishlistNavLink />
          <CartNavLink />
          <AccountMenu />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center p-2 text-foreground"
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <MobileMenu
          pathname={pathname}
          onNavigate={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`group relative text-[13px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
        isActive ? "text-accent" : "text-foreground/80 hover:text-foreground"
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

function MobileMenu({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div
      id="mobile-menu"
      className="absolute inset-x-0 top-full border-t border-foreground/10 bg-background md:hidden"
    >
      <nav
        className="mx-auto flex max-w-[1400px] flex-col gap-1 px-5 py-6 sm:px-8"
        aria-label="Mobile"
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`py-3 font-display text-2xl font-light transition-colors ${
                isActive ? "text-accent" : "text-foreground hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/portfolio"
          onClick={onNavigate}
          className="mt-4 inline-flex items-center gap-2 border-t border-foreground/10 pt-6 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground"
        >
          Explore Art →
        </Link>
        <Link
          href="/wishlist"
          onClick={onNavigate}
          className="inline-flex items-center gap-2 pt-3 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground"
        >
          Wishlist
        </Link>
        <Link
          href="/cart"
          onClick={onNavigate}
          className="inline-flex items-center gap-2 pb-2 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground"
        >
          Cart
        </Link>
        <div className="border-t border-foreground/10 pt-2">
          <AccountMenu variant="menu" />
        </div>
      </nav>
    </div>
  );
}