import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function Notification({ count }) {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleEventRef(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleEventRef);
    return () => {
      document.removeEventListener("mousedown", handleEventRef);
    };
  }, [open]);

  const notifications = [
    "new message from admin",
    "order #123 has been shipped",
    "meeting at 5 PM today",
    "my name is siyem",
    "i am a student",
    "my village name ichail",
    "this is my first project",
    "this project name is pos-system",
  ];

  const onVisibleHandle = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(notifications.length);
      setLoading(false);
    }, 600);
  };

  const onOpenHandle = () => {
    setOpen(!open);
    setVisibleCount(5);
    setLoading(false);
  };

  return (
    <div ref={notificationRef} className="relative ">
      <button
        onClick={onOpenHandle}
        className=" relative flex h-10 w-10 bg-[rgb(248,244,244)] right-0 rounded-full justify-center items-center cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute h-3 w-3 -right-0 -top-0 text-[10px] ring-0 rounded-full bg-red-600 text-white flex justify-center items-center">
            {count}
          </span>
        )}
      </button>

      {/* Dropdown with animation */}
      <div
        className={`absolute right-0
          mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden z-50
          transform origin-top-right transition-all duration-300 ease-in-out
          ${open ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex justify-between w-full p-2">
          <p className="text font-semibold">Notifications</p>
          <p className="text-[12px] cursor-pointer hover:underline">
            Mark all as read
          </p>
        </div>
        <div className="flex flex-col overflow-y-auto max-h-64 space-y-2">
          {notifications.slice(0, visibleCount).map((note, idx) => (
            <div
              key={idx}
              className="ring-0 rounded-lg border-gray-200 border-[2px] mx-1 p-2 bg-white hover:bg-gray-50 transition"
            >
              <div className="flex flex-col">
                <p className="text-[14px] font-semibold">
                  Notification {idx + 1}
                </p>
                <p>{note}</p>
                <p className="text-[11px] text-gray-500 text-right mt-1">
                  1h ago
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* load more */}
        <div className="m-1">
          {visibleCount < notifications.length && (
            <button
              className="text-center w-full ring-0 border-gray-200 border-[2px] rounded-xl text-[15px] font-semibold bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
              onClick={onVisibleHandle}
              disabled={loading}
            >
              {loading ? "Loading.." : "Load more"}
            </button>
          )}
          {visibleCount === notifications.length && (
            <button
              className="text-center w-full ring-0 border-gray-200 border-[2px] rounded-xl text-[15px] font-semibold bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setOpen(false)}
            >
              Close all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
