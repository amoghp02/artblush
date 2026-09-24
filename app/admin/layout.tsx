import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = {
  title: "Studio Admin — ArtBlush",
  description: "ArtBlush studio dashboard — orders, artworks and commissions.",
};

const tabs = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Artworks", href: "/admin/artworks" },
  { label: "Commissions", href: "/admin/commissions" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 md:px-10 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Studio · Admin
          </p>
          <h1 className="font-display text-3xl font-light text-foreground sm:text-4xl">
            Behind the easel.
          </h1>
        </div>
        <p className="text-sm text-foreground/55">
          Signed in as {user.name} ({user.email})
        </p>
      </div>

      <nav
        aria-label="Admin"
        className="mt-10 flex flex-wrap gap-8 border-b border-foreground/10"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="group relative pb-4 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
          >
            {tab.label}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px bg-accent opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        ))}
      </nav>

      <div className="pb-28 pt-12">{children}</div>
    </section>
  );
}