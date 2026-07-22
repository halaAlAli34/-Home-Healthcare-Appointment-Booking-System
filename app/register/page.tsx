"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "password", string[]>>;

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to register. Please try again.");
        setFieldErrors(data.fields || {});
        return;
      }

      await refresh();
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
      {/* Left copy column — same pattern as Login for visual consistency */}
      <div className="flex flex-col gap-4">
        <p className="eyebrow">Get started</p>
        <h1 className="font-display text-4xl leading-tight text-ink md:text-[2.75rem]">
          Join the families who trust Hearth.
        </h1>
        <p className="max-w-sm text-ink-muted">
          Create an account to book your first visit, track upcoming
          appointments, and keep every caregiver&apos;s notes in one place.
        </p>
      </div>

      {/* Right form card */}
      <div className="w-full rounded-2xl border border-border bg-white p-8 shadow-sm md:justify-self-end md:max-w-md">
        <h2 className="mb-1 font-display text-2xl text-ink">Create account</h2>
        <p className="mb-6 text-sm text-ink-muted">Tell us a bit about you to get started.</p>

        {error && (
          <p className="mb-4 rounded-md bg-danger-light px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              required
              className="input-field"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            {fieldErrors.name && (
              <p className="text-xs text-danger">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {fieldErrors.email && (
              <p className="text-xs text-danger">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              required
              className="input-field"
              placeholder="+1 000 000 0000"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            {fieldErrors.phone && (
              <p className="text-xs text-danger">{fieldErrors.phone[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              className="input-field"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-xs text-danger">{fieldErrors.password[0]}</p>
            )}
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary mt-1 w-full">
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-hearth hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
