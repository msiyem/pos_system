import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";   // ✅ correct import
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon } from "lucide-react";

export default function DatePicker({button_text}) {
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-1 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
      >
        <CalendarIcon className="w-4 h-4 text-gray-500" />
        {date ? format(date, "PPP") : button_text}
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-1 ">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(selected) => {
              setDate(selected);
              setOpen(false);
            }}
            className=""
          />
        </div>
      )}
    </div>
  );
}
