import { Cross, X } from "lucide-react";

export default function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 min-w-[250px]
            px-5 py-4 border rounded-xl shadow-lg  text-sm font-medium
            transition-all duration-500 ease-out
            ${
              toast.visible
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }
            ${toast.type === "success" ? "bg-green-100 text-green-600 border-green-200" : ""}
            ${toast.type === "error" ? "bg-rose-100 text-rose-500 border-red-200" : ""}
            ${toast.type === "info" ? "bg-indigo-100 text-indigo-500 border-blue-200" : ""}
          `}
        >
          <span className="flex-1 ">{toast.message}</span>

          <button
            onClick={() => onClose(toast.id)}
            className={`text-lg leading-none
              ${toast.type === "success" ? " text-green-500" : ""}
            ${toast.type === "error" ? "text-rose-400" : ""}
            ${toast.type === "info" ? "text-indigo-400" : ""}`}
          >
            <X className="w-5 h-5"/>
          </button>
        </div>
      ))}
    </div>
  );
}
