"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Quote } from "lucide-react";
import { Service } from "@/types";
import { getFeaturedServices } from "@/lib/services";
import ServiceCard from "@/components/ServiceCard";

const STATS = [
  { value: "12k+", label: "Home visits" },
  { value: "4.9★", label: "Family rating" },
  { value: "24/7", label: "Support line" },
];

const STEPS = [
  {
    n: "01",
    title: "Choose a service",
    text: "Pick from nursing, physio, doctor visits, or companionship — with clear pricing up front.",
  },
  {
    n: "02",
    title: "Pick a time and place",
    text: "Same-day slots or a date that fits your week. We'll come to any address you like.",
  },
  {
    n: "03",
    title: "Meet your caregiver",
    text: "A vetted, licensed professional arrives on time. You'll know exactly who's coming.",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Service[]>([]);

  useEffect(() => {
    getFeaturedServices(3).then(setFeatured);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-hearth" aria-hidden />
              Now serving the greater metro area
            </span>

            <h1 className="font-display text-4xl leading-[1.1] text-ink md:text-5xl">
              Care that comes <em className="text-hearth italic">home</em> to you.
            </h1>

            <p className="max-w-md text-ink-muted">
              Book a licensed nurse, physiotherapist, or doctor for an in-home
              visit — same-day when you need it, scheduled ahead when you don&apos;t.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/book-appointment" className="btn btn-primary">
                Book an appointment
              </Link>
              <Link href="/services" className="btn btn-ghost">
                Browse all services
              </Link>
            </div>

            <div className="mt-4 flex gap-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1765896387387-0538bc9f997e?q=80&w=1200&auto=format&fit=crop"
                alt="A nurse caring for an elderly patient at home"
                fill
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Floating live-visit card */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl bg-white/95 p-3 pr-4 shadow-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hearth-light font-display text-sm font-medium text-hearth">
                  A
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">Amelia, RN is on her way</p>
                  <p className="text-xs text-ink-muted">Arriving in ~12 min · Nursing visit</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-hearth">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-hearth" aria-hidden />
                Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-hearth-light px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="mb-10 max-w-xl font-display text-3xl leading-tight text-ink">
            Three steps to a caregiver at your door.
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl bg-white p-6">
                <p className="mb-4 font-display text-2xl text-hearth">{step.n}</p>
                <h3 className="mb-2 font-display text-lg text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Featured care</p>
              <h2 className="font-display text-3xl leading-tight text-ink">
                The visits families book most.
              </h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-1 text-sm font-medium text-hearth hover:underline"
            >
              See all services <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} variant="link" />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl bg-hearth px-8 py-12 md:px-14 md:py-16">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <Quote className="mb-4 h-8 w-8 text-white/50" aria-hidden />
                <p className="font-display text-xl leading-relaxed text-white md:text-2xl">
                  My mother lives alone, and Hearth changed how we care for her. A
                  nurse visits weekly and I get a note the same day. It&apos;s the
                  calmest I&apos;ve felt in years.
                </p>
                <p className="mt-5 text-sm text-white/70">
                  — Renee K., daughter and family coordinator
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-white/10 px-8 py-6 text-center">
                <p className="eyebrow mb-2 text-white/60">Family score</p>
                <p className="font-display text-4xl text-white">4.9</p>
                <p className="mt-1 text-xs text-white/60">Across 3,200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
