"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import {
  getCaregiversForService,
  type Caregiver,
} from "@/lib/caregivers";

interface ApiService {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  durationMinutes?: number;
  duration?: number;
  imageUrl?: string;
  active?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  active: boolean;
}

interface AvailabilityResponse {
  message: string;
  serviceId?: string;
  caregiverId?: string;
  date?: string;
  durationMinutes?: number;
  unavailableSlots: string[];
  occupiedSlots?: string[];
}

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

function normalizeService(
  service: ApiService,
): Service | null {
  const serviceId = service._id ?? service.id;

  if (!serviceId || !service.name) {
    return null;
  }

  return {
    id: serviceId,
    name: service.name,
    description: service.description ?? "",
    category: service.category ?? "",
    price: Number(service.price ?? 0),
    durationMinutes:
      service.durationMinutes ?? service.duration ?? 30,
    imageUrl: service.imageUrl,
    active: service.active !== false,
  };
}

function formatTime(time: string): string {
  const [hourValue, minuteValue] = time.split(":");
  const hour = Number(hourValue);

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minuteValue} ${period}`;
}

function addMinutes(
  startTime: string,
  durationMinutes: number,
): string {
  const [hours, minutes] = startTime
    .split(":")
    .map(Number);

  const totalMinutes =
    hours * 60 + minutes + durationMinutes;

  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;

  return `${String(endHours).padStart(
    2,
    "0",
  )}:${String(endMinutes).padStart(2, "0")}`;
}

function getTodayString(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookAppointmentPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] =
    useState(true);

  const [selectedServiceId, setSelectedServiceId] =
    useState("");

  const [selectedCaregiverId, setSelectedCaregiverId] =
    useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [unavailableSlots, setUnavailableSlots] =
    useState<string[]>([]);

  const [occupiedSlots, setOccupiedSlots] = useState<
    string[]
  >([]);

  const [loadingAvailability, setLoadingAvailability] =
    useState(false);

  const [availabilityLoaded, setAvailabilityLoaded] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] =
    useState<string | null>(null);

  const selectedService = useMemo(() => {
    return services.find(
      (service) => service.id === selectedServiceId,
    );
  }, [services, selectedServiceId]);

  const availableCaregivers: Caregiver[] = useMemo(() => {
    if (!selectedService) {
      return [];
    }

    return getCaregiversForService(
      selectedService.name,
      selectedService.category,
    );
  }, [selectedService]);

  const selectedCaregiver = useMemo(() => {
    return availableCaregivers.find(
      (caregiver) =>
        caregiver.id === selectedCaregiverId,
    );
  }, [availableCaregivers, selectedCaregiverId]);

  const selectedEndTime = useMemo(() => {
    if (!selectedTime || !selectedService) {
      return "";
    }

    return addMinutes(
      selectedTime,
      selectedService.durationMinutes,
    );
  }, [selectedTime, selectedService]);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoadingServices(true);
        setError(null);

        const response = await fetch("/api/services", {
          method: "GET",
          cache: "no-store",
        });

        const responseText = await response.text();

        let data: unknown;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "The services API returned an invalid response.",
          );
        }

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string"
              ? data.message
              : "Failed to load services.";

          throw new Error(message);
        }

        let rawServices: ApiService[] = [];

        if (Array.isArray(data)) {
          rawServices = data as ApiService[];
        } else if (
          typeof data === "object" &&
          data !== null &&
          "services" in data &&
          Array.isArray(data.services)
        ) {
          rawServices = data.services as ApiService[];
        }

        const normalizedServices = rawServices
          .map(normalizeService)
          .filter(
            (service): service is Service =>
              service !== null && service.active,
          );

        setServices(normalizedServices);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load services.",
        );
      } finally {
        setLoadingServices(false);
      }
    }

    void loadServices();
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      if (
        !selectedServiceId ||
        !selectedCaregiverId ||
        !selectedDate
      ) {
        setUnavailableSlots([]);
        setOccupiedSlots([]);
        setAvailabilityLoaded(false);
        return;
      }

      try {
        setLoadingAvailability(true);
        setAvailabilityLoaded(false);
        setSelectedTime("");
        setError(null);

        const params = new URLSearchParams({
          serviceId: selectedServiceId,
          caregiverId: selectedCaregiverId,
          date: selectedDate,
        });

        const response = await fetch(
          `/api/availability?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          },
        );

        const responseText = await response.text();

        let data: AvailabilityResponse;

        try {
          data = JSON.parse(
            responseText,
          ) as AvailabilityResponse;
        } catch {
          throw new Error(
            "The availability API returned an invalid response.",
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load availability.",
          );
        }

        setUnavailableSlots(
          Array.isArray(data.unavailableSlots)
            ? data.unavailableSlots
            : [],
        );

        setOccupiedSlots(
          Array.isArray(data.occupiedSlots)
            ? data.occupiedSlots
            : [],
        );

        setAvailabilityLoaded(true);
      } catch (availabilityError) {
        setUnavailableSlots([]);
        setOccupiedSlots([]);
        setAvailabilityLoaded(false);

        setError(
          availabilityError instanceof Error
            ? availabilityError.message
            : "Failed to load availability.",
        );
      } finally {
        setLoadingAvailability(false);
      }
    }

    void loadAvailability();
  }, [
    selectedServiceId,
    selectedCaregiverId,
    selectedDate,
  ]);

  function handleServiceChange(serviceId: string) {
    setSelectedServiceId(serviceId);
    setSelectedCaregiverId("");
    setSelectedDate("");
    setSelectedTime("");
    setUnavailableSlots([]);
    setOccupiedSlots([]);
    setAvailabilityLoaded(false);
    setError(null);
  }

  function handleCaregiverChange(
    caregiverId: string,
  ) {
    setSelectedCaregiverId(caregiverId);
    setSelectedDate("");
    setSelectedTime("");
    setUnavailableSlots([]);
    setOccupiedSlots([]);
    setAvailabilityLoaded(false);
    setError(null);
  }

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setSelectedTime("");
    setUnavailableSlots([]);
    setOccupiedSlots([]);
    setAvailabilityLoaded(false);
    setError(null);
  }

  function handleTimeSelection(time: string) {
    if (unavailableSlots.includes(time)) {
      return;
    }

    setSelectedTime(time);
    setError(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!selectedService) {
      setError("Please select a service.");
      return;
    }

    if (!selectedCaregiver) {
      setError("Please select a caregiver.");
      return;
    }

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (!selectedTime) {
      setError("Please select an available time.");
      return;
    }

    if (unavailableSlots.includes(selectedTime)) {
      setError(
        "Please select another available time.",
      );
      return;
    }

    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter an address.");
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
          serviceId: selectedService.id,
          caregiverId: selectedCaregiver.id,
          date: selectedDate,
          startTime: selectedTime,
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim(),
        }),
      });

      const responseText = await response.text();

      let data: {
        message?: string;
      };

      try {
        data = JSON.parse(responseText) as {
          message?: string;
        };
      } catch {
        throw new Error(
          "The appointments API returned an invalid response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to book the appointment.",
        );
      }

      setSuccess("Appointment booked successfully.");

      router.push("/my-appointments");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to book the appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Home healthcare
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Book an appointment
          </h1>

          <p className="mt-2 text-slate-600">
            Select a service, caregiver, date, and
            available time.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <Stethoscope className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Service
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select the healthcare service.
                  </p>
                </div>
              </div>

              {loadingServices ? (
                <div className="flex items-center gap-2 py-4 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <p className="text-sm text-red-600">
                  No active services are available.
                </p>
              ) : (
                <select
                  value={selectedServiceId}
                  onChange={(event) =>
                    handleServiceChange(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">
                    Choose a service
                  </option>

                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.id}
                    >
                      {service.name} —{" "}
                      {service.durationMinutes} minutes — $
                      {service.price}
                    </option>
                  ))}
                </select>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Caregiver
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select a healthcare worker.
                  </p>
                </div>
              </div>

              <select
                value={selectedCaregiverId}
                onChange={(event) =>
                  handleCaregiverChange(
                    event.target.value,
                  )
                }
                disabled={
                  !selectedService ||
                  availableCaregivers.length === 0
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">
                  {!selectedService
                    ? "Select a service first"
                    : availableCaregivers.length === 0
                      ? "No caregivers available"
                      : "Choose a caregiver"}
                </option>

                {availableCaregivers.map((caregiver) => (
                  <option
                    key={caregiver.id}
                    value={caregiver.id}
                  >
                    {caregiver.name} —{" "}
                    {caregiver.specialty}
                  </option>
                ))}
              </select>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-2 text-purple-700">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Date and time
                  </h2>

                  <p className="text-sm text-slate-500">
                    Gray slots are unavailable.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="appointment-date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Appointment date
                </label>

                <input
                  id="appointment-date"
                  type="date"
                  min={getTodayString()}
                  value={selectedDate}
                  onChange={(event) =>
                    handleDateChange(event.target.value)
                  }
                  disabled={!selectedCaregiverId}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Start time
                </label>

                {selectedService && (
                  <span className="text-xs text-slate-500">
                    Session:{" "}
                    {selectedService.durationMinutes} minutes
                  </span>
                )}
              </div>

              {loadingAvailability ? (
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading available times...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {TIME_SLOTS.map((time) => {
                    const unavailable =
                      unavailableSlots.includes(time);

                    const occupied =
                      occupiedSlots.includes(time);

                    const selected =
                      selectedTime === time;

                    const disabled =
                      !selectedCaregiverId ||
                      !selectedDate ||
                      !availabilityLoaded ||
                      unavailable;

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          handleTimeSelection(time)
                        }
                        title={
                          occupied
                            ? "Booked"
                            : unavailable
                              ? "The complete session does not fit in this time"
                              : "Available"
                        }
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                          selected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : unavailable
                              ? "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-400"
                              : "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
                        } disabled:hover:border-slate-200 disabled:hover:bg-slate-200`}
                      >
                        {formatTime(time)}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedTime &&
                selectedService &&
                selectedEndTime && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Selected session:{" "}
                    {formatTime(selectedTime)} to{" "}
                    {formatTime(selectedEndTime)}
                  </div>
                )}

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-slate-300 bg-white" />
                  Available
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-slate-200 bg-slate-200" />
                  Unavailable
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border border-emerald-600 bg-emerald-600" />
                  Selected
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 font-semibold text-slate-900">
                Patient information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="+961 70 000 000"
                      required
                      className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Address
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      placeholder="City, street, building"
                      required
                      className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  rows={4}
                  maxLength={1000}
                  placeholder="Optional medical notes"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-slate-900">
              Booking summary
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500">
                  Service
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedService?.name ?? "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Caregiver
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedCaregiver?.name ??
                    "Not selected"}
                </p>

                {selectedCaregiver && (
                  <p className="text-sm text-slate-500">
                    {selectedCaregiver.specialty}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Date
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedDate || "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Session time
                </p>

                <div className="mt-1 flex items-center gap-2 font-medium text-slate-900">
                  <Clock className="h-4 w-4" />

                  {selectedTime && selectedEndTime
                    ? `${formatTime(
                        selectedTime,
                      )} – ${formatTime(selectedEndTime)}`
                    : "Not selected"}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Duration
                  </span>

                  <span className="font-medium text-slate-900">
                    {selectedService
                      ? `${selectedService.durationMinutes} minutes`
                      : "—"}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-slate-600">
                    Price
                  </span>

                  <span className="text-xl font-bold text-emerald-700">
                    {selectedService
                      ? `$${selectedService.price}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                submitting ||
                !selectedService ||
                !selectedCaregiver ||
                !selectedDate ||
                !selectedTime ||
                loadingAvailability
              }
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm appointment"
              )}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}