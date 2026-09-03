import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsap } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";
import { PROJECTS } from "../data/projects";

ensureGsap();

// The main entryway's finished photo — the single strongest, most
// cinematic frame in the set (twilight uplighting, symmetry) — used as
// the full-bleed hero image. Real photography only, no stock.
const heroPair = PROJECTS.find((p) => p.slug === "main-entryway")!.pairs[0];

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !imgRef.current) return;
    // Hero motion stays subtle and scroll-linked only for a gentle
    // parallax drift — the transformations, not the hero, are the WOW
    // moment (spec §14).
    gsap.to(imgRef.current, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: imgRef.current, start: "top top", end: "bottom top", scrub: true },
    });
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-bg"
    >
      <motion.img
        ref={imgRef}
        src={heroPair.after}
        alt="A Progetto Build renovation — finished home exterior at twilight"
        className="absolute inset-0 h-[115%] w-full object-cover"
        style={{ backgroundImage: `url(${heroPair.afterLQIP})`, backgroundSize: "cover" }}
        loading="eager"
        initial={reduced ? false : { scale: 1.08, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-32 pt-32 md:pb-28">
        {/* Extra mobile bottom clearance above so the CTA row never
            crowds the fixed consultation-assistant button (spec §25/29). */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-eyebrow uppercase tracking-widest3 text-gold-bright"
        >
          Progetto Build — Design · Renovation · Build
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-4xl font-display text-display uppercase text-ink"
        >
          Built with vision.
          <br />
          <span className="text-beige">Finished with purpose.</span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-lg text-base text-ink-soft md:text-lg"
        >
          Design, renovation and construction for refined spaces across South
          Florida.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <motion.a
            href="#transformations"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-sm bg-gold px-7 py-4 font-mono text-[11px] uppercase tracking-widest2 text-bg"
          >
            Explore Transformations
          </motion.a>
          <motion.a
            href="#contact"
            whileTap={{ scale: 0.97 }}
            className="rounded-sm border border-ink/25 px-7 py-4 font-mono text-[11px] uppercase tracking-widest2 text-ink transition-colors duration-200 hover:border-gold hover:text-gold-bright"
          >
            Start a Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
