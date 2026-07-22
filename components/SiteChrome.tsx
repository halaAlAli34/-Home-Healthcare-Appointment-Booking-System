"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Routes that already have their own nav/layout shell and shouldn't
// also get the public Navbar/Footer wrapped around them.
const EXCLUDED_PREFIXES = ["/admin"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
