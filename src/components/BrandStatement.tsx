import { Reveal } from "./Reveal";

/** Large brand statement (spec §22). */
export function BrandStatement() {
  return (
    <section id="about" className="bg-bg px-6 py-28 text-center md:py-40">
      <Reveal className="mx-auto max-w-4xl">
        <h2 className="font-display text-h1 uppercase leading-[1.05] text-ink">
          We build spaces
          <br />
          <span className="text-beige">with purpose.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base text-ink-soft md:text-lg">
          Progetto Build brings design, renovation and construction together
          through one streamlined process.
        </p>
      </Reveal>
    </section>
  );
}
