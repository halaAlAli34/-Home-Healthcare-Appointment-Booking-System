"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { initialAppointments } from "@/lib/mock-data";
import type { Appointment } from "@/lib/types";

type AppointmentFilter = "upcoming" | "past" | "all";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [activeFilter, setActiveFilter] =
    useState<AppointmentFilter>("upcoming");

  function handleCancel(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

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
          appointment.status !== "completed"
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
      <Header />

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

          <div className="mt-8 space-y-4">
            {filteredAppointments.length === 0 ? (
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
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancel}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
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

function Header() {
  return (
    <header className="border-b border-[#e1ddd3] bg-[#f8f5ed]">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#185c3d] font-serif text-lg text-white">
            H
          </span>

          <span className="font-serif text-2xl">
            Hearth.care
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/" className="hover:text-[#176043]">
            Home
          </Link>

          <Link
            href="/services"
            className="hover:text-[#176043]"
          >
            Services
          </Link>

          <Link
            href="/my-appointments"
            className="font-medium text-[#176043]"
          >
            My visits
          </Link>

          <Link
            href="/login"
            className="hover:text-[#176043]"
          >
            Log in
          </Link>
        </nav>

        <Link
          href="/book-appointment"
          className="rounded-full bg-[#185c3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#114a30]"
        >
          Book a visit
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#dedacf] bg-[#f8f5ed]">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-14 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-serif text-2xl">
            Hearth.care
          </h2>

          <p className="mt-4 max-w-[240px] text-sm leading-6 text-[#5f655f]">
            Trusted home healthcare, booked in minutes. Care that
            comes to you.
          </p>
        </div>

        <FooterColumn
          title="Care"
          links={[
            "Nursing",
            "Physiotherapy",
            "Doctor visits",
            "Elderly companionship",
          ]}
        />

        <FooterColumn
          title="Company"
          links={["About", "Caregivers", "Careers", "Press"]}
        />

        <FooterColumn
          title="Support"
          links={["Help center", "Contact", "Privacy", "Terms"]}
        />
      </div>

      <div className="border-t border-[#dedacf]">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-3 px-6 py-5 text-xs text-[#666b66] sm:flex-row lg:px-8">
          <p>© 2026 Hearth Care Co. All rights reserved.</p>

          <p>Licensed in-home care · Available 7 days a week</p>
        </div>
      </div>
    </footer>
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