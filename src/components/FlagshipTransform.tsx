import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";
import type { Project } from "../data/projects";
import { SplitCompare } from "./SplitCompare";

ensureGsap();

type Props = {
  project: Project;
  index: number;
};

/**
 * Flagship pinned scroll-scrub transformation (UI/UX Pro Max "Scroll
 * Reveal / Complex" preset). Pinned for the section's own height only,
 * scrub tied to scroll position, full-bleed real photography — no
 * synthetic geometry. Limited to two per page per the skill's guidance
 * ("don't pin more than 1-2 sections; excessive pinning fights native
 * scroll feel").
 */
export function FlagshipTransform({ project, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pair = project.pairs[0];
  const [w, h] = pair.afterDim;

  useGSAP(
    () => {
      if (reduced || !root.current || !beforeRef.current) return;

      const ctx = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      ctx
        .fromTo(
          beforeRef.current,
          { clipPath: "inset(0 0% 0 0)" },
          { clipPath: "inset(0 100% 0 0)", ease: "none" },
          0,
        )
        .fromTo(labelRef.current, { opacity: 1 }, { opacity: 0, ease: "none" }, 0)
        .fromTo(
          `.flagship-after-label-${index}`,
          { opacity: 0 },
          { opacity: 1, ease: "none" },
          0,
        );
    },
    { scope: root, dependencies: [reduced] },
  );

  if (reduced) {
    // Static, fully accessible fallback: same real photography, user-driven.
    return (
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Header project={project} index={index} />
        <div className="mt-8">
          <SplitCompare pair={pair} roomLabel={project.room} eager={index === 0} />
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src={pair.after}
          alt={`${project.room} after renovation by Progetto Build`}
          className="h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.afterLQIP})`, backgroundSize: "cover" }}
          width={w}
          height={h}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
      <div ref={beforeRef} className="absolute inset-0 overflow-hidden">
        <img
          src={pair.before}
          alt={`${project.room} before renovation`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ backgroundImage: `url(${pair.beforeLQIP})`, backgroundSize: "cover" }}
          width={w}
          height={h}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-16 text-white md:p-16">
        <div className="relative h-4">
          <div ref={labelRef} className="absolute inset-0">
            <p className="font-body text-xs uppercase tracking-widest2 text-gold-bright">
              Before · {String(index + 1).padStart(2, "0")}
            </p>
          </div>
          <div className={`flagship-after-label-${index} absolute inset-0 opacity-0`}>
            <p className="font-body text-xs uppercase tracking-widest2 text-gold-bright">
              After · {String(index + 1).padStart(2, "0")}
            </p>
          </div>
        </div>
        <h3 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
          {project.room}
        </h3>
        <p className="mt-4 max-w-xl font-body text-sm text-white/80 md:text-base">
          {project.description}
        </p>
        <p className="mt-8 font-body text-xs uppercase tracking-widest2 text-white/50">
          Scroll to reveal
        </p>
      </div>
    </section>
  );
}

function Header({ project, index }: { project: Project; index: number }) {
  return (
    <div>
      <p className="font-body text-xs uppercase tracking-widest2 text-gold-deep">
        Transformation · {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-ink md:text-5xl">
        {project.room}
      </h3>
      <p className="mt-4 max-w-xl font-body text-sm text-ink-soft md:text-base">
        {project.description}
      </p>
    </div>
  );
}
