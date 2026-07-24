"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Service, ServiceCategory } from "@/lib/types";

const categories: ServiceCategory[] = [
  "Nursing",
  "Recovery",
  "Medical",
  "Companionship",
  "Preventive",
];

interface ServiceModalProps {
  open: boolean;
  initialService: Service | null; // null = creating a new service
  onClose: () => void;
  onSave: (service: Service) => void;
}

const emptyDraft = {
  name: "",
  category: "Nursing" as ServiceCategory,
  durationMinutes: 30,
  price: 0,
  description: "",
  imageUrl: "",
};
export default function ServiceModal({
  open,
  initialService,
  onClose,
  onSave,
}: ServiceModalProps) {
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (initialService) {
  setDraft({
    name: initialService.name ?? "",
    category: initialService.category ?? "Nursing",
    durationMinutes: initialService.durationMinutes ?? 30,
    price: initialService.price ?? 0,
    description: initialService.description ?? "",
    imageUrl: initialService.imageUrl ?? "",
  });
    } else {
      setDraft(emptyDraft);
    }
  }, [initialService, open]);

  if (!open) return null;

  const isEditing = Boolean(initialService);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      id: initialService?.id ?? `srv-${Date.now()}`,
      ...draft,
      active: initialService?.active ?? true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-hearth">
              {isEditing ? "Edit service" : "Add a service"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink">
              {isEditing ? initialService?.name : "New service"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink-muted hover:bg-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Service name
            </label>
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. In-home Nursing Visit"
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-hearth focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Category
              </label>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    category: e.target.value as ServiceCategory,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:border-hearth focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Duration (min)
              </label>
              <input
                required
                type="number"
                min={5}
                step={5}
                value={draft.durationMinutes}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    durationMinutes: Number(e.target.value),
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:border-hearth focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Price (USD)
            </label>
            <input
              required
              type="number"
              min={0}
              step={5}
              value={draft.price}
              onChange={(e) =>
                setDraft({ ...draft, price: Number(e.target.value) })
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:border-hearth focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="What does this visit include?"
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-hearth focus:outline-none"
            />
          </div>

                    <div>
  <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
    Image URL
  </label>

  <input
    type="text"
    value={draft.imageUrl}
    onChange={(e) =>
      setDraft({
        ...draft,
        imageUrl: e.target.value,
      })
    }
    placeholder="https://example.com/image.jpg"
    className="mt-1.5 w-full rounded-xl border border-border bg-cream px-4 py-2.5 text-sm text-ink focus:border-hearth focus:outline-none"
  />
</div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-pill bg-hearth px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-hearth-hover"
            >
              {isEditing ? "Save changes" : "Add service"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-hearth"
            >
              Cancel
            </button>
          </div>


        </form>
      </div>
    </div>
  );
}
