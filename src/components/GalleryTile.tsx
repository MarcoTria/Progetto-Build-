import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "../data/projects";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Editorial gallery tile (spec §21): the finished photograph shown large,
 * with the before photo available only as a secondary, explicit "detail"
 * interaction — never a drag slider, never the primary experience. The
 * toggle is a real, keyboard-operable, aria-pressed button; the swap
 * itself is a Framer Motion micro-interaction (directional slide + scale,
 * not a plain opacity crossfade), since this is a discrete hover/tap
 * interaction rather than a scroll-scrubbed timeline.
 */
export function GalleryTile({ item, className }: { item: GalleryItem; className?: string }) {
  const [showBefore, setShowBefore] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();
  const { pair } = item;
  const [w, h] = pair.afterDim;

  return (
    <figure className={`group relative mb-6 break-inside-avoid md:mb-10 ${className ?? ""}`}>
      <div
        className="relative overflow-hidden rounded-sm bg-surface"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={showBefore ? "before" : "after"}
            src={showBefore ? pair.before : pair.after}
            alt={
              showBefore
                ? `${item.room} before renovation`
                : `${item.room} after renovation by Progetto Build`
            }
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              backgroundImage: `url(${showBefore ? pair.beforeLQIP : pair.afterLQIP})`,
              backgroundSize: "cover",
            }}
            width={w}
            height={h}
            initial={reduced ? false : { opacity: 0, x: showBefore ? -24 : 24, scale: 1.03 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: showBefore ? 24 : -24, scale: 1.03 }}
            transition={{ duration: reduced ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduced ? undefined : { scale: 1.035 }}
          />
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <motion.figcaption
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold-bright">
            {showBefore ? "Before" : "After"}
          </p>
          <h3 className="mt-1 font-display text-h3 text-ink">{item.room}</h3>
        </motion.figcaption>

        <button
          type="button"
          id={id}
          aria-pressed={showBefore}
          onClick={() => setShowBefore((v) => !v)}
          className="absolute bottom-4 right-4 min-h-[36px] rounded-sm border border-ink/20 bg-bg/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink backdrop-blur-sm transition-colors duration-200 hover:border-gold hover:text-gold-bright"
        >
          {showBefore ? "View after" : "View before"}
        </button>
      </div>
    </figure>
  );
}
