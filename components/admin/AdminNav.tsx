"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/appointments", label: "Appointments" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hearth text-sm font-display font-semibold text-cream">
            H
          </span>
          <span className="font-display text-lg font-medium">
            Hearth.care <span className="text-ink-muted font-sans text-sm font-normal">admin</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] md:flex">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-hearth font-medium"
                    : "text-ink/80 hover:text-ink transition-colors"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-muted sm:inline">Mohammad</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hearth-light text-sm font-medium text-hearth">
            M
          </span>
        </div>
      </div>
    </header>
  );
}
