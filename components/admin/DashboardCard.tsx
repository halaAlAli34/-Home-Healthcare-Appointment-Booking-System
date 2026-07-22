import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}

export default function DashboardCard({
  label,
  value,
  icon: Icon,
  hint,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </span>
        <Icon className="h-4 w-4 text-hearth" strokeWidth={1.75} />
      </div>
      <p className="mt-3 font-display text-3xl font-medium text-ink">{value}</p>
      {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}
