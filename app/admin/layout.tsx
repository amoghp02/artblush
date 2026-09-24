import { ExternalLink, LayoutDashboard, LogOut, MessagesSquare, Package, Palette } from "lucide-react";
import { getCurrentUser, isAdminUser } from "@/lib/auth/session";
import { adminLogoutAction } from "@/app/admin/actions";
import { AdminNav } from "./AdminNav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Studio Admin — ArtBlush",
  description: "ArtBlush studio dashboard — orders, artworks and commissions.",
};

const tabs = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Artworks", href: "/admin/artworks", icon: Palette },
  { label: "Commissions", href: "/admin/commissions", icon: MessagesSquare },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const admin = user && isAdminUser(user);

  if (!admin) {
    // Signed-out (or non-admin) browsers get the bare tree — e.g. the
    // dedicated /admin/login page. Protected pages run their own guards.
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-zinc-950 text-zinc-300 md:flex">
          <div className="px-6 py-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
              ArtBlush
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-100">Studio Ops</p>
          </div>
          <Separator className="bg-zinc-800" />
          <nav aria-label="Admin" className="flex-1 space-y-1 px-3 py-4">
            {tabs.map((tab) => (
              <AdminNav key={tab.href} item={tab} />
            ))}
          </nav>
          <div className="space-y-1 px-3 py-4">
            <a
              href="https://www.artblush.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-zinc-800/70 hover:text-zinc-100"
            >
              <ExternalLink size={14} />
              View public site
            </a>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Studio Admin
            </p>
            <div className="flex items-center gap-3">
              <p className="hidden text-xs text-muted-foreground sm:block">
                {user.name} · {user.email}
              </p>
              <form action={adminLogoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-foreground"
                >
                  <LogOut size={13} />
                  Log out
                </Button>
              </form>
            </div>
          </header>

          <main className="flex-1 p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}