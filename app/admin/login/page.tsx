import type { Metadata } from "next";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in — ArtBlush Studio",
  description: "ArtBlush studio operations sign-in.",
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  return (
    <div className="admin-auth flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
          ArtBlush · Studio Ops
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Restricted area — studio staff only.
        </p>

        <div className="mt-8">
          <AdminLoginForm next={target} />
        </div>
      </div>
    </div>
  );
}