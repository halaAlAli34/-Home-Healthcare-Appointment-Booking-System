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
  active: boolean;
}

export type AppointmentStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  patientName: string;
  caregiver?: string;
  date: string;
  time: string;
  address: string;
  status: AppointmentStatus;
}

export interface DashboardStats {
  pendingAppointments: number;
  todaysVisits: number;
  activeServices: number;
  revenueThisMonth: number;
}