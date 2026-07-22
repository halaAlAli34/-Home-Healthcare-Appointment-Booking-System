"use client";

import { useMemo, useState } from "react";
import AppointmentRow from "@/components/admin/AppointmentRow";
import { initialAppointments } from "@/lib/mock-data";
import { Appointment, AppointmentStatus } from "@/lib/types";

type Tab = "pending" | "accepted" | "rejected" | "all";

const tabs: { key: Tab; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const filtered = useMemo(() => {
    if (activeTab === "all") return appointments;
    return appointments.filter((a) => a.status === activeTab);
  }, [appointments, activeTab]);

  function setStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-hearth">
        Admin
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium text-ink">
        Manage appointments
      </h1>
      <p className="mt-2 text-ink-muted">
        Review requests and confirm which visits go ahead.
      </p>

      <div className="mt-8 flex gap-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative -mb-px pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-hearth"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-hearth" />
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-white p-10 text-center text-ink-muted">
          No {activeTab === "all" ? "" : activeTab} appointments here.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              onAccept={(id) => setStatus(id, "accepted")}
              onReject={(id) => setStatus(id, "rejected")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
