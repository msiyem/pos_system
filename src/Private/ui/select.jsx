import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={selectRef}>
      {label && (
        <label className="block font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        onClick={() => setOpen(!open)}
        className={`border p-2 rounded-md flex justify-between items-center cursor-pointer ${
          open ? "border-[#6120ab] border-2" : "border-gray-300"
        } bg-white hover:border-[#6120ab] transition`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-auto">
          {options.length === 0 ? (
            <div className="p-2 text-gray-500 text-sm text-center">
              No options
            </div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                  value === opt.value ? "bg-blue-100 font-medium" : ""
                }`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
