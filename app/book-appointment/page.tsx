"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
];

const services = [
  "In-home Nursing",
  "Post-surgery Recovery",
  "Doctor Visit",
  "Elderly Companionship",
  "Preventive Check-up",
];

const nurses = [
  "Nurse Sarah",
  "Nurse Ahmad",
  "Nurse Maya",
];

export default function BookAppointmentPage() {
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [nurse, setNurse] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!client.trim()) {
      setError("Please enter the patient name.");
      return;
    }

    if (!service) {
      setError("Please select a service.");
      return;
    }

    if (!nurse) {
      setError("Please select a nurse.");
      return;
    }

    if (!date) {
      setError("Please select an appointment date.");
      return;
    }

    if (!time) {
      setError("Please select an appointment time.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter the visit address.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: client.trim(),
          service,
          nurse,
          date,
          time,
          address: address.trim(),
          notes: notes.trim(),
          status: "pending",
        }),
      });

      const responseText = await response.text();

      let data: {
        success?: boolean;
        message?: string;
        error?: string;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Appointment API response:", responseText);

        throw new Error(
          `The appointments API returned an invalid response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to create the appointment."
        );
      }

      setSuccess("Your appointment was booked successfully.");

      setClient("");
      setService("");
      setNurse("");
      setDate("");
      setTime("");
      setAddress("");
      setNotes("");
    } catch (error) {
      console.error("Create appointment error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create the appointment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ed] text-[#17231c]">
      <Header />

      <main className="mx-auto max-w-[1180px] px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/my-appointments"
            className="inline-flex items-center text-sm font-medium text-[#176043] transition hover:underline"
          >
            ← Back to my visits
          </Link>

          <section className="mt-7 overflow-hidden rounded-3xl border border-[#ddd8cc] bg-white shadow-sm">
            <div className="border-b border-[#e5e0d5] px-7 py-8 sm:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#176043]">
                Home healthcare
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Book a visit
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5c635e]">
                Enter the patient information and choose the service,
                nurse, date, and time.
              </p>
            </div>

            <div className="px-7 py-8 sm:px-10">
              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800"
                >
                  <p className="font-semibold">{success}</p>

                  <Link
                    href="/my-appointments"
                    className="mt-2 inline-block font-semibold underline"
                  >
                    View my appointments
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="client"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Patient name
                    <span className="ml-1 text-red-600">*</span>
                  </label>

                  <input
                    id="client"
                    name="client"
                    type="text"
                    value={client}
                    onChange={(event) => setClient(event.target.value)}
                    disabled={submitting}
                    placeholder="Enter the patient name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#979b97] focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Service
                    <span className="ml-1 text-red-600">*</span>
                  </label>

                  <select
                    id="service"
                    name="service"
                    value={service}
                    onChange={(event) => setService(event.target.value)}
                    disabled={submitting}
                    required
                    className="w-full rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">Select a service</option>

                    {services.map((serviceName) => (
                      <option key={serviceName} value={serviceName}>
                        {serviceName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="nurse"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Nurse
                    <span className="ml-1 text-red-600">*</span>
                  </label>

                  <select
                    id="nurse"
                    name="nurse"
                    value={nurse}
                    onChange={(event) => setNurse(event.target.value)}
                    disabled={submitting}
                    required
                    className="w-full rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">Select a nurse</option>

                    {nurses.map((nurseName) => (
                      <option key={nurseName} value={nurseName}>
                        {nurseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="date"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Date
                      <span className="ml-1 text-red-600">*</span>
                    </label>

                    <input
                      id="date"
                      name="date"
                      type="date"
                      min={getTodayDate()}
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value);
                        setTime("");
                      }}
                      disabled={submitting}
                      required
                      className="w-full rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Time
                      <span className="ml-1 text-red-600">*</span>
                    </label>

                    <select
                      id="time"
                      name="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      disabled={submitting || !date}
                      required
                      className="w-full rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">
                        {date
                          ? "Select a time"
                          : "Select a date first"}
                      </option>

                      {timeSlots.map((timeSlot) => (
                        <option key={timeSlot} value={timeSlot}>
                          {timeSlot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Visit address
                    <span className="ml-1 text-red-600">*</span>
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    disabled={submitting}
                    placeholder="Street, building, city"
                    autoComplete="street-address"
                    required
                    className="w-full rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#979b97] focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Notes
                    <span className="ml-2 font-normal text-[#717771]">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    disabled={submitting}
                    placeholder="Add medical details or instructions for the visit"
                    className="w-full resize-none rounded-xl border border-[#d7d2c6] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#979b97] focus:border-[#176043] focus:ring-2 focus:ring-[#176043]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#185c3d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#114a30] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Booking appointment..."
                    : "Book appointment"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
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

          <span className="font-serif text-2xl">Hearth.care</span>
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
            className="hover:text-[#176043]"
          >
            My visits
          </Link>

          <Link href="/login" className="hover:text-[#176043]">
            Log in
          </Link>
        </nav>

        <Link
          href="/my-appointments"
          className="rounded-full border border-[#185c3d] px-5 py-2.5 text-sm font-semibold text-[#185c3d] transition hover:bg-[#185c3d] hover:text-white"
        >
          My visits
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[#dedacf] bg-[#f8f5ed]">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-14 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-serif text-2xl">Hearth.care</h2>

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