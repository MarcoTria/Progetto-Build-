import { Reveal } from "./Reveal";

/**
 * Large-type breathing room between cinematic journeys (spec §15) —
 * pure typography, no photography, deliberately spare.
 */
export function EditorialInterlude({
  eyebrow,
  lines,
}: {
  eyebrow: string;
  lines: [string, string];
}) {
  return (
    <section className="flex min-h-[70svh] items-center justify-center bg-bg px-6 py-24 text-center">
      <Reveal>
        <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">{eyebrow}</p>
        <h2 className="mt-6 font-display text-h1 uppercase leading-[1.05] text-ink">
          {lines[0]}
          <br />
          <span className="text-gold-bright">{lines[1]}</span>
        </h2>
      </Reveal>
    </section>
  );
}
