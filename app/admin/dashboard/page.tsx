"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, ListChecks, Wallet } from "lucide-react";
import DashboardCard from "@/components/admin/DashboardCard";
import { initialAppointments } from "@/lib/mock-data";
import { Appointment } from "@/lib/types";

export default function AdminDashboardPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const pending = useMemo(
    () => appointments.filter((a) => a.status === "pending"),
    [appointments]
  );

  function updateStatus(id: string, status: Appointment["status"]) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  const stats = {
    pendingAppointments: pending.length,
    todaysVisits: appointments.filter((a) => a.date === "Thu, Jul 30").length,
    activeServices: 6,
    revenueThisMonth: 4280,
  };

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-hearth">
        Admin
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium text-ink">
        Good morning, Mohammad.
      </h1>
      <p className="mt-2 text-ink-muted">
        Here&apos;s what needs your attention today.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Pending appointments"
          value={stats.pendingAppointments}
          icon={CalendarClock}
          hint="Awaiting your decision"
        />
        <DashboardCard
          label="Today's visits"
          value={stats.todaysVisits}
          icon={CheckCircle2}
          hint="Confirmed for today"
        />
        <DashboardCard
          label="Active services"
          value={stats.activeServices}
          icon={ListChecks}
          hint="Currently bookable"
        />
        <DashboardCard
          label="Revenue this month"
          value={`$${stats.revenueThisMonth.toLocaleString()}`}
          icon={Wallet}
          hint="Across all services"
        />
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-2xl font-medium text-ink">
          Needs a decision
        </h2>
        <Link
          href="/admin/appointments"
          className="text-sm font-medium text-hearth hover:underline"
        >
          View all appointments →
        </Link>
      </div>

      {pending.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-border bg-white p-8 text-center text-ink-muted">
          No pending appointments. Nice and quiet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {pending.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  {apt.id}
                </p>
                <p className="font-display text-lg font-medium text-ink">
                  {apt.serviceName}
                </p>
                <p className="text-sm text-ink-muted">
                  {apt.patientName} · {apt.date} · {apt.time}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(apt.id, "accepted")}
                  className="rounded-pill bg-hearth px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hearth-hover"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(apt.id, "rejected")}
                  className="rounded-pill border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-light"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
