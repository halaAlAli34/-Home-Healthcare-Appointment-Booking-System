export type ServiceCategory =
  | "Nursing"
  | "Recovery"
  | "Medical"
  | "Companionship"
  | "Preventive";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  imageUrl?: string;
}

export type AppointmentStatus = "pending" | "accepted" | "rejected";

export interface Appointment {
  id: string; // e.g. APT-1042
  serviceName: string;
  patientName: string;
  caregiver?: string;
  date: string; // e.g. "2026-07-30"
  time: string; // e.g. "10:00 AM"
  address: string;
  status: AppointmentStatus;
}

export interface DashboardStats {
  pendingAppointments: number;
  todaysVisits: number;
  activeServices: number;
  revenueThisMonth: number;
}
