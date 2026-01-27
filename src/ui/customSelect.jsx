import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  error,
  required,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const optionRefs = useRef([]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  
  const selectOption = (opt) => {
    onChange(opt.value);
    setSearch("");
    setOpen(false);
  };

  
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = Math.min(prev + 1, filteredOptions.length - 1);
        optionRefs.current[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        optionRefs.current[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const opt = filteredOptions[activeIndex];
      if (opt) selectOption(opt);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  
  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [open, activeIndex]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className="relative w-full space-y-0">
      {label && (
        <label className="font-semibold mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      
      <button
        type="button"
        name={name}
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => searchRef.current?.focus(), 0);
        }}
        className={`w-full border rounded-md px-4 py-2 mt-1 flex justify-between items-center bg-white/90 cursor-pointer
        ${error ? "border-red-500" : "border-gray-300 hover:border-gray-400 border shadow"}`}
      >
        <span className={value ? "text-gray-950" : "text-gray-500"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      
      {open && (
        <div
          onKeyDown={handleKeyDown}
          className="absolute z-20 mt-1 w-full bg-white border-2 border-gray-300  rounded-md shadow-lg p-2"
        >
          
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type to search . . ."
            className="w-full border border-gray-300 shadow px-3 py-1 rounded-lg mb-2 outline-none"
          />

          
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length === 0 && (
              <p className="text-sm text-red-600/50 text-center py-1">
                No results found!
              </p>
            )}

            {filteredOptions.map((opt, i) => (
              <div
                key={opt.value}
                ref={(el) => (optionRefs.current[i] = el)}
                onClick={() => selectOption(opt)}
                className={`px-3 py-2 cursor-pointer rounded
                ${i === activeIndex ? "bg-blue-100" : "hover:bg-blue-50"}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
