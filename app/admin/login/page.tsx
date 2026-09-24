import type { Metadata } from "next";
import Image from "next/image";
import { ArtworkCarousel } from "./artwork-carousel";
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
    <div className="relative min-h-dvh overflow-hidden bg-zinc-950">
      {/* Blurred artwork, full-bleed behind the card */}
      <Image
        src="/portfolio-photos/the-rider.png"
        alt=""
        priority
        quality={50}
        sizes="100vw"
        fill
        className="absolute inset-0 object-cover blur-2xl scale-110"
      />
      <div className="absolute inset-0 bg-zinc-950/75" aria-hidden />

      <div
        className="admin-auth relative flex items-center justify-center px-5 py-12"
        style={{ background: "transparent" }}
      >
        <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl md:grid-cols-[1fr_1.15fr]">
          {/* Artwork pane — banner on mobile, full-height column on desktop */}
          <div className="relative h-48 overflow-hidden border-b border-zinc-800 sm:h-60 md:h-auto md:min-h-[560px] md:border-b-0 md:border-r">
            <ArtworkCarousel />
          </div>

          {/* Sign-in pane */}
          <div className="px-6 py-12 sm:px-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
              ArtBlush · Studio Ops
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
              Sign In
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Restricted area - studio staff only.
            </p>

            <div className="mt-8">
              <AdminLoginForm next={target} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}