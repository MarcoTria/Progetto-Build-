import { useEffect, useState } from "react";

const LINKS = [
  { href: "#transformations", label: "Transformations" },
  { href: "#work", label: "Our Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-ink/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3" aria-label="Progetto Build home">
          <img
            src="/images/logo/mark-icon.png"
            alt=""
            className="h-9 w-auto"
            width={44}
            height={20}
          />
          <span className="font-display text-sm tracking-widest2 text-white">
            PROGETTO <span className="text-gold-bright">BUILD</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-body text-sm uppercase tracking-wide text-white/80 transition-colors duration-200 hover:text-gold-bright"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-sm border border-gold-bright/70 px-5 py-2 font-body text-xs uppercase tracking-widest2 text-gold-bright transition-colors duration-200 hover:bg-gold-bright hover:text-ink md:inline-block"
        >
          Start Your Project
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-white md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6H21M3 12H21M3 18H21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/10 bg-ink px-6 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-body text-sm uppercase tracking-wide text-white/85"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-sm border border-gold-bright/70 px-5 py-3 text-center font-body text-xs uppercase tracking-widest2 text-gold-bright"
            >
              Start Your Project
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
