"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ServiceCard from "@/components/admin/ServiceCard";
import ServiceModal from "@/components/admin/ServiceModal";
import { initialServices } from "@/lib/mock-data";
import { Service } from "@/lib/types";

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  function openAddModal() {
    setEditingService(null);
    setModalOpen(true);
  }

  function openEditModal(service: Service) {
    setEditingService(service);
    setModalOpen(true);
  }

  function handleSave(service: Service) {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      return exists
        ? prev.map((s) => (s.id === service.id ? service : s))
        : [...prev, service];
    });
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-hearth">
            Admin
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink">
            Manage services
          </h1>
          <p className="mt-2 text-ink-muted">
            Add, edit, or retire the visits families can book.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 self-start rounded-pill bg-hearth px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-hearth-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-white p-10 text-center text-ink-muted">
          No services yet. Add your first one to make it bookable.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ServiceModal
        open={modalOpen}
        initialService={editingService}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
