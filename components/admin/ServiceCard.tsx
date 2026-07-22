import { Pencil, Trash2 } from "lucide-react";
import { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {service.category} · {service.durationMinutes} min
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(service)}
            aria-label={`Edit ${service.name}`}
            className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-hearth-light hover:text-hearth"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            aria-label={`Delete ${service.name}`}
            className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-danger-light hover:text-danger"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <h3 className="mt-3 font-display text-xl font-medium text-ink">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-muted">
        {service.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-display text-lg font-medium text-ink">
          ${service.price}
        </span>
        <button
          onClick={() => onEdit(service)}
          className="rounded-pill border border-border px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-hearth hover:text-hearth"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
