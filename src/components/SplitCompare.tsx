import { useId, useState } from "react";
import type { Pair } from "../data/projects";

type Props = {
  pair: Pair;
  roomLabel: string;
  eager?: boolean;
  /** Show our own corner label. Only pass true for source photos that
   * don't already carry a baked-in "BEFORE"/"AFTER" pill (see
   * NO_BAKED_LABEL_SLUGS in projects.ts) — otherwise the two labels
   * overlap and clash. */
  showBadge?: boolean;
};

/**
 * Real-photograph before/after comparison using clip-path reveal — the
 * 2.5D technique called for when true object segmentation isn't reliable:
 * both photos are the actual renovation photography, no synthetic
 * furniture or fabricated geometry, just a clipped overlay driven by an
 * accessible native range input.
 *
 * Accessibility (UI/UX Pro Max priority 1-2): native <input type="range">
 * gives full keyboard + screen-reader support, the drag target is the
 * full card (well over the 44x44px minimum), and state is announced via
 * a live badge rather than color alone.
 */
export function SplitCompare({ pair, roomLabel, eager = false, showBadge = false }: Props) {
  const [percent, setPercent] = useState(50);
  const [touched, setTouched] = useState(false);
  const id = useId();
  const [w, h] = pair.afterDim;

  return (
    <div className="relative select-none">
      <div
        className="relative w-full overflow-hidden rounded-sm bg-ink/5"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        {/* AFTER — base layer */}
        <img
          src={pair.after}
          alt={`${roomLabel} after renovation by Progetto Build`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.afterLQIP})`, backgroundSize: "cover" }}
          width={w}
          height={h}
        />

        {/* BEFORE — same full-container image, clipped from the right so
            it aligns pixel-for-pixel with the AFTER layer beneath it */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          <img
            src={pair.before}
            alt={`${roomLabel} before renovation`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ backgroundImage: `url(${pair.beforeLQIP})`, backgroundSize: "cover" }}
            width={w}
            height={h}
          />
        </div>

        {/* divider + handle (decorative) */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${percent}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg ring-1 ring-black/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M8 6L2 12L8 18M16 6L22 12L16 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Most source photographs already carry the client's own corner
            label baked into the pixels — only add our own where that
            isn't the case, so the two never overlap/clash. */}
        {showBadge && (
          <div
            className="pointer-events-none absolute left-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest2 text-white"
            aria-hidden="true"
          >
            {percent < 50 ? "Before" : "After"}
          </div>
        )}

        {!touched && (
          <div
            className="pointer-events-none absolute bottom-3 right-3 hidden rounded-sm bg-white/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink/70 sm:block"
            aria-hidden="true"
          >
            Drag to compare
          </div>
        )}

        <label htmlFor={id} className="sr-only">
          {roomLabel}: drag to reveal before and after photographs, currently showing{" "}
          {percent}% before
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => {
            setPercent(Number(e.target.value));
            setTouched(true);
          }}
          onPointerDown={() => setTouched(true)}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ margin: 0 }}
        />
      </div>
    </div>
  );
}
