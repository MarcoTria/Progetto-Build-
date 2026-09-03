import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    copy: "Understand the property, vision and project requirements.",
  },
  {
    n: "02",
    title: "Design",
    copy: "Develop layouts, materials and project direction.",
  },
  {
    n: "03",
    title: "Build",
    copy: "Coordinate construction and execution.",
  },
  {
    n: "04",
    title: "Deliver",
    copy: "Complete the space with attention to detail.",
  },
];

/** Alternating editorial process layout (spec §20). */
export function ProcessSection() {
  return (
    <section id="process" className="border-t border-line bg-surface px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-xl">
          <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">Process</p>
          <h2 className="mt-4 font-display text-h1 uppercase leading-[1.05] text-ink">
            How we work
          </h2>
        </Reveal>

        <div className="mt-20 flex flex-col gap-16 md:gap-24">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.n}
              className={`flex items-start gap-8 md:gap-16 ${
                i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""
              }`}
            >
              <span className="font-display text-h1 leading-none text-ink-faint">{step.n}</span>
              <div className={i % 2 === 1 ? "md:flex md:flex-col md:items-end" : undefined}>
                <h3 className="font-display text-h3 text-ink">{step.title}</h3>
                <p className="mt-3 max-w-md text-base text-ink-soft">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
