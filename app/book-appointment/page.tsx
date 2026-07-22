"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { initialServices } from "@/lib/mock-data";
import styles from "./page.module.css";

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

const unavailableSlots = ["10:30 AM", "01:00 PM"];

function createServiceImage(serviceName: string, category: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dce8dc" />
          <stop offset="100%" stop-color="#abc5b3" />
        </linearGradient>
      </defs>

      <rect width="800" height="450" fill="url(#background)" />

      <circle
        cx="650"
        cy="90"
        r="130"
        fill="#ffffff"
        fill-opacity="0.18"
      />

      <circle
        cx="100"
        cy="390"
        r="180"
        fill="#ffffff"
        fill-opacity="0.12"
      />

      <rect
        x="55"
        y="80"
        width="72"
        height="72"
        rx="36"
        fill="#1f4d3a"
      />

      <text
        x="91"
        y="129"
        text-anchor="middle"
        font-family="Arial"
        font-size="36"
        font-weight="700"
        fill="#ffffff"
      >
        H
      </text>

      <text
        x="55"
        y="235"
        font-family="Georgia"
        font-size="42"
        fill="#1f4d3a"
      >
        ${serviceName}
      </text>

      <text
        x="57"
        y="285"
        font-family="Arial"
        font-size="22"
        fill="#4d695c"
      >
        ${category} · Home healthcare
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function BookAppointmentPage() {
  const [selectedServiceId, setSelectedServiceId] = useState(
    initialServices[0]?.id ?? ""
  );

  const [selectedTime, setSelectedTime] = useState(
    timeSlots[2] ?? timeSlots[0]
  );

  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [patientName, setPatientName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [submitting, setSubmitting] = useState(false);

  const selectedService = useMemo(() => {
    return initialServices.find(
      (service) => service.id === selectedServiceId
    );
  }, [selectedServiceId]);

  const minimumDate = new Date().toISOString().split("T")[0];

  function resetForm() {
    setDate("");
    setPhone("");
    setPatientName("");
    setAddress("");
    setNotes("");
    setSelectedTime(timeSlots[2] ?? timeSlots[0]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!selectedService) {
      setMessage("Please choose a healthcare service.");
      setMessageType("error");
      return;
    }

    if (!selectedTime) {
      setMessage("Please choose an available appointment time.");
      setMessageType("error");
      return;
    }

    const payload = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date,
      time: selectedTime,
      phone: phone.trim(),
      patientName: patientName.trim(),
      address: address.trim(),
      notes: notes.trim(),
    };

    try {
      setSubmitting(true);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Something went wrong while creating the appointment."
        );
      }

      setMessage(
        `Booking confirmed for ${payload.date} at ${payload.time}.`
      );
      setMessageType("success");

      resetForm();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Network error — please try again."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.site}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>H</span>
          <span className={styles.brandName}>Hearth.care</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/admin/services">Services</Link>
          <Link href="/my-appointments">My visits</Link>
          <Link href="/login">Log in</Link>
        </nav>

        <Link
          href="/book-appointment"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.navCta}`}
        >
          Book a visit
        </Link>
      </header>

      <main className={styles.page}>
        <p className={styles.eyebrow}>BOOK A VISIT</p>

        <h1 className={styles.headline}>
          Tell us what you need, and when.
        </h1>

        <div className={styles.layout}>
          <form
            className={`${styles.card} ${styles.formCard}`}
            onSubmit={handleSubmit}
          >
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                CHOOSE A SERVICE
              </label>

              <div className={styles.serviceGrid}>
                {initialServices.map((service) => {
                  const selected =
                    selectedServiceId === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      className={`${styles.serviceOption} ${
                        selected ? styles.selectedService : ""
                      }`}
                      onClick={() =>
                        setSelectedServiceId(service.id)
                      }
                    >
                      <span className={styles.serviceName}>
                        {service.name}
                      </span>

                      <span className={styles.serviceMeta}>
                        {service.durationMinutes} min · $
                        {service.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.row}>
              <div
                className={`${styles.fieldGroup} ${styles.half}`}
              >
                <label
                  className={styles.fieldLabel}
                  htmlFor="date"
                >
                  DATE
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  min={minimumDate}
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  required
                />
              </div>

              <div
                className={`${styles.fieldGroup} ${styles.half}`}
              >
                <label className={styles.fieldLabel}>
                  TIME
                </label>

                <div className={styles.timeGrid}>
                  {timeSlots.map((slot) => {
                    const unavailable =
                      unavailableSlots.includes(slot);

                    const selected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={unavailable}
                        onClick={() => setSelectedTime(slot)}
                        className={`${styles.timeSlot} ${
                          selected ? styles.selectedTime : ""
                        } ${
                          unavailable
                            ? styles.unavailableTime
                            : ""
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div
                className={`${styles.fieldGroup} ${styles.half}`}
              >
                <label
                  className={styles.fieldLabel}
                  htmlFor="phone"
                >
                  PHONE
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+961 00 000 000"
                  required
                />
              </div>

              <div
                className={`${styles.fieldGroup} ${styles.half}`}
              >
                <label
                  className={styles.fieldLabel}
                  htmlFor="patientName"
                >
                  PATIENT NAME
                </label>

                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={patientName}
                  onChange={(event) =>
                    setPatientName(event.target.value)
                  }
                  placeholder="Who is the visit for?"
                  required
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label
                className={styles.fieldLabel}
                htmlFor="address"
              >
                ADDRESS
              </label>

              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Street, apt, city"
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label
                className={styles.fieldLabel}
                htmlFor="notes"
              >
                NOTES FOR THE CAREGIVER
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Anything they should know — access instructions, mobility, allergies…"
              />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                disabled={submitting}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                {submitting
                  ? "Confirming..."
                  : "Confirm booking"}
              </button>

              <Link
                href="/admin/services"
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Back to services
              </Link>
            </div>

            {message && (
              <p
                className={`${styles.formMessage} ${
                  messageType === "success"
                    ? styles.successMessage
                    : styles.errorMessage
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <aside
            className={`${styles.card} ${styles.summaryCard}`}
          >
            <p className={styles.eyebrow}>SUMMARY</p>

            {selectedService ? (
              <>
                <img
                  className={styles.summaryImage}
                  src={
                    selectedService.imageUrl ||
                    createServiceImage(
                      selectedService.name,
                      selectedService.category
                    )
                  }
                  alt={selectedService.name}
                />

                <h2 className={styles.summaryTitle}>
                  {selectedService.name}
                </h2>

                <p className={styles.summaryDesc}>
                  {selectedService.description}
                </p>

                <div className={styles.summaryLine}>
                  <span>Duration</span>

                  <strong>
                    {selectedService.durationMinutes} minutes
                  </strong>
                </div>

                <div className={styles.summaryLine}>
                  <span>Date</span>
                  <strong>{date || "—"}</strong>
                </div>

                <div className={styles.summaryLine}>
                  <span>Time</span>
                  <strong>{selectedTime || "—"}</strong>
                </div>

                <div className={styles.summaryLine}>
                  <span>Service fee</span>
                  <strong>${selectedService.price}</strong>
                </div>

                <hr />

                <div
                  className={`${styles.summaryLine} ${styles.total}`}
                >
                  <span>Total today</span>
                  <strong>${selectedService.price}</strong>
                </div>
              </>
            ) : (
              <p className={styles.summaryDesc}>
                Choose a service to see its information.
              </p>
            )}
          </aside>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <h3>Hearth.care</h3>

          <p>
            Trusted home healthcare, booked in minutes. Care
            that comes to you.
          </p>
        </div>

        <div className={styles.footerCol}>
          <p className={styles.footerHeading}>CARE</p>
          <Link href="/admin/services">Nursing</Link>
          <Link href="/admin/services">Physiotherapy</Link>
          <Link href="/admin/services">Doctor visits</Link>
          <Link href="/admin/services">
            Elderly companionship
          </Link>
        </div>

        <div className={styles.footerCol}>
          <p className={styles.footerHeading}>COMPANY</p>
          <Link href="#">About</Link>
          <Link href="#">Caregivers</Link>
          <Link href="#">Careers</Link>
          <Link href="#">Press</Link>
        </div>

        <div className={styles.footerCol}>
          <p className={styles.footerHeading}>SUPPORT</p>
          <Link href="#">Help center</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </div>
      </footer>
    </div>
  );
}