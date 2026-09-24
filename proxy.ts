import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOST = "admin.artblush.in";

export function proxy(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const path = req.nextUrl.pathname;
  const url = req.nextUrl;

  if (isProd && host === ADMIN_HOST) {
    if (path.startsWith("/admin")) {
      return withNoIndex(NextResponse.next());
    }
    if (path === "/login") {
      // Themed admin sign-in lives at /admin/login.
      return withNoIndex(NextResponse.rewrite(new URL("/admin/login", url)));
    }
    if (path === "/") {
      return withNoIndex(NextResponse.rewrite(new URL("/admin", url)));
    }
    // Everything else — cart, portfolio, artworks, about, signup — is ops-only.
    // Send it back to the dashboard.
    return withNoIndex(NextResponse.redirect(new URL("/", url)));
  }

  if (isProd && path.startsWith("/admin") && host !== ADMIN_HOST) {
    const dest = url.clone();
    dest.host = ADMIN_HOST;
    dest.pathname = path === "/admin" ? "/" : path.replace(/^\/admin/, "");
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

function withNoIndex(res: NextResponse): NextResponse {
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon\\.svg|portfolio-photos|.*\\..*).*)",
  ],
};