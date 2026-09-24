import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = await requireUser("/account");

  const tabs = [
    { label: "Overview", href: "/account" },
    { label: "Orders", href: "/account/orders" },
    { label: "Profile", href: "/account/profile" },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 md:px-10 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Your account
          </p>
          <h1 className="font-display text-4xl leading-[1.08] font-light text-foreground sm:text-5xl">
            {user.name.split(" ")[0]}&apos;s space.
          </h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>

      <nav
        aria-label="Account"
        className="mt-12 flex flex-wrap gap-8 border-b border-foreground/10 pb-0"
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

      <div className="mt-12 pb-24">{children}</div>
    </section>
  );
}