"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ServiceCard from "@/components/admin/ServiceCard";
import ServiceModal from "@/components/admin/ServiceModal";
import { Service } from "@/lib/types";

export default function ManageServicesPage() {
const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);


  useEffect(() => {
  fetchServices();
}, []);

async function fetchServices() {
  try {
    const response = await fetch("/api/admin/services");

    const data = await response.json();

    setServices(data.services ?? []);

  } catch (error) {
    console.error("Failed to fetch services", error);
  }
}


function openAddModal() {
  console.log("ADD CLICKED");
  setEditingService(null);
  setModalOpen(true);
}

  function openEditModal(service: Service) {
    setEditingService(service);
    setModalOpen(true);
  }

async function handleSave(service: Service) {
  try {
    const isEditing = Boolean(editingService);

    const response = await fetch(
      isEditing
        ? `/api/services/${service.id}`
        : "/api/services",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to save service");
    }

    setServices((prev) =>
      isEditing
        ? prev.map((s) =>
            s.id === service.id ? data.service : s
          )
        : [...prev, data.service]
    );

    setModalOpen(false);
    setEditingService(null);

  } catch (error) {
    console.error("Save service error:", error);
  }
}

  async function handleDelete(id: string) {
  try {
    const response = await fetch(`/api/services/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete service");
    }

    setServices((prev) =>
      prev.filter((service) => service.id !== id)
    );

  } catch (error) {
    console.error("Delete service error:", error);
  }
}


async function handleToggleActive(id: string, active: boolean) {
  try {
    const response = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active: !active,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update service.");
    }

    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, active: !active }
          : service
      )
    );
  } catch (error) {
    console.error("Toggle service error:", error);
  }
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
              onToggleActive={handleToggleActive}
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
