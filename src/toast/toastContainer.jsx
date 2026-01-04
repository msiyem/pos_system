import { Cross, X } from "lucide-react";

export default function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 min-w-[250px]
            px-5 py-4 rounded-xl shadow-lg text-white text-sm font-medium
            transition-all duration-500 ease-out
            ${
              toast.visible
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }
            ${toast.type === "success" ? "bg-green-500" : ""}
            ${toast.type === "error" ? "bg-red-500" : ""}
            ${toast.type === "info" ? "bg-blue-500" : ""}
          `}
        >
          <span className="flex-1 ">{toast.message}</span>

          <button
            onClick={() => onClose(toast.id)}
            className="text-white/50 hover:text-white text-lg leading-none"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>
      ))}
    </div>
  );
}
