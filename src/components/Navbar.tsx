import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { asset } from "../lib/asset";

const LINKS = [
  { href: "#work", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line bg-bg/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" className="flex items-center" aria-label="Progetto Build home">
          <img
            src={asset("/images/logo/mark-icon.png")}
            alt=""
            className="h-8 w-auto"
            width={44}
            height={20}
          />
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <NavLink href={l.href}>{l.label}</NavLink>
            </li>
          ))}
        </ul>

        <motion.a
          href="#contact"
          whileTap={{ scale: 0.96 }}
          className="hidden rounded-sm border border-gold/60 px-5 py-2 font-mono text-[11px] uppercase tracking-widest2 text-gold-bright transition-colors duration-200 hover:bg-gold hover:text-bg md:inline-block"
        >
          Start a Project
        </motion.a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-ink md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6H21M3 12H21M3 18H21"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-line bg-bg px-6 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-xs uppercase tracking-widest text-ink-soft"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-sm border border-gold/60 px-5 py-3 text-center font-mono text-[11px] uppercase tracking-widest2 text-gold-bright"
            >
              Start a Project
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative font-mono text-[11px] uppercase tracking-widest2 text-ink-soft transition-colors duration-200 hover:text-ink"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
    </a>
  );
}
