import StatusBadge from "@/components/admin/StatusBadge";
import { Appointment } from "@/lib/types";

interface AppointmentRowProps {
  appointment: Appointment;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function AppointmentRow({
  appointment,
  onAccept,
  onReject,
}: AppointmentRowProps) {
  const isPending = appointment.status === "pending";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="lg:w-40">
        <p className="text-xs uppercase tracking-wide text-ink-muted">
          {appointment.id}
        </p>
        <p className="font-display text-lg font-medium text-ink">
          {appointment.serviceName}
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Patient
          </p>
          <p className="mt-0.5 text-ink">{appointment.patientName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            When
          </p>
          <p className="mt-0.5 text-ink">
            {appointment.date} · {appointment.time}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Address
          </p>
          <p className="mt-0.5 text-ink">{appointment.address}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Caregiver
          </p>
          <p className="mt-0.5 text-ink">{appointment.caregiver ?? "Unassigned"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:w-56 lg:justify-end">
        <StatusBadge status={appointment.status} />
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(appointment.id)}
              className="rounded-pill bg-hearth px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-hearth-hover"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(appointment.id)}
              className="rounded-pill border border-danger px-4 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger-light"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
