import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";

ensureGsap();

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
  as?: "div" | "section";
};

/**
 * Scroll-reveal wrapper — UI/UX Pro Max "Scroll Reveal / Standard" preset:
 * fade + 24px rise, power2.out, staggered up to ~8 children, scoped
 * ScrollTrigger, toggleActions play-none-none-reverse so it doesn't
 * re-trigger on every direction change. Renders the final state
 * immediately under prefers-reduced-motion.
 */
export function Reveal({ children, className, stagger, delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;
      const targets = stagger ? gsap.utils.toArray(ref.current.children) : ref.current;
      gsap.from(targets, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        delay,
        stagger: stagger ? 0.08 : 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  const Comp = as as "div";
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Comp ref={ref as any} className={className}>
      {children}
    </Comp>
  );
}
