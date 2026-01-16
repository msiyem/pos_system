import { useEffect, useRef, useState } from 'react';
import { months, daysInMonth, firstDayOfMonth } from '../utils/date';

export default function DatePicker({ label = 'Select date', value, onChange }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('day'); // day | month | year
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const ref = useRef(null);

  const selectedDate = value ? new Date(value) : null;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setView('day');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectDay(day) {
    const d = new Date(year, month, day);
    onChange(d.toISOString().split('T')[0]);
    setOpen(false);
    setView('day');
  }

  function selectMonth(m) {
    setMonth(m);
    setView('day');
  }

  function selectYear(y) {
    setYear(y);
    setView('month');
  }

  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const years = Array.from({ length: 120 }, (_, i) => year - 60 + i);

  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      {/* 🔹 Floating Input */}
      <div
        onClick={() => setOpen(true)}
        className="relative h-14 border rounded-lg px-3 pt-4 cursor-pointer bg-white
             focus-within:ring-2 focus-within:ring-blue-500"
      >
        {/* Floating Label */}
        <span
          className={`absolute left-3 px-1 bg-white text-gray-500 transition-all pointer-events-none
      ${
        value
          ? '-top-2 text-xs text-blue-600'
          : 'top-1/2 -translate-y-1/2 text-sm'
      }`}
        >
          {label}
        </span>

        {/* Value */}
        <div className="text-sm mt-1 text-gray-900">{value || ''}</div>
      </div>

      {/* 🔹 Calendar */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg p-4">
          {/* Header */}
          <div className="flex justify-center gap-2 mb-3 text-sm font-medium">
            <button
              onClick={() => setView('month')}
              className="hover:text-blue-600"
            >
              {months[month]}
            </button>
            <button
              onClick={() => setView('year')}
              className="hover:text-blue-600"
            >
              {year}
            </button>
          </div>

          {/* DAY VIEW */}
          {view === 'day' && (
            <>
              <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={i} />
                ))}

                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year;

                  return (
                    <button
                      key={day}
                      onClick={() => selectDay(day)}
                      className={`h-8 w-8 rounded-lg text-sm
                      ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-blue-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* MONTH VIEW */}
          {view === 'month' && (
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, i) => (
                <button
                  key={m}
                  onClick={() => selectMonth(i)}
                  className={`p-2 rounded-lg text-sm
                    ${
                      i === month
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-blue-100'
                    }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* YEAR VIEW */}
          {view === 'year' && (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => selectYear(y)}
                  className={`p-2 rounded-lg text-sm
                    ${
                      y === year
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-blue-100'
                    }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
