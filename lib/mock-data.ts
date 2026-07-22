import type {
  Appointment,
  DashboardStats,
  Service,
} from "./types";

export const initialServices: Service[] = [
  {
    id: "srv-nursing",
    name: "In-home Nursing Visit",
    category: "Nursing",
    durationMinutes: 45,
    price: 65,
    description:
      "Vitals, medication review, wound care, injections, and general nursing support provided at home.",
    imageUrl: "/images/services/nursing.jpg",
  },
  {
    id: "srv-physiotherapy",
    name: "Physiotherapy Session",
    category: "Recovery",
    durationMinutes: 50,
    price: 70,
    description:
      "Mobility, strength, rehabilitation, and pain-management support from a certified physiotherapist.",
    imageUrl: "/images/services/physiotherapy.jpg",
  },
  {
    id: "srv-doctor",
    name: "Doctor Home Visit",
    category: "Medical",
    durationMinutes: 40,
    price: 120,
    description:
      "A general practitioner visits your home for assessment, diagnosis, prescriptions, and referrals.",
    imageUrl: "/images/services/doctor.jpg",
  },
  {
    id: "srv-companionship",
    name: "Elderly Companionship",
    category: "Companionship",
    durationMinutes: 120,
    price: 55,
    description:
      "Friendly companionship, conversation, light home assistance, walks, and meal support.",
    imageUrl: "/images/services/companionship.jpg",
  },
  {
    id: "srv-wellness",
    name: "Wellness Check-in",
    category: "Preventive",
    durationMinutes: 30,
    price: 40,
    description:
      "A short wellness visit to check general health, mood, routines, and medication adherence.",
    imageUrl: "/images/services/wellness.jpg",
  },
  {
    id: "srv-postoperative",
    name: "Post-Operative Care",
    category: "Recovery",
    durationMinutes: 60,
    price: 85,
    description:
      "At-home recovery support after surgery, including dressing checks, mobility support, and medication reminders.",
    imageUrl: "/images/services/postoperative.jpg",
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: "APT-1042",
    serviceName: "In-home Nursing Visit",
    patientName: "Omar Hammoud",
    caregiver: "Amelia Torres, RN",
    date: "2026-07-30",
    time: "10:00 AM",
    address: "128 Linden Ave, Apt 3B",
    status: "accepted",
  },
  {
    id: "APT-1039",
    serviceName: "Physiotherapy Session",
    patientName: "Omar Hammoud",
    caregiver: "Marcus Bell, PT",
    date: "2026-08-01",
    time: "02:30 PM",
    address: "128 Linden Ave, Apt 3B",
    status: "pending",
  },
  {
    id: "APT-1034",
    serviceName: "Doctor Home Visit",
    patientName: "Omar Hammoud",
    caregiver: "Dr. Sarah Mitchell",
    date: "2026-07-10",
    time: "11:30 AM",
    address: "128 Linden Ave, Apt 3B",
    status: "accepted",
  },
  {
    id: "APT-1028",
    serviceName: "Wellness Check-in",
    patientName: "Omar Hammoud",
    date: "2026-06-18",
    time: "09:00 AM",
    address: "128 Linden Ave, Apt 3B",
    status: "rejected",
  },
  {
    id: "APT-1048",
    serviceName: "Post-Operative Care",
    patientName: "Rania Khalil",
    date: "2026-08-04",
    time: "01:00 PM",
    address: "24 Garden Street, Beirut",
    status: "pending",
  },
  {
    id: "APT-1051",
    serviceName: "Elderly Companionship",
    patientName: "George Haddad",
    caregiver: "Nadia Williams",
    date: "2026-08-05",
    time: "04:00 PM",
    address: "8 Cedar Road, Saida",
    status: "accepted",
  },
];

export const dashboardStats: DashboardStats = {
  pendingAppointments: 3,
  todaysVisits: 4,
  activeServices: 6,
  revenueThisMonth: 4250,
};

export const featuredServices: Service[] = initialServices.slice(0, 4);

export const availableTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "04:00 PM",
];

export const unavailableTimeSlots = [
  "10:30 AM",
  "01:00 PM",
];

export const caregivers = [
  {
    id: "caregiver-001",
    name: "Amelia Torres",
    role: "Registered Nurse",
    qualification: "RN",
    experienceYears: 8,
    rating: 4.9,
    completedVisits: 286,
    available: true,
  },
  {
    id: "caregiver-002",
    name: "Marcus Bell",
    role: "Physiotherapist",
    qualification: "PT",
    experienceYears: 6,
    rating: 4.8,
    completedVisits: 198,
    available: true,
  },
  {
    id: "caregiver-003",
    name: "Sarah Mitchell",
    role: "General Practitioner",
    qualification: "MD",
    experienceYears: 11,
    rating: 4.9,
    completedVisits: 341,
    available: false,
  },
  {
    id: "caregiver-004",
    name: "Nadia Williams",
    role: "Companion Caregiver",
    qualification: "Certified Caregiver",
    experienceYears: 5,
    rating: 4.7,
    completedVisits: 167,
    available: true,
  },
];

export const clientProfile = {
  id: "client-001",
  firstName: "Omar",
  lastName: "Hammoud",
  fullName: "Omar Hammoud",
  email: "omar.hammoud@example.com",
  phone: "+961 70 123 456",
  address: "128 Linden Ave, Apt 3B",
  city: "Saida",
  emergencyContactName: "Ahmad Hammoud",
  emergencyContactPhone: "+961 71 987 654",
};

export const testimonials = [
  {
    id: "testimonial-001",
    name: "Layla Mansour",
    text: "Booking a nurse for my mother was simple, fast, and reassuring.",
    rating: 5,
  },
  {
    id: "testimonial-002",
    name: "Karim Haddad",
    text: "The physiotherapist arrived on time and explained every step clearly.",
    rating: 5,
  },
  {
    id: "testimonial-003",
    name: "Maya Khalil",
    text: "Hearth.care made home healthcare much easier for our family.",
    rating: 5,
  },
];

export const adminRecentAppointments = initialAppointments.slice(0, 5);

export const revenueData = [
  {
    month: "March",
    revenue: 2800,
  },
  {
    month: "April",
    revenue: 3200,
  },
  {
    month: "May",
    revenue: 3650,
  },
  {
    month: "June",
    revenue: 3900,
  },
  {
    month: "July",
    revenue: 4250,
  },
];