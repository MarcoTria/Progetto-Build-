import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  light,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p
        className={`font-body text-xs uppercase tracking-widest2 ${
          light ? "text-gold-bright" : "text-gold-deep"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl leading-tight md:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 font-body text-base md:text-lg ${
            light ? "text-white/70" : "text-ink-soft"
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
