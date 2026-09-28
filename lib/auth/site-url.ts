import "server-only";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://www.artblush.in"
      : "http://localhost:3000")
  );
}