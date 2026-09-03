import { BUSINESS } from "../data/projects";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-bg px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row">
        <div>
          <img
            src="/images/logo/mark-icon.png"
            alt="Progetto Build"
            className="h-9 w-auto"
            width={126}
            height={58}
          />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-ink-faint">
            Design · Renovation · Build
          </p>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            {BUSINESS.region} — {BUSINESS.serviceArea.join(" · ")}
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <a href="#work" className="font-mono text-[11px] uppercase tracking-widest text-ink-soft hover:text-gold-bright">
            Projects
          </a>
          <a href="#services" className="font-mono text-[11px] uppercase tracking-widest text-ink-soft hover:text-gold-bright">
            Services
          </a>
          <a href="#process" className="font-mono text-[11px] uppercase tracking-widest text-ink-soft hover:text-gold-bright">
            Process
          </a>
          <a href="#contact" className="font-mono text-[11px] uppercase tracking-widest text-ink-soft hover:text-gold-bright">
            Contact
          </a>
        </nav>

        <div className="font-mono text-sm text-ink-soft">
          <a href={BUSINESS.phoneHref} className="block hover:text-gold-bright">
            {BUSINESS.phone}
          </a>
          <a href="mailto:hello@progettobuild.com" className="mt-2 block hover:text-gold-bright">
            hello@progettobuild.com
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-7xl font-mono text-[11px] text-ink-faint">
        © {year} {BUSINESS.name}. All photography shown is from Progetto Build project sites.
      </p>
    </footer>
  );
}
