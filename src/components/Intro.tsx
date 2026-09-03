import { Reveal } from "./Reveal";

/** Editorial philosophy statement (spec §15) — asymmetric layout, large
 * whitespace, no photography, pure typography. */
export function Intro() {
  return (
    <section className="bg-bg px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
            Progetto Build
          </p>
        </Reveal>
        <div className="md:col-span-8">
          <Reveal>
            <h2 className="max-w-3xl font-display text-h1 uppercase leading-[1.03] text-ink">
              From existing
              <br />
              to extraordinary.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-base text-ink-soft md:text-lg">
              We bring design, renovation and construction together through
              one streamlined process — a single team accountable from the
              first walkthrough to the final coat of paint.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
