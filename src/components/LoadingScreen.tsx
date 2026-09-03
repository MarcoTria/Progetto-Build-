import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Short cinematic loader (spec §11): a mask reveal + blur-to-sharp pass on
 * the real logo, 1.5–2.5s max, no spinner. Skips straight to done under
 * prefers-reduced-motion rather than holding the page hostage.
 */
export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const exitTimer = setTimeout(() => setExiting(true), 1500);
    const doneTimer = setTimeout(onDone, 2200);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [reduced, onDone]);

  if (reduced) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => exiting && onDone()}
      aria-hidden="true"
    >
      <div className="overflow-hidden">
        <motion.img
          src="/images/logo/lockup-full-white.png"
          alt=""
          className="h-16 w-auto md:h-20"
          initial={{ y: "100%", filter: "blur(14px)", opacity: 0 }}
          animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
