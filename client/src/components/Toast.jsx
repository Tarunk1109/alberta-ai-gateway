import { useEffect } from "react";

export default function Toast({ show, type = "error", message, onClose, timeout = 2500 }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), timeout);
    return () => clearTimeout(t);
  }, [show, timeout, onClose]);

  if (!show) return null;
  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className={`px-4 py-3 rounded-lg shadow-lg text-sm border
        ${type === "error" ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-900/40" :
                             "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/40"}`}>
        {message}
      </div>
    </div>
  );
}
