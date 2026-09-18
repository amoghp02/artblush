import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-out";

const variants: Record<string, string> = {
  solid:
    "bg-foreground text-background hover:bg-[#3a352c]",
  outline:
    "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
  text: "px-0 py-0 uppercase tracking-[0.18em] text-[13px] font-medium text-foreground underline-offset-8 hover:underline",
};

export default function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}