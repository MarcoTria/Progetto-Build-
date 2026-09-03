import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";
import { asset } from "../lib/asset";

ensureGsap();

// The main entryway's finished photo — the single strongest, most
// cinematic frame in the set (twilight uplighting, symmetry). This is a
// hero-specific re-crop (top ~10% trimmed) of the same real photograph,
// generated to clear the source composite's small baked-in "AFTER"
// corner pill before it sits inside the hero's narrower frame aspect —
// the processed before/after pair itself (used everywhere else) is
// untouched.
const HERO_IMAGE = asset("/images/renovations/main-entryway/hero-after.jpg");

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Premium HYLIOX-style hero (spec §11): NOT a giant full-bleed photo —
 * one excellent AFTER photograph inside a controlled, contained frame
 * (a fixed portion of the viewport, its own shadow and edges, dark
 * space around it), paired with large editorial typography. Motion here
 * stays deliberately subtle; the cinematic journeys are the site's real
 * "wow" moment (spec §11 "do not reveal the strongest effects yet").
 */
export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !frameRef.current || !imgRef.current) return;
    gsap.to(imgRef.current, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.fromTo(
      frameRef.current,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: "none",
        scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-bg"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={GRAIN_STYLE} />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-6 pb-28 pt-32 md:grid-cols-12 md:gap-6 md:pb-16">
        <div className="md:col-span-6 md:pr-4 lg:col-span-5">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="font-mono text-eyebrow uppercase tracking-widest3 text-gold"
          >
            Design · Renovation · Build
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
            className="mt-6 font-display text-display leading-[0.98] text-ink"
          >
            Progetto
            <br />
            Build
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            className="mt-6 max-w-md font-display text-h3 leading-snug text-ink-soft"
          >
            Built with vision.
            <br />
            Finished with purpose.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.54, ease: EASE }}
            className="mt-6 max-w-sm text-base text-ink-soft"
          >
            Design, renovation and construction for refined spaces across
            South Florida.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.66, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <motion.a
              href="#journeys"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.015 }}
              className="rounded-sm bg-gold px-7 py-4 font-mono text-[11px] uppercase tracking-widest2 text-bg"
            >
              Explore Transformations
            </motion.a>
            <motion.a
              href="#contact"
              whileTap={{ scale: 0.97 }}
              className="rounded-sm border border-ink/20 px-7 py-4 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-200 hover:border-gold hover:text-gold-bright"
            >
              Start a Project
            </motion.a>
          </motion.div>
        </div>

        <div className="md:col-span-6 md:col-start-7 lg:col-span-7 lg:col-start-6">
          <motion.div
            ref={frameRef}
            initial={reduced ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-sm shadow-[0_50px_140px_-30px_rgba(0,0,0,0.85)] md:aspect-[3/4] md:max-w-none"
          >
            <img
              ref={imgRef}
              src={HERO_IMAGE}
              alt="A Progetto Build renovation — finished home exterior at twilight"
              className="absolute inset-0 h-[112%] w-full object-cover"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
  backgroundSize: "3px 3px",
};
