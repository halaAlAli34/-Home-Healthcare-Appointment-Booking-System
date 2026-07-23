import { Pencil, Trash2 } from "lucide-react";
import { Service } from "@/lib/types";
import Image from "next/image";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleActive,
}: ServiceCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-6">
      {service.imageUrl && (
  <div className="mb-4 overflow-hidden rounded-xl">
    <Image
      src={service.imageUrl}
      alt={service.name}
      width={400}
      height={200}
      className="h-40 w-full object-cover"
    />
  </div>
)}
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
  onClick={() => onToggleActive(service.id, service.active)}
  aria-label={`${service.active ? "Disable" : "Enable"} ${service.name}`}
  className="rounded-full px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-cream"
>
  {service.active ? "Disable" : "Enable"}
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
      <span
  className={`mt-2 inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
    service.active
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-600"
  }`}
>
  {service.active ? "Active" : "Disabled"}
</span>
      <p className="mt-2 flex-1 text-sm text-ink-muted">
        {service.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-display text-lg font-medium text-ink">
          ${service.price}
        </span>
        
      </div>
    </div>
  );
}
