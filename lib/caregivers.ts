export type CaregiverRole =
  | "Doctor"
  | "Nurse"
  | "Physiotherapist"
  | "Care Assistant";

export interface Caregiver {
  id: string;
  name: string;
  role: CaregiverRole;
  specialty: string;
  phone: string;
  email: string;
  active: boolean;
}

export const caregivers: Caregiver[] = [
  // Doctors
  {
    id: "doctor-001",
    name: "Dr. Ahmad Khalil",
    role: "Doctor",
    specialty: "General Medicine",
    phone: "+961 70 123 401",
    email: "ahmad.khalil@example.com",
    active: true,
  },
  {
    id: "doctor-002",
    name: "Dr. Lina Saad",
    role: "Doctor",
    specialty: "Family Medicine",
    phone: "+961 70 123 402",
    email: "lina.saad@example.com",
    active: true,
  },
  {
    id: "doctor-003",
    name: "Dr. Rami Nasser",
    role: "Doctor",
    specialty: "Internal Medicine",
    phone: "+961 70 123 403",
    email: "rami.nasser@example.com",
    active: true,
  },
  {
    id: "doctor-004",
    name: "Dr. Nour Haddad",
    role: "Doctor",
    specialty: "Pediatrics",
    phone: "+961 70 123 404",
    email: "nour.haddad@example.com",
    active: true,
  },
  {
    id: "doctor-005",
    name: "Dr. Maya Fakhoury",
    role: "Doctor",
    specialty: "Women’s Health",
    phone: "+961 70 123 405",
    email: "maya.fakhoury@example.com",
    active: true,
  },

  // Nurses
  {
    id: "nurse-001",
    name: "Rana Ali",
    role: "Nurse",
    specialty: "Home Nursing",
    phone: "+961 71 223 501",
    email: "rana.ali@example.com",
    active: true,
  },
  {
    id: "nurse-002",
    name: "Hiba Hassan",
    role: "Nurse",
    specialty: "Wound Care",
    phone: "+961 71 223 502",
    email: "hiba.hassan@example.com",
    active: true,
  },
  {
    id: "nurse-003",
    name: "Fatima Khaled",
    role: "Nurse",
    specialty: "Post-Surgery Care",
    phone: "+961 71 223 503",
    email: "fatima.khaled@example.com",
    active: true,
  },
  {
    id: "nurse-004",
    name: "Mohammad Saleh",
    role: "Nurse",
    specialty: "IV Therapy",
    phone: "+961 71 223 504",
    email: "mohammad.saleh@example.com",
    active: true,
  },
  {
    id: "nurse-005",
    name: "Aya Nasser",
    role: "Nurse",
    specialty: "Pediatric Nursing",
    phone: "+961 71 223 505",
    email: "aya.nasser@example.com",
    active: true,
  },
  {
    id: "nurse-006",
    name: "Ali Hamdan",
    role: "Nurse",
    specialty: "Respiratory Care",
    phone: "+961 71 223 506",
    email: "ali.hamdan@example.com",
    active: true,
  },

  // Physiotherapists
  {
    id: "physio-001",
    name: "Youssef Darwish",
    role: "Physiotherapist",
    specialty: "General Physiotherapy",
    phone: "+961 76 323 601",
    email: "youssef.darwish@example.com",
    active: true,
  },
  {
    id: "physio-002",
    name: "Sara Khoury",
    role: "Physiotherapist",
    specialty: "Sports Rehabilitation",
    phone: "+961 76 323 602",
    email: "sara.khoury@example.com",
    active: true,
  },
  {
    id: "physio-003",
    name: "Omar Ibrahim",
    role: "Physiotherapist",
    specialty: "Neurological Rehabilitation",
    phone: "+961 76 323 603",
    email: "omar.ibrahim@example.com",
    active: true,
  },
  {
    id: "physio-004",
    name: "Leila Salem",
    role: "Physiotherapist",
    specialty: "Mobility and Balance",
    phone: "+961 76 323 604",
    email: "leila.salem@example.com",
    active: true,
  },

  // Care assistants
  {
    id: "assistant-001",
    name: "Mariam Ibrahim",
    role: "Care Assistant",
    specialty: "Elderly Companionship",
    phone: "+961 81 423 701",
    email: "mariam.ibrahim@example.com",
    active: true,
  },
  {
    id: "assistant-002",
    name: "Hussein Darwish",
    role: "Care Assistant",
    specialty: "Personal Care Assistance",
    phone: "+961 81 423 702",
    email: "hussein.darwish@example.com",
    active: true,
  },
  {
    id: "assistant-003",
    name: "Dina Mansour",
    role: "Care Assistant",
    specialty: "Daily Living Assistance",
    phone: "+961 81 423 703",
    email: "dina.mansour@example.com",
    active: true,
  },
  {
    id: "assistant-004",
    name: "Samir Hassan",
    role: "Care Assistant",
    specialty: "Overnight Patient Support",
    phone: "+961 81 423 704",
    email: "samir.hassan@example.com",
    active: true,
  },
];

export function getCaregiversForService(
  serviceName: string,
  serviceCategory?: string,
): Caregiver[] {
  const name = serviceName.toLowerCase();
  const category = serviceCategory?.toLowerCase() ?? "";

  let requiredRole: CaregiverRole;

  if (category === "recovery") {
    requiredRole = "Physiotherapist";
  } else if (category === "companionship") {
    requiredRole = "Care Assistant";
  } else if (category === "nursing") {
    requiredRole = "Nurse";
  } else if (category === "medical") {
    requiredRole = "Doctor";
  } else if (category === "preventive") {
    requiredRole = "Nurse";
  } else if (
    name.includes("physiotherapy") ||
    name.includes("rehabilitation") ||
    name.includes("mobility") ||
    name.includes("balance") ||
    name.includes("occupational therapy")
  ) {
    requiredRole = "Physiotherapist";
  } else if (
    name.includes("companion") ||
    name.includes("personal care") ||
    name.includes("daily living") ||
    name.includes("meal preparation") ||
    name.includes("household") ||
    name.includes("respite")
  ) {
    requiredRole = "Care Assistant";
  } else if (
    name.includes("doctor") ||
    name.includes("consultation") ||
    name.includes("pediatric") ||
    name.includes("women") ||
    name.includes("medical")
  ) {
    requiredRole = "Doctor";
  } else {
    requiredRole = "Nurse";
  }

  return caregivers.filter(
    (caregiver) =>
      caregiver.role === requiredRole && caregiver.active,
  );
}

export function getCaregiverById(
  caregiverId: string,
): Caregiver | undefined {
  return caregivers.find(
    (caregiver) =>
      caregiver.id === caregiverId && caregiver.active,
  );
}