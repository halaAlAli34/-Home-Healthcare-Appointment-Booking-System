"use client";

import { useEffect, useMemo, useState } from "react";
import AppointmentRow from "@/components/admin/AppointmentRow";

export type AppointmentStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface Appointment {
  id: string;
  client: string;
  service: string;
  nurse: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  status: AppointmentStatus;
}

interface ApiAppointment {
  id: string;
  serviceName: string;
  patientName: string;
  caregiver: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  status: AppointmentStatus;
}

interface ApiUpdateAppointmentResponse {
  success: boolean;
  message?: string;
  appointment?: ApiAppointment;
}

type Tab = "pending" | "accepted" | "rejected" | "all";

interface AppointmentsResponse {
  success: boolean;
  message?: string;
  appointments?: ApiAppointment[];
}

interface UpdateAppointmentResponse {
  success: boolean;
  message?: string;
  appointment?: ApiAppointment;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/appointments", {
        method: "GET",
        cache: "no-store",
      });

      const data: AppointmentsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch appointments."
        );
      }

      setAppointments(
  (data.appointments ?? []).map((appointment) => ({
    id: appointment.id,
    client: appointment.patientName,
    service: appointment.serviceName,
    nurse: appointment.caregiver,
    date: appointment.date,
    time: appointment.time,
    address: appointment.address,
    notes: appointment.notes,
    status: appointment.status,
  }))
);
    } catch (error) {
      console.error("Fetch appointments error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch appointments."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateAppointmentStatus(
    id: string,
    status: AppointmentStatus
  ) {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data: UpdateAppointmentResponse =
        await response.json();

      if (!response.ok || !data.success || !data.appointment) {
        throw new Error(
          data.message || "Failed to update appointment."
        );
      }

      setAppointments((previousAppointments) =>
  previousAppointments.map((appointment) =>
    appointment.id === id
      ? {
          id: data.appointment!.id,
          client: data.appointment!.patientName,
          service: data.appointment!.serviceName,
          nurse: data.appointment!.caregiver,
          date: data.appointment!.date,
          time: data.appointment!.time,
          address: data.appointment!.address,
          notes: data.appointment!.notes,
          status: data.appointment!.status,
        }
      : appointment
  )
);

      setSuccess(
        data.message || `Appointment ${status} successfully.`
      );
    } catch (error) {
      console.error("Update appointment error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update appointment."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredAppointments = useMemo(() => {
    if (activeTab === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === activeTab
    );
  }, [appointments, activeTab]);

  function getTabCount(tab: Tab) {
    if (tab === "all") {
      return appointments.length;
    }

    return appointments.filter(
      (appointment) => appointment.status === tab
    ).length;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          disabled={loading}
          className="rounded-pill border border-border bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              setError("");
              setSuccess("");
            }}
            className={`relative -mb-px whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-hearth"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label} ({getTabCount(tab.key)})

            {activeTab === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-hearth" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-border bg-white p-10 text-center text-ink-muted">
          Loading appointments...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-white p-10 text-center text-ink-muted">
          No {activeTab === "all" ? "" : activeTab} appointments
          here.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              disabled={updatingId === appointment.id}
              onAccept={(id) =>
                updateAppointmentStatus(id, "accepted")
              }
              onReject={(id) =>
                updateAppointmentStatus(id, "rejected")
              }
              onComplete={(id) =>
                updateAppointmentStatus(id, "completed")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}