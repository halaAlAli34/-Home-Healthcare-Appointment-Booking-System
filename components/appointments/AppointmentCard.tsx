import type { Appointment } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
}

export default function AppointmentCard({
  appointment,
  onCancel,
}: AppointmentCardProps) {
  const canCancel = appointment.status === "pending";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${appointment.date}T00:00:00`));

  return (
    <article className="rounded-2xl border border-[#ddd8cc] bg-white px-6 py-5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-[190px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#687069]">
            {appointment.id}
          </p>

          <h2 className="mt-2 font-serif text-xl text-[#18231c]">
            {appointment.serviceName}
          </h2>
        </div>

        <div className="min-w-[150px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#687069]">
            Caregiver
          </p>

          <p className="mt-2 text-sm text-[#141b16]">
            {appointment.caregiver || "To be assigned"}
          </p>
        </div>

        <div className="min-w-[170px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#687069]">
            When
          </p>

          <p className="mt-2 text-sm text-[#141b16]">
            {formattedDate}
          </p>

          <p className="text-sm text-[#141b16]">
            {appointment.time}
          </p>
        </div>

        <div className="min-w-[190px] max-w-[220px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#687069]">
            Address
          </p>

          <p className="mt-2 text-sm leading-5 text-[#141b16]">
            {appointment.address}
          </p>
        </div>

        <div className="flex min-w-[170px] flex-col items-start gap-3 lg:items-end">
          <StatusBadge status={appointment.status} />

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-[#ded9ce] px-4 py-2 text-xs font-medium text-[#28302b] transition hover:bg-[#f8f5ed]"
            >
              Reschedule
            </button>

            {canCancel && (
              <button
                type="button"
                onClick={() => onCancel(appointment.id)}
                className="rounded-full border border-[#f1b3b0] px-4 py-2 text-xs font-medium text-[#df4c47] transition hover:bg-[#fff5f4]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}