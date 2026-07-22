"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to log in. Please try again.");
        return;
      }

      await refresh();
      const redirectTo = searchParams.get("redirectTo");
      router.push(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
      {/* Left copy column */}
      <div className="flex flex-col gap-4">
        <p className="eyebrow">Welcome back</p>
        <h1 className="font-display text-4xl leading-tight text-ink md:text-[2.75rem]">
          Your care, all in one place.
        </h1>
        <p className="max-w-sm text-ink-muted">
          See upcoming visits, reschedule with a tap, and keep notes from every
          caregiver.
        </p>
      </div>

      {/* Right form card */}
      <div className="w-full rounded-2xl border border-border bg-white p-8 shadow-sm md:justify-self-end md:max-w-md">
        <h2 className="mb-1 font-display text-2xl text-ink">Log in</h2>
        <p className="mb-6 text-sm text-ink-muted">Enter your details to continue.</p>

        {error && (
          <p className="mb-4 rounded-md bg-danger-light px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-hearth hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary mt-1 w-full">
            {submitting ? "Logging in…" : "Log in"}
          </button>

          <p className="text-center text-sm text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-hearth hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
