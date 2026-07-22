export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Appointment {
  id: string;
  service: string;
  nurse: string;
  client: string;
  date: string;
  time: string;
  notes?: string;
  price?: number;
  status: AppointmentStatus;
}

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    service: "Blood Test",
    nurse: "Sarah Ahmed",
    client: "Omar Hammoud",
    date: "2026-07-24",
    time: "10:00 AM",
    notes: "Patient should be fasting before the appointment.",
    price: 20,
    status: "confirmed",
  },
  {
    id: "2",
    service: "Physiotherapy",
    nurse: "Maya Khalil",
    client: "Omar Hammoud",
    date: "2026-07-28",
    time: "2:00 PM",
    notes: "First physiotherapy session.",
    price: 35,
    status: "pending",
  },
  {
    id: "3",
    service: "IV Therapy",
    nurse: "Lina Hassan",
    client: "Omar Hammoud",
    date: "2026-07-18",
    time: "11:30 AM",
    notes: "Completed successfully.",
    price: 30,
    status: "completed",
  },
];
