import { Service } from "@/types";

interface ServicesResponse {
  success: boolean;
  services: {
    id: string;
    name: string;
    category: Service["category"];
    durationMinutes: number;
    price: number;
    description: string;
    imageUrl?: string;
  }[];
}

/**
 * The Services CRUD API (GET/POST/PUT/DELETE /api/services) is owned by a
 * teammate per the task split. Home and Services pages are Hala's pages,
 * but they still need service data to render, so this helper:
 *   1. Tries the real API first.
 *   2. Falls back to this sample data if that endpoint isn't ready yet
 *      or the request fails, so the UI never breaks during parallel dev.
 * Once /api/services ships, this file needs zero changes elsewhere —
 * every page already calls getServices()/getFeaturedServices().
 */
/**
 * Photos are real, content-matched stock photography from Unsplash (free
 * license, no attribution required) — not random placeholder images —
 * chosen to actually depict each service (e.g. the physiotherapy photo
 * shows a physiotherapy session, not an arbitrary stock photo).
 */
const FALLBACK_SERVICES: Service[] = [
  {
    id: "in-home-nursing-visit",
    name: "In-home Nursing Visit",
    description:
      "Vitals, medication review, wound care, and post-op follow-up by a licensed RN.",
    price: 65,
    duration: "45 min",
    category: "Nursing",
    image: "https://images.unsplash.com/photo-1543333995-a78aea2eee50?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "physiotherapy-session",
    name: "Physiotherapy Session",
    description:
      "Mobility, strength, and pain management guided by a certified physiotherapist.",
    price: 70,
    duration: "50 min",
    category: "Recovery",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "doctor-home-visit",
    name: "Doctor Home Visit",
    description:
      "A general practitioner comes to your door — diagnosis, prescriptions, referrals.",
    price: 120,
    duration: "40 min",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1631558554184-319c88f4f8a4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "elderly-companionship",
    name: "Elderly Companionship",
    description:
      "Warm company, light help around the home, walks, meals, and conversation.",
    price: 55,
    duration: "2 hrs",
    category: "Companionship",
    image: "https://images.unsplash.com/photo-1762955911769-d652ceaa94bb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "wellness-check-in",
    name: "Wellness Check-in",
    description:
      "A brief visit to check on health, mood, and daily routines. Peace of mind.",
    price: 40,
    duration: "30 min",
    category: "Preventive",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "post-operative-care",
    name: "Post-Operative Care",
    description:
      "Recovery support after surgery: dressings, mobility, medication schedule.",
    price: 85,
    duration: "60 min",
    category: "Recovery",
    image: "https://images.unsplash.com/photo-1773227055624-07b515ba87c5?q=80&w=1000&auto=format&fit=crop",
  },
];

export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch("/api/services", { cache: "no-store" });

    if (!res.ok) return FALLBACK_SERVICES;

    const data: ServicesResponse = await res.json();

    return Array.isArray(data.services) && data.services.length > 0
      ? data.services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: `${service.durationMinutes} min`,
          category: service.category,
          image: service.imageUrl ?? "",
        }))
      : FALLBACK_SERVICES;
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getFeaturedServices(count = 3): Promise<Service[]> {
  const all = await getServices();
  return all.slice(0, count);
}
