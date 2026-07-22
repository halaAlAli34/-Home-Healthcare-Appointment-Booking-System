import { Appointment, Service } from "./types";

export const initialServices: Service[] = [
  {
    id: "srv-nursing",
    name: "In-home Nursing Visit",
    category: "Nursing",
    durationMinutes: 45,
    price: 65,
    description:
      "Vitals, medication review, wound care, and post-op follow-up by a licensed RN.",
  },
  {
    id: "srv-physio",
    name: "Physiotherapy Session",
    category: "Recovery",
    durationMinutes: 50,
    price: 70,
    description:
      "Mobility, strength, and pain management guided by a certified physiotherapist.",
  },
  {
    id: "srv-doctor",
    name: "Doctor Home Visit",
    category: "Medical",
    durationMinutes: 40,
    price: 120,
    description:
      "A general practitioner comes to your door — diagnosis, prescriptions, referrals.",
  },
  {
    id: "srv-companionship",
    name: "Elderly Companionship",
    category: "Companionship",
    durationMinutes: 120,
    price: 55,
    description:
      "Warm company, light help around the home, walks, meals, and conversation.",
  },
  {
    id: "srv-wellness",
    name: "Wellness Check-in",
    category: "Preventive",
    durationMinutes: 30,
    price: 40,
    description:
      "A brief visit to check on health, mood, and daily routines. Peace of mind.",
  },
  {
    id: "srv-postop",
    name: "Post-Operative Care",
    category: "Recovery",
    durationMinutes: 60,
    price: 85,
    description:
      "Recovery support after surgery: dressings, mobility, medication schedule.",
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: "APT-1042",
    serviceName: "In-home Nursing Visit",
    patientName: "Grace Whitfield",
    caregiver: "Amelia Torres, RN",
    date: "Thu, Jul 30",
    time: "10:00 AM",
    address: "128 Linden Ave, Apt 3B",
    status: "accepted",
  },
  {
    id: "APT-1039",
    serviceName: "Physiotherapy Session",
    patientName: "Grace Whitfield",
    caregiver: "Marcus Bell, PT",
    date: "Sat, Aug 1",
    time: "2:30 PM",
    address: "128 Linden Ave, Apt 3B",
    status: "pending",
  },
  {
    id: "APT-1044",
    serviceName: "Doctor Home Visit",
    patientName: "Harold Whitfield",
    date: "Fri, Jul 31",
    time: "9:30 AM",
    address: "128 Linden Ave, Apt 3B",
    status: "pending",
  },
  {
    id: "APT-1031",
    serviceName: "Elderly Companionship",
    patientName: "Grace Whitfield",
    caregiver: "Nora Diaz",
    date: "Mon, Jul 27",
    time: "1:00 PM",
    address: "128 Linden Ave, Apt 3B",
    status: "rejected",
  },
];
