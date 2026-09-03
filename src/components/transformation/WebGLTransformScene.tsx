import { Suspense, lazy, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../lib/useReducedMotion";
import type { Project } from "../../data/projects";
import { StageIndicator, type StageIndicatorHandle } from "./StageIndicator";

ensureGsap();

const WebGLPlane = lazy(() => import("./WebGLPlane"));

type Props = { project: Project; index: number };

/**
 * The one flagship that earns real WebGL (spec §02: "Three.js / R3F only
 * where they materially improve depth"): a shader-driven cross-dissolve
 * between the two real photo textures, with a soft directional wipe and a
 * slight parallax offset for depth — no geometry, no fabricated objects,
 * just the two actual photographs as GPU textures. Scroll progress is
 * pushed straight into a `uProgress` uniform via a scrub ScrollTrigger;
 * the canvas renders on demand (frameloop="demand") so it costs nothing
 * between scroll ticks.
 */
export function WebGLTransformScene({ project, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageIndicatorHandle>(null);
  const progressRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();
  const pair = project.pairs[0];

  useGSAP(
    () => {
      if (!root.current || reduced) return;

      const mm = gsap.matchMedia();
      mm.add({ isMobile: "(max-width: 767px)" }, (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };

        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: isMobile ? "+=70%" : "+=140%",
            scrub: 0.8,
            pin: !isMobile,
            anticipatePin: 1,
            onUpdate: (self) => {
              progressRef.current = self.progress;
              invalidateRef.current?.();
              stageRef.current?.setProgress(self.progress);
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <div className="perspective-container relative h-[100svh] w-full overflow-hidden bg-bg">
        <img
          src={pair.after}
          alt={`${project.room} after renovation by Progetto Build`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.afterLQIP})`, backgroundSize: "cover" }}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <Overlay project={project} index={index} stageRef={null} />
      </div>
    );
  }

  return (
    <div ref={root} className="relative h-[100svh] w-full overflow-hidden bg-bg">
      <Suspense
        fallback={
          <img
            src={pair.beforeLQIP}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        }
      >
        <WebGLPlane
          before={pair.before}
          after={pair.after}
          progressRef={progressRef}
          invalidateRef={invalidateRef}
        />
      </Suspense>
      <Overlay project={project} index={index} stageRef={stageRef} />
    </div>
  );
}

function Overlay({
  project,
  index,
  stageRef,
}: {
  project: Project;
  index: number;
  stageRef: React.RefObject<StageIndicatorHandle> | null;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
      <div className="relative z-40 flex h-full flex-col justify-end p-6 pb-12 md:p-14">
        {stageRef && <StageIndicator className="max-w-xs" ref={stageRef} />}
        <div className="mt-5">
          <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
            Transformation · {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 max-w-2xl font-display text-h1 leading-[1.02] text-ink">
            {project.room}
          </h3>
          <p className="mt-4 max-w-xl text-base text-ink-soft">{project.description}</p>
        </div>
      </div>
    </>
  );
}
