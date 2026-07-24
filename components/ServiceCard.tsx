import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Service } from "@/types";

export default function ServiceCard({
  service,
  variant = "link",
}: {
  service: Service;
  variant?: "link" | "button";
}) {
  return (
    <div className="card">
      <div className="relative h-44 w-full">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="eyebrow">
          {service.category}
          {variant === "button" && ` · ${service.duration}`}
        </span>
        <h3 className="font-display text-lg font-medium text-ink">{service.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">{service.description}</p>

        <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
          {variant === "link" ? (
            <>
              <span className="text-sm text-ink">
                ${service.price} · {service.duration}
              </span>
              <Link
                href={`/book-appointment?serviceId=${service.id}`}
                className="flex items-center gap-1 text-sm font-medium text-hearth hover:underline"
              >
                Book <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </>
          ) : (
            <>
              <span className="font-display text-lg font-medium text-ink">
                ${service.price}
              </span>
              <Link href={`/book-appointment?serviceId=${service.id}`} className="btn btn-primary btn-sm">
                Book
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
