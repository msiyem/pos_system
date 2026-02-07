import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function EntriesDropdown({
  value,
  options = [10, 20, 50, 100],
  onChange,
  open,
  setOpen
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  return (
    <div ref={ref} className="relative ml-auto">
      <div className="flex gap-1 items-center">
        <span>Show</span>

        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 border border-gray-400 rounded-lg mt-1 px-2 cursor-pointer select-none"
        >
          <span className="min-w-[3ch] text-center">{value}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        <span>entries</span>
      </div>

      {open && (
        <div className="absolute right-13 mt-2 z-50 border border-gray-300 bg-white shadow rounded">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-1 hover:bg-blue-100 cursor-pointer text-center"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
