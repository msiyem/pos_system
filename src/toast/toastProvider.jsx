import { createContext, useState } from "react";
import ToastContainer from "./toastContainer";

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, visible: false } : t
      )
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  const showToast = (message, type = "success", duration = 3000) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [
      ...prev,
      { id, message, type, visible: false },
    ]);

    // enter
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, visible: true } : t
        )
      );
    }, 10);

    // auto dismiss
    setTimeout(() => dismissToast(id), duration);
  };

  const value = {
    success: (msg, d) => showToast(msg, "success", d),
    error: (msg, d) => showToast(msg, "error", d),
    info: (msg, d) => showToast(msg, "info", d),
    dismiss: dismissToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </ToastContext.Provider>
  );
}
