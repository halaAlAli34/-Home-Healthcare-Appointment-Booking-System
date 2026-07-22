import type { AppointmentStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const statusClasses: Record<AppointmentStatus, string> = {
  pending:
    "border border-orange-200 bg-orange-50 text-orange-700",

  accepted:
    "border border-green-200 bg-green-100 text-green-800",

  rejected:
    "border border-red-200 bg-red-100 text-red-800",

  cancelled:
    "border border-gray-200 bg-gray-100 text-gray-700",

  completed:
    "border border-blue-200 bg-blue-100 text-blue-800",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}