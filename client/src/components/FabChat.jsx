import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FabChat({ open, setOpen, children }) {
  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed z-40 bottom-5 right-5 rounded-full shadow-lg border bg-white dark:bg-neutral-900 p-3"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="relative"
        >
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <span className="absolute -top-2 -left-20 hidden sm:block text-xs bg-blue-600 text-white px-2 py-1 rounded-full shadow">
            Talk to me →
          </span>
        </motion.div>
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white dark:bg-neutral-950 border-l"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
