import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { useIsMobile } from "../../lib/useIsMobile";
import type { Project } from "../../data/projects";
import { PhotoLayer } from "./PhotoLayer";
import { StageIndicator, type StageIndicatorHandle } from "./StageIndicator";

ensureGsap();

type Props = {
  project: Project;
  index: number;
  /** "pinned" = full cinematic scroll-scrub, pinned for its own height
   * (the 3 flagship sections). "inview" = the same real-photo spatial
   * transform, played once as the section enters view, no pinning — used
   * for the editorial gallery so scrolling never gets hijacked outside
   * the three flagship moments. */
  mode: "pinned" | "inview";
};

/**
 * The cinematic real-photography transformation engine (spec §05-08,17).
 *
 * No per-object segmentation exists in the source photography (no
 * isolated, alpha-cut furniture) — so every strategy here treats a whole
 * real photograph as one "layer" and moves it with 3D perspective
 * transforms (translateX/Z, rotateY, scale), never a plain opacity
 * crossfade and never a fabricated object:
 *
 *  - "layered": two real photo pairs (different camera angles of the same
 *    room) run on staggered timelines — genuine multi-photo depth.
 *  - "masked" / "webgl-plane": a single real photo pair swings away in
 *    perspective to reveal the AFTER photo settling into frame beneath it.
 *
 * Scroll fully drives the timeline (GSAP ScrollTrigger `scrub`): stopping
 * the scroll stops the animation at that exact point, and scrolling up
 * reverses it — no autoplay independent of scroll position.
 */
export function TransformationScene({ project, index, mode }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageIndicatorHandle>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const layered = project.strategy === "layered" && project.pairs.length > 1 && !isMobile;

  useGSAP(
    () => {
      if (!root.current || reduced) return;

      // Mobile simplification (spec §29): shorter pin distance, no pin at
      // all below the md breakpoint (a long pinned sequence on a small,
      // often lower-powered screen fights native scroll far more than it
      // adds), and a flatter, cheaper 3D transform.
      const mm = gsap.matchMedia();

      mm.add(
        { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" },
        (ctx) => {
          const { isMobile } = ctx.conditions as { isMobile: boolean };
          const pinThis = mode === "pinned" && !isMobile;
          const depth = isMobile
            ? { x: 16, z: -80, rot: -4, scale: 0.96 }
            : { x: 26, z: -260, rot: -9, scale: 0.9 };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: pinThis ? "+=140%" : isMobile ? "+=70%" : "+=100%",
              scrub: 0.8,
              pin: pinThis,
              anticipatePin: 1,
              onUpdate: (self) => stageRef.current?.setProgress(self.progress),
            },
          });

          const layers = gsap.utils.toArray<HTMLElement>(
            root.current!.querySelectorAll("[data-layer]"),
          );

          layers.forEach((layer, i) => {
            const before = layer.querySelector(".tf-before");
            const after = layer.querySelector(".tf-after");
            // Stagger real depth layers slightly (spec §06 "stagger
            // movement slightly") — only meaningful with >1 real photo
            // pair (already excluded on mobile via `layered` itself).
            const at = layered ? i * 0.08 : 0;

            tl.to(
              before,
              {
                xPercent: -depth.x,
                z: depth.z,
                rotateY: depth.rot,
                scale: depth.scale,
                opacity: 0,
                ease: "none",
              },
              at,
            ).fromTo(
              after,
              { xPercent: depth.x, z: depth.z * 0.8, rotateY: -depth.rot, scale: 2 - depth.scale },
              { xPercent: 0, z: 0, rotateY: 0, scale: 1, ease: "none" },
              at,
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced, mode, layered, isMobile] },
  );

  const pair = project.pairs[0];
  const containerClass =
    mode === "pinned"
      ? "perspective-container relative h-[100svh] w-full overflow-hidden bg-bg"
      : "perspective-container relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-bg md:aspect-[16/10]";

  if (reduced) {
    // Reduced-motion fallback: no spatial motion at all — a clean,
    // instantly-legible reveal of the finished space (spec §11/30).
    return (
      <div className={containerClass}>
        <img
          src={pair.after}
          alt={`${project.room} after renovation by Progetto Build`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.afterLQIP})`, backgroundSize: "cover" }}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
        <div className="relative flex h-full flex-col justify-end p-6 pb-12 md:p-14">
          <Caption project={project} index={index} />
        </div>
      </div>
    );
  }

  const layerPairs = layered ? project.pairs : [pair];

  return (
    <div ref={root} className={containerClass}>
      {layerPairs.map((p, i) => (
        <PhotoLayer
          key={i}
          pair={p}
          roomLabel={project.room}
          layerIndex={i}
          eager={index === 0 && i === 0}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

      <div className="relative z-40 flex h-full flex-col justify-end p-6 pb-12 md:p-14">
        <StageIndicator className="max-w-xs" ref={stageRef} />
        <Caption project={project} index={index} />
      </div>
    </div>
  );
}

function Caption({ project, index }: { project: Project; index: number }) {
  return (
    <div className="mt-5">
      <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
        Transformation · {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-3 max-w-2xl font-display text-h1 leading-[1.02] text-ink">
        {project.room}
      </h3>
      <p className="mt-4 max-w-xl text-base text-ink-soft">{project.description}</p>
    </div>
  );
}
