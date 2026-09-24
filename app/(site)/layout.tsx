import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";
import BackToTop from "@/components/BackToTop";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArtBlush — Art, Drawn With Feeling",
  description:
    "ArtBlush creates hand-drawn portraits and original artworks that turn meaningful moments into timeless pieces.",
  metadataBase: new URL("https://www.artblush.in"),
  openGraph: {
    title: "ArtBlush — Art, Drawn With Feeling",
    description:
      "Hand-drawn portraits and original artworks that turn meaningful moments into timeless pieces.",
    type: "website",
    siteName: "ArtBlush",
    images: [{ url: "/portfolio-photos/pensive.jpg" }],
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtBlush — Art, Drawn With Feeling",
    description:
      "Hand-drawn portraits and original artworks that turn meaningful moments into timeless pieces.",
    images: ["/portfolio-photos/pensive.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <head>
        <noscript>
          <style>{`.reveal { opacity: 1; transform: none; }`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <BackToTop />
      </body>
    </html>
  );
}