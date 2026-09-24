"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}

export function AdminNav({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active =
    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-zinc-800/80 text-zinc-50"
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100",
      )}
      aria-current={active ? "page" : undefined}
    >
      <item.icon size={15} />
      {item.label}
    </Link>
  );
}