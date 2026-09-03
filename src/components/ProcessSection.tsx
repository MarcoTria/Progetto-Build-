import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    title: "Design",
    copy: "We walk the space, document every condition and put the full scope on paper — layout, materials and finishes — before a single wall comes down.",
    icon: (
      <path
        d="M4 20L14 4l6 6-10 10H4v-6z M13 6l5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Renovation",
    copy: "Demo, framing, rough-ins and structural work happen on a scheduled sequence, with the same crew accountable from the first exposed stud to drywall.",
    icon: (
      <path
        d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Build",
    copy: "Cabinetry, fixtures and finishes come together into the final space — inspected, punch-listed and handed back ready to live in.",
    icon: (
      <path
        d="M4 4h16v4H4zM6 8v12h4V8M14 8v12h4V8M10 14h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-card px-6 py-20 md:py-28">
      <SectionHeading
        eyebrow="How We Work"
        title="Design. Renovation. Build."
        description="One team, one schedule, one point of contact from the first sketch to the final walkthrough."
      />

      <Reveal
        as="div"
        stagger
        className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3"
      >
        {STEPS.map((step, i) => (
          <div key={step.title} className="relative border-t border-border pt-8">
            <span className="font-display text-sm text-gold-deep">
              0{i + 1}
            </span>
            <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {step.icon}
              </svg>
            </div>
            <h3 className="mt-5 font-display text-xl text-ink md:text-2xl">{step.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">{step.copy}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
