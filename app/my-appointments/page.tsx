"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AppointmentCard from "@/components/appointments/AppointmentCard";
import type { Appointment } from "@/lib/types";

type AppointmentFilter = "upcoming" | "past" | "all";

interface ApiAppointment {
  _id?: string;
  id?: string;

  serviceId?: string;
  
  serviceName?: string;

  service?: {
    name?: string;
    title?: string;
  } | string;

  patientName: string;
  caregiver?: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
  status: Appointment["status"];
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<AppointmentFilter>("upcoming");

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /*
   * Loads appointments from MongoDB when the page opens.
   */
  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/appointments", {
          method: "GET",
          cache: "no-store",
        });

        const responseText = await response.text();

        let data: unknown;

        try {
          data = JSON.parse(responseText);
        } catch {
          console.error("GET response:", responseText);

          throw new Error(
            `The appointments API returned HTML instead of JSON. Status: ${response.status}`
          );
        }

        if (!response.ok) {
          const errorData = data as { message?: string };

          throw new Error(
            errorData.message || "Failed to load appointments."
          );
        }

        /*
         * Supports both API response formats:
         * 1. [...]
         * 2. { appointments: [...] }
         */
        const appointmentData: ApiAppointment[] = Array.isArray(data)
          ? data
          : (
              data as {
                appointments?: ApiAppointment[];
              }
            ).appointments || [];

        const formattedAppointments: Appointment[] =
  appointmentData.map((appointment) => {
    let serviceName = appointment.serviceName;

    // Support APIs that return service as a string.
    if (!serviceName && typeof appointment.service === "string") {
      serviceName = appointment.service;
    }

    // Support APIs that return a populated service object.
    if (
      !serviceName &&
      appointment.service &&
      typeof appointment.service === "object"
    ) {
      serviceName =
        appointment.service.name ||
        appointment.service.title;
    }

    return {
      id: appointment._id || appointment.id || "",
      serviceId: appointment.serviceId || "",
      serviceName: serviceName || "Service not specified",
      patientName: appointment.patientName,
      caregiver: appointment.caregiver,
      date: appointment.date,
      time: appointment.time,
      address: appointment.address,
      status: appointment.status,
    };
  });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Load appointments error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  /*
   * Cancels a pending appointment in MongoDB.
   */
  async function handleCancel(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(id);
      setError(null);

      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      });

      /*
       * Read the response as text first.
       * This prevents "Unexpected token <" from hiding the real error.
       */
      const responseText = await response.text();

      let data: {
        success?: boolean;
        message?: string;
        appointment?: ApiAppointment;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("PATCH response:", responseText);

        throw new Error(
          `The cancel API returned HTML instead of JSON. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment."
        );
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment
        )
      );
    } catch (error) {
      console.error("Cancel appointment error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel appointment."
      );
    } finally {
      setCancellingId(null);
    }
  }

  const filteredAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeFilter === "all") {
      return appointments;
    }

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(
        `${appointment.date}T00:00:00`
      );

      if (activeFilter === "upcoming") {
        return (
          appointmentDate >= today &&
          appointment.status !== "cancelled" &&
          appointment.status !== "completed" &&
          appointment.status !== "rejected"
        );
      }

      return (
        appointmentDate < today ||
        appointment.status === "cancelled" ||
        appointment.status === "completed" ||
        appointment.status === "rejected"
      );
    });
  }, [appointments, activeFilter]);

  return (
    <div className="min-h-screen bg-[#f8f5ed] text-[#17231c]">


      <main className="mx-auto min-h-[635px] max-w-[1180px] px-6 py-16 lg:px-8">
        <section>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#176043]">
                Your care
              </p>

              <h1 className="font-serif text-5xl leading-none text-[#17231c]">
                My visits
              </h1>

              <p className="mt-4 text-base text-[#4d554f]">
                Everything you&apos;ve booked with Hearth, in one
                place.
              </p>
            </div>

            <Link
              href="/book-appointment"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#185c3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#114a30]"
            >
              Book a visit
            </Link>
          </div>

          <div className="mt-9 border-b border-[#d9d5ca]">
            <div className="flex gap-9">
              <FilterButton
                label="Upcoming"
                value="upcoming"
                activeFilter={activeFilter}
                onClick={setActiveFilter}
              />

              <FilterButton
                label="Past"
                value="past"
                activeFilter={activeFilter}
                onClick={setActiveFilter}
              />

              <FilterButton
                label="All"
                value="all"
                activeFilter={activeFilter}
                onClick={setActiveFilter}
              />
            </div>
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-4">
            {loading ? (
              <LoadingAppointments />
            ) : filteredAppointments.length === 0 ? (
              <EmptyAppointments />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancel}
                  cancelling={
                    cancellingId === appointment.id
                  }
                />
              ))
            )}
          </div>
        </section>
      </main>


    </div>
  );
}

interface FilterButtonProps {
  label: string;
  value: AppointmentFilter;
  activeFilter: AppointmentFilter;
  onClick: (filter: AppointmentFilter) => void;
}

function FilterButton({
  label,
  value,
  activeFilter,
  onClick,
}: FilterButtonProps) {
  const active = activeFilter === value;

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`relative pb-4 text-sm transition ${
        active
          ? "font-semibold text-[#176043]"
          : "text-[#595e59] hover:text-[#176043]"
      }`}
    >
      {label}

      {active && (
        <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#176043]" />
      )}
    </button>
  );
}

function LoadingAppointments() {
  return (
    <div className="rounded-2xl border border-[#ddd8cc] bg-white px-8 py-16 text-center">
      <p className="text-sm text-[#5c635e]">
        Loading your visits...
      </p>
    </div>
  );
}

function EmptyAppointments() {
  return (
    <div className="rounded-2xl border border-[#ddd8cc] bg-white px-8 py-16 text-center">
      <h2 className="font-serif text-2xl">
        No visits found
      </h2>

      <p className="mt-2 text-sm text-[#5c635e]">
        There are no appointments in this section.
      </p>

      <Link
        href="/book-appointment"
        className="mt-6 inline-flex rounded-full bg-[#185c3d] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Book a visit
      </Link>
    </div>
  );
}


interface FooterColumnProps {
  title: string;
  links: string[];
}

function FooterColumn({
  title,
  links,
}: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#666c67]">
        {title}
      </h3>

      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="transition hover:text-[#176043]"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}