interface TimeSlotPickerProps {
  selectedTime: string;
  onSelect: (time: string) => void;
}

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
];

const unavailableSlots = ["10:30 AM", "1:30 PM"];

export default function TimeSlotPicker({
  selectedTime,
  onSelect,
}: TimeSlotPickerProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Available time
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {timeSlots.map((time) => {
          const unavailable = unavailableSlots.includes(time);
          const selected = selectedTime === time;

          return (
            <button
              key={time}
              type="button"
              disabled={unavailable}
              onClick={() => onSelect(time)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                unavailable
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : selected
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Grey time slots are unavailable.
      </p>
    </div>
  );
}