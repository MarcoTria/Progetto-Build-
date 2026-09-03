import { Reveal } from "./Reveal";

const SERVICES = [
  {
    n: "01",
    title: "Design",
    copy: "Space planning, layouts, materials, finishes and lighting — the full scope on paper before a single wall comes down.",
  },
  {
    n: "02",
    title: "Renovation",
    copy: "Kitchens, bathrooms and complete interior transformations, sequenced and scheduled from demo to finish.",
  },
  {
    n: "03",
    title: "Build",
    copy: "Construction and project management from start to completion, with one team accountable throughout.",
  },
];

/** Editorial services layout (spec §19) — no icon cards. */
export function ServicesSection() {
  return (
    <section id="services" className="border-t border-line bg-bg px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">Services</p>
          <h2 className="mt-4 font-display text-h1 uppercase leading-[1.05] text-ink">
            From first idea
            <br />
            to final detail.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 divide-y divide-line border-t border-line md:grid-cols-3 md:divide-x md:divide-y-0 md:border-t-0">
          {SERVICES.map((s) => (
            <Reveal key={s.n} className="py-10 md:px-10 md:py-0">
              <span className="font-mono text-eyebrow text-ink-faint">{s.n}</span>
              <h3 className="mt-5 font-display text-h3 text-ink">{s.title}</h3>
              <p className="mt-4 max-w-sm text-base text-ink-soft">{s.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
