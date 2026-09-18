import Link from "next/link";

function InstagramIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Custom Art", href: "/contact" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-[#efe9dc]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-medium tracking-tight text-foreground">
              ArtBlush
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/60">
              Hand-drawn portraits and original artworks — created by hand, to turn
              meaningful moments into timeless pieces.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              Follow
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  <InstagramIcon className="text-foreground/70" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground/45">
            © 2026 ArtBlush. All rights reserved.
          </p>
          <p className="text-xs text-foreground/45">
            Drawn by hand, in pencil and charcoal.
          </p>
        </div>
      </div>
    </footer>
  );
}