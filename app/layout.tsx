import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const display = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Hearth.care — Admin",
  description: "Manage services and appointments for Hearth.care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-sans bg-cream text-ink`}>
        {children}
      </body>
    </html>
  );
}
