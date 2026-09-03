import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../lib/useReducedMotion";
import type { CinematicProject } from "../../data/cinematic";
import { StageIndicator, type StageIndicatorHandle } from "../transformation/StageIndicator";

ensureGsap();

const CinematicScene = lazy(() =>
  import("./CinematicScene").then((m) => ({ default: m.CinematicScene })),
);

type Props = { project: CinematicProject; index: number };

/**
 * The cinematic camera-journey stage (spec §06-08, §22): scroll fully
 * drives a virtual camera dollying THROUGH the real BEFORE photograph,
 * through a dark spatial transition, and out into the real AFTER
 * photograph — built from genuine depth bands (see CinematicScene),
 * never a plain crossfade and never a fabricated object.
 *
 * Desktop: pinned for ~300vh so the journey has room to breathe without
 * being punishingly long. Mobile: not pinned at all (a long pinned
 * sequence "fights" a small screen far more than it adds — spec §23) —
 * instead the same real WebGL journey plays over a much shorter,
 * naturally-flowing scroll range, in a shorter 70-80svh frame.
 *
 * The WebGL scene itself only mounts once this section is near the
 * viewport, and unmounts (disposing the GL context) once it's well
 * past — spec §25's "mount the active scene only when near viewport."
 */
export function CinematicJourney({ project, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageIndicatorHandle>(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  const [nearViewport, setNearViewport] = useState(index === 0);

  const [w, h] = project.cinematic.after.sourceDim;
  const aspect = w / h;

  useEffect(() => {
    if (!root.current || nearViewport) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNearViewport(true);
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [nearViewport]);

  // Unmount the WebGL scene again once scrolled well past — releases
  // the GL context instead of leaving several idle canvases alive.
  useEffect(() => {
    if (!root.current || !nearViewport) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setNearViewport(false);
      },
      { rootMargin: "200% 0px" },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [nearViewport]);

  useGSAP(
    () => {
      if (!root.current || !frameRef.current || reduced) return;

      const mm = gsap.matchMedia();
      // Both conditions must be given (covering the full width range) —
      // gsap.matchMedia only invokes this callback for a breakpoint whose
      // named condition currently matches, so a lone "isMobile" query
      // never fires on desktop and silently creates zero ScrollTriggers.
      mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" }, (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean; isDesktop: boolean };

        // Pin the whole stage (caption + frame together), not just the
        // inner frame — pinning a flex child on its own leaves its
        // sibling (the caption) and the pin-spacer math unstable.
        ScrollTriggerFor(root.current!, isMobile, (p) => {
          progressRef.current = p;
          stageRef.current?.setProgress(p);
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  const frameStyle: React.CSSProperties = { aspectRatio: `${w} / ${h}` };

  if (reduced) {
    return (
      <StaticFallback project={project} index={index} aspect={aspect} frameStyle={frameStyle} />
    );
  }

  return (
    <div ref={root} className="relative bg-bg">
      <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-16 md:py-24">
        <Caption project={project} index={index} stageRef={stageRef} />
        <div
          ref={frameRef}
          className="relative mx-auto mt-8 w-auto max-w-[1400px] overflow-hidden rounded-sm bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
          style={{ ...frameStyle, height: "min(78vh, 820px)" }}
        >
          {nearViewport && (
            <Suspense fallback={<FramePreview src={project.cinematic.before.bands.mid.src} />}>
              <CinematicScene
                pair={project.cinematic}
                aspect={aspect}
                progressRef={progressRef}
                reduced={false}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

/** Drives `onProgress` from a scrub ScrollTrigger, pinned on desktop
 * (≈300vh) and un-pinned + short on mobile (spec §22/23). */
function ScrollTriggerFor(
  el: HTMLElement,
  isMobile: boolean,
  onProgress: (p: number) => void,
) {
  gsap.timeline({
    scrollTrigger: {
      trigger: el,
      pin: !isMobile,
      start: isMobile ? "top 75%" : "top top",
      end: isMobile ? "bottom 25%" : "+=300%",
      scrub: 0.7,
      anticipatePin: 1,
      onUpdate: (self) => onProgress(self.progress),
    },
  });
}

function Caption({
  project,
  index,
  stageRef,
}: {
  project: CinematicProject;
  index: number;
  stageRef: React.RefObject<StageIndicatorHandle>;
}) {
  return (
    <div className="w-full max-w-3xl text-center">
      <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
        Cinematic Journey · {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-4 font-display text-h1 leading-[1.02] text-ink">{project.room}</h3>
      <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">{project.description}</p>
      <StageIndicator className="mx-auto mt-6 max-w-xs" ref={stageRef} />
    </div>
  );
}

function FramePreview({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover opacity-60 blur-sm"
    />
  );
}

function StaticFallback({
  project,
  index,
  aspect,
  frameStyle,
}: {
  project: CinematicProject;
  index: number;
  aspect: number;
  frameStyle: React.CSSProperties;
}) {
  void aspect;
  return (
    <div className="bg-bg px-6 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
          Cinematic Journey · {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-4 font-display text-h1 leading-[1.02] text-ink">{project.room}</h3>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">{project.description}</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        <figure
          className="relative mx-auto w-full overflow-hidden rounded-sm bg-black"
          style={frameStyle}
        >
          <img
            src={project.fullBefore}
            alt={`${project.room} before renovation`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Bottom-left, matching GalleryTile's caption placement — the
              source photo already carries its own baked-in corner pill
              (top-left), so a caption there would double up on it. */}
          <figcaption className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-ink">
            Before
          </figcaption>
        </figure>
        <figure
          className="relative mx-auto w-full overflow-hidden rounded-sm bg-black"
          style={frameStyle}
        >
          <img
            src={project.fullAfter}
            alt={`${project.room} after renovation by Progetto Build`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <figcaption className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-ink">
            After
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
