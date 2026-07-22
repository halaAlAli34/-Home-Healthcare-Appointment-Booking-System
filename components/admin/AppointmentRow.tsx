"use client";

import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Stethoscope,
  User,
  UserRound,
  X,
} from "lucide-react";

import type {
  Appointment,
  AppointmentStatus,
} from "@/app/admin/appointments/page";

interface AppointmentRowProps {
  appointment: Appointment;
  disabled?: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  accepted: "border-blue-200 bg-blue-50 text-blue-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-gray-200 bg-gray-100 text-gray-700",
  completed: "border-green-200 bg-green-50 text-green-700",
};

export default function AppointmentRow({
  appointment,
  disabled = false,
  onAccept,
  onReject,
  onComplete,
}: AppointmentRowProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-medium text-ink">
              {appointment.service}
            </h2>

            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                statusStyles[appointment.status]
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-ink-muted">
            Appointment ID: {appointment.id}
          </p>
        </div>

        <AppointmentActions
          appointment={appointment}
          disabled={disabled}
          onAccept={onAccept}
          onReject={onReject}
          onComplete={onComplete}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Detail
          icon={<User className="h-4 w-4" />}
          label="Patient"
          value={appointment.client}
        />

        <Detail
          icon={<UserRound className="h-4 w-4" />}
          label="Nurse"
          value={appointment.nurse}
        />

        <Detail
          icon={<Stethoscope className="h-4 w-4" />}
          label="Service"
          value={appointment.service}
        />

        <Detail
          icon={<CalendarDays className="h-4 w-4" />}
          label="Date"
          value={appointment.date}
        />

        <Detail
          icon={<Clock className="h-4 w-4" />}
          label="Time"
          value={appointment.time}
        />

        <Detail
          icon={<MapPin className="h-4 w-4" />}
          label="Address"
          value={appointment.address}
        />
      </div>

      {appointment.notes && (
        <div className="mt-5 rounded-xl bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Notes
          </p>

          <p className="mt-2 text-sm leading-6 text-ink">
            {appointment.notes}
          </p>
        </div>
      )}
    </article>
  );
}

interface AppointmentActionsProps {
  appointment: Appointment;
  disabled: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}

function AppointmentActions({
  appointment,
  disabled,
  onAccept,
  onReject,
  onComplete,
}: AppointmentActionsProps) {
  if (appointment.status === "pending") {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAccept(appointment.id)}
          className="inline-flex items-center gap-2 rounded-pill bg-hearth px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hearth-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}

          Accept
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onReject(appointment.id)}
          className="inline-flex items-center gap-2 rounded-pill border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}

          Reject
        </button>
      </div>
    );
  }

  if (appointment.status === "accepted") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onComplete(appointment.id)}
        className="inline-flex items-center gap-2 rounded-pill bg-hearth px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hearth-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}

        Mark completed
      </button>
    );
  }

  if (appointment.status === "completed") {
    return (
      <p className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
        <CheckCircle2 className="h-4 w-4" />
        Visit completed
      </p>
    );
  }

  if (appointment.status === "rejected") {
    return (
      <p className="text-sm font-medium text-red-700">
        Appointment rejected
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-ink-muted">
      Appointment cancelled
    </p>
  );
}

interface DetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Detail({
  icon,
  label,
  value,
}: DetailProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-hearth">{icon}</span>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-ink">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}