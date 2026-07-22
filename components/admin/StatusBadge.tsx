import { AppointmentStatus } from "@/lib/types";

const styles: Record<AppointmentStatus, string> = {
  accepted: "bg-hearth-light text-hearth",
  pending: "bg-pending-bg text-pending-text",
  rejected: "bg-danger-light text-danger",
};

const labels: Record<AppointmentStatus, string> = {
  accepted: "Accepted",
  pending: "Pending",
  rejected: "Rejected",
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
