import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FullPanel({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="relative h-full w-full bg-white dark:bg-neutral-950">
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between border-b">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={onClose} className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-neutral-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-w-6xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100%-56px)]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
