"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, CalendarCheck, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) =>
    `text-sm transition-colors hover:text-hearth ${
      pathname === href ? "text-hearth font-medium" : "text-ink"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-cream/70 shadow-sm backdrop-blur-md"
          : "border-transparent bg-cream"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hearth font-display text-sm font-semibold text-white">
            H
          </span>
          <span className="font-display text-base font-medium text-ink">Hearth.care</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          {!loading && user?.role === "patient" && (
            <Link href="/my-appointments" className={linkClass("/my-appointments")}>
              My visits
            </Link>
          )}
          {!loading && user?.role === "admin" && (
            <Link href="/admin" className={linkClass("/admin")}>
              Dashboard
            </Link>
          )}

          {!loading && !user && (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Log in
              </Link>
              <Link href="/register" className={linkClass("/register")}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-9 w-28 animate-pulse rounded-pill bg-cream-footer" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-pill border border-border bg-white py-1 pl-1 pr-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-hearth-light text-[11px] font-semibold text-hearth">
                  {initials(user.name)}
                </span>
                <span className="text-sm text-ink">{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={logout}
                aria-label="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink/70 transition-colors hover:border-danger hover:text-danger"
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <Link href="/book-appointment" className="btn btn-primary">
              Book a visit
            </Link>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-border bg-cream px-6 py-4 md:hidden">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-2 py-2.5 text-sm font-medium text-ink hover:bg-cream-footer"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!loading && user?.role === "patient" && (
            <Link
              href="/my-appointments"
              className="flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-medium text-ink hover:bg-cream-footer"
              onClick={() => setMobileOpen(false)}
            >
              <CalendarCheck className="h-4 w-4" aria-hidden />
              My visits
            </Link>
          )}
          {!loading && user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-medium text-ink hover:bg-cream-footer"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          )}

          {!loading && !user && (
            <Link
              href="/register"
              className="rounded-xl px-2 py-2.5 text-sm font-medium text-ink hover:bg-cream-footer"
              onClick={() => setMobileOpen(false)}
            >
              Register
            </Link>
          )}

          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            {loading ? null : user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="btn btn-ghost w-full gap-2"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Log out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-ghost flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/book-appointment"
                  className="btn btn-primary flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  Book a visit
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
