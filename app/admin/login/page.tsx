import type { Metadata } from "next";
import Image from "next/image";
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
    <div className="admin-auth flex items-center justify-center px-5 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl md:grid-cols-[1fr_1.15fr]">
        {/* Artwork pane */}
        <div className="relative hidden min-h-[560px] md:block">
          <Image
            src="/portfolio-photos/pensive.jpg"
            alt="Original charcoal portrait by ArtBlush"
            fill
            priority
            sizes="(min-width: 768px) 40vw, 0vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute inset-0 border-r border-zinc-800" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
              Original artwork
            </p>
            <p className="mt-2 font-display text-2xl font-light leading-snug text-zinc-50">
              Art, drawn with feeling.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Hand-drawn portraits, graphite and charcoal — signed at the studio.
            </p>
          </div>
        </div>

        {/* Sign-in pane */}
        <div className="px-6 py-12 sm:px-12">
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
    </div>
  );
}