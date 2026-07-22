import type { Service } from "@/lib/types";

interface AppointmentSummaryProps {
  service?: Service;
  patientName: string;
  date: string;
  time: string;
  address: string;
}

export default function AppointmentSummary({
  service,
  patientName,
  date,
  time,
  address,
}: AppointmentSummaryProps) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Appointment Summary
      </h2>

      <div className="mt-6 space-y-5">
        <SummaryItem
          label="Service"
          value={service?.name || "Not selected"}
        />

        <SummaryItem
          label="Patient"
          value={patientName || "Not entered"}
        />

        <SummaryItem label="Date" value={date || "Not selected"} />

        <SummaryItem label="Time" value={time || "Not selected"} />

        <SummaryItem
          label="Address"
          value={address || "Not entered"}
        />

        {service && (
          <>
            <div className="border-t border-slate-200 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Duration</span>

                <span className="font-semibold text-slate-900">
                  {service.durationMinutes} minutes
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
              <span className="font-medium text-emerald-800">
                Estimated price
              </span>

              <span className="text-xl font-bold text-emerald-700">
                ${service.price}
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}