"use client";

import type { FormEvent } from "react";
import type { Service } from "@/lib/types";
import TimeSlotPicker from "./TimeSlotPicker";

interface AppointmentFormProps {
  services: Service[];
  serviceId: string;
  patientName: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  loading: boolean;
  onServiceChange: (value: string) => void;
  onPatientNameChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AppointmentForm({
  services,
  serviceId,
  patientName,
  date,
  time,
  address,
  notes,
  loading,
  onServiceChange,
  onPatientNameChange,
  onDateChange,
  onTimeChange,
  onAddressChange,
  onNotesChange,
  onSubmit,
}: AppointmentFormProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="service"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Healthcare service
          </label>

          <select
            id="service"
            value={serviceId}
            onChange={(event) => onServiceChange(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Select a service</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — ${service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="patientName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Patient name
          </label>

          <input
            id="patientName"
            type="text"
            value={patientName}
            onChange={(event) =>
              onPatientNameChange(event.target.value)
            }
            placeholder="Enter the patient's full name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Appointment date
          </label>

          <input
            id="date"
            type="date"
            min={today}
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <TimeSlotPicker
          selectedTime={time}
          onSelect={onTimeChange}
        />

        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Home address
          </label>

          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder="Street, building, floor, and apartment"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Additional notes
          </label>

          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Add medical information or special instructions..."
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {loading ? "Booking appointment..." : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}