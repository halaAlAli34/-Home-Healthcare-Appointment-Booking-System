export type UserRole = "patient" | "admin";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type ServiceCategory =
  | "Nursing"
  | "Recovery"
  | "Medical"
  | "Companionship"
  | "Preventive";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g. "45 min" or "2 hrs" — matches the design's label format
  category: ServiceCategory;
  image: string;
}
