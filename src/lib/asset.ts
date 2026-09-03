/**
 * Resolves a root-absolute public asset path (e.g. "/images/logo/x.png")
 * against Vite's configured `base`, so it still resolves correctly when
 * the site is deployed under a sub-path (GitHub Pages project site:
 * https://<owner>.github.io/Progetto-Build-/) instead of a domain root.
 *
 * import.meta.env.BASE_URL is "/" in dev and "/Progetto-Build-/" in the
 * production build (from vite.config.ts's `base`), always with a
 * trailing slash.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
