import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { AuthProvider } from "@/context/AuthContext";

const display = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"], // added so italic accent words (e.g. "home") render as real italics
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Hearth.care — Care that comes home to you",
  description:
    "Book a licensed nurse, physiotherapist, or doctor for an in-home visit — same-day when you need it, scheduled ahead when you don't.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} flex min-h-screen flex-col font-sans bg-cream text-ink`}>
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
