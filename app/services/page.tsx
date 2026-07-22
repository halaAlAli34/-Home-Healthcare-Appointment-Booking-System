"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Service, ServiceCategory } from "@/types";
import { getServices } from "@/lib/services";
import ServiceCard from "@/components/ServiceCard";

const CATEGORIES: ("All" | ServiceCategory)[] = [
  "All",
  "Nursing",
  "Recovery",
  "Medical",
  "Companionship",
  "Preventive",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  useEffect(() => {
    getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? services : services.filter((s) => s.category === active)),
    [services, active]
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow mb-3">Our services</p>
      <h1 className="mb-4 max-w-2xl font-display text-4xl leading-tight text-ink">
        Care matched to the moment.
      </h1>
      <p className="mb-8 max-w-xl text-ink-muted">
        Every visit is delivered by a vetted, licensed professional. Pricing is
        transparent — no memberships, no hidden fees.
      </p>

      <div className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "bg-hearth text-white"
                : "border border-border bg-white text-ink hover:bg-cream-footer"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading services…
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-ink-muted">No services in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <div key={service.id} id={service.id}>
              <ServiceCard service={service} variant="button" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
