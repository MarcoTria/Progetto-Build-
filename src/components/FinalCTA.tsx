import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { BUSINESS } from "../data/projects";

/** Final CTA (spec §26). */
export function FinalCTA() {
  return (
    <section className="bg-bg px-6 py-24 text-center md:py-32">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="font-display text-h1 uppercase leading-[1.05] text-ink">
          Ready to
          <br />
          <span className="text-beige">reimagine your space?</span>
        </h2>

        <motion.a
          href="#contact"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="mt-10 inline-block rounded-sm bg-gold px-9 py-4 font-mono text-[11px] uppercase tracking-widest2 text-bg"
        >
          Start a Project
        </motion.a>

        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-ink-faint">
          {BUSINESS.region}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {BUSINESS.serviceArea.slice(0, 3).join(" · ")}
        </p>
      </Reveal>
    </section>
  );
}
