import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const wrap = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl text-left";
  return (
    <Reveal className={wrap}>
      <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">{eyebrow}</p>
      <h2 className="mt-4 font-display text-h2 text-ink">{title}</h2>
      {description && <p className="mt-5 text-base text-ink-soft">{description}</p>}
    </Reveal>
  );
}
