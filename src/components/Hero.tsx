import { lazy, Suspense } from "react";
import { Reveal } from "./Reveal";

const HeroScene = lazy(() => import("./HeroScene").then((m) => ({ default: m.HeroScene })));

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ink"
    >
      <Suspense fallback={null}>
        <HeroScene className="pointer-events-none absolute inset-0 opacity-90" />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/60 to-ink" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24">
        <Reveal>
          <img
            src="/images/logo/mark-icon.png"
            alt="Progetto Build"
            className="h-16 w-auto md:h-20"
            width={180}
            height={83}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-8 max-w-3xl font-display text-4xl leading-[1.1] text-white sm:text-5xl md:text-7xl">
            Built with vision.
            <br />
            <span className="text-gold-bright">Finished with purpose.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl font-body text-base text-white/75 md:text-lg">
            Progetto Build takes South Florida homes from bare studs to finished
            spaces — full-scope design, renovation and build, documented from the
            first demo photo to the final walkthrough.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#transformations"
              className="rounded-sm bg-gold-bright px-7 py-3.5 font-body text-xs uppercase tracking-widest2 text-ink transition-transform duration-200 hover:scale-[1.03]"
            >
              See The Transformations
            </a>
            <a
              href="#contact"
              className="rounded-sm border border-white/30 px-7 py-3.5 font-body text-xs uppercase tracking-widest2 text-white transition-colors duration-200 hover:border-gold-bright hover:text-gold-bright"
            >
              Start Your Project
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-16 font-body text-xs uppercase tracking-widest2 text-white/40">
            Design &nbsp;|&nbsp; Renovation &nbsp;|&nbsp; Build
          </p>
        </Reveal>
      </div>
    </section>
  );
}
