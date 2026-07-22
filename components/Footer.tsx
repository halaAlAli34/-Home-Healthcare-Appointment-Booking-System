import Link from "next/link";

const CARE_LINKS = [
  { href: "/services#in-home-nursing-visit", label: "Nursing" },
  { href: "/services#physiotherapy-session", label: "Physiotherapy" },
  { href: "/services#doctor-home-visit", label: "Doctor visits" },
  { href: "/services#elderly-companionship", label: "Elderly companionship" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/caregivers", label: "Caregivers" },
  { href: "/careers", label: "Careers" },
  { href: "/press", label: "Press" },
];

const SUPPORT_LINKS = [
  { href: "/help", label: "Help center" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-cream-footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href="/" className="font-display text-xl font-medium text-ink">
            Hearth.care
          </Link>
          <p className="max-w-[220px] text-sm text-ink-muted">
            Trusted home healthcare, booked in minutes. Care that comes to you.
          </p>
        </div>

        <FooterColumn title="Care" links={CARE_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Support" links={SUPPORT_LINKS} />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Hearth Care Co. All rights reserved.</p>
          <p>Licensed in-home care · Available 7 days a week</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="eyebrow">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-ink/80 hover:text-hearth">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
