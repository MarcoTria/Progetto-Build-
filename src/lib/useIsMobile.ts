import { useEffect, useState } from "react";

/** Matches Tailwind's `md` breakpoint. Used to genuinely reduce work on
 * mobile (fewer real-photo layers, no pinning) rather than just skipping
 * an animation — spec §29 "reduce layer count", "simplify 3D". */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
