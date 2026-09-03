export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row">
        <div>
          <img
            src="/images/logo/mark-icon.png"
            alt="Progetto Build"
            className="h-10 w-auto"
            width={140}
            height={65}
          />
          <p className="mt-4 max-w-xs font-body text-sm text-white/50">
            Design | Renovation | Build — serving South Florida.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <a href="#transformations" className="font-body text-white/70 hover:text-gold-bright">
            Transformations
          </a>
          <a href="#work" className="font-body text-white/70 hover:text-gold-bright">
            Our Work
          </a>
          <a href="#process" className="font-body text-white/70 hover:text-gold-bright">
            Process
          </a>
          <a href="#contact" className="font-body text-white/70 hover:text-gold-bright">
            Contact
          </a>
        </nav>

        <div className="font-body text-sm text-white/50">
          <a href="mailto:hello@progettobuild.com" className="hover:text-gold-bright">
            hello@progettobuild.com
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-7xl font-body text-xs text-white/30">
        © {year} Progetto Build. All photography shown is from Progetto Build project sites.
      </p>
    </footer>
  );
}
