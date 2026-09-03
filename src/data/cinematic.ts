import depthBandsRaw from "./depth-bands.generated.json";
import { asset } from "../lib/asset";
import { PROJECTS } from "./projects";

export type Band = {
  src: string;
  yStart: number;
  yEnd: number;
  heightFrac: number;
  centerFrac: number;
  dim: [number, number];
};

export type SidePhoto = {
  sourceDim: [number, number];
  bands: { bg: Band; mid: Band; fg: Band };
};

export type CinematicPair = {
  before: SidePhoto;
  after: SidePhoto;
};

type Raw = Record<string, { before: SidePhoto; after: SidePhoto }>;
const raw = depthBandsRaw as unknown as Raw;

function resolvePair(pair: { before: SidePhoto; after: SidePhoto }): CinematicPair {
  const resolveSide = (side: SidePhoto): SidePhoto => ({
    ...side,
    bands: {
      bg: { ...side.bands.bg, src: asset(side.bands.bg.src) },
      mid: { ...side.bands.mid, src: asset(side.bands.mid.src) },
      fg: { ...side.bands.fg, src: asset(side.bands.fg.src) },
    },
  });
  return { before: resolveSide(pair.before), after: resolveSide(pair.after) };
}

/**
 * The three flagship "camera journey" projects (spec §26). Chosen — not
 * simply reused from the prior implementation — specifically because
 * their BEFORE/AFTER photos share the same camera position (essential
 * for believable multiplane parallax) and each has clear, real
 * foreground/mid/background structure: a close deck/planter/driveway
 * foreground, a mid-ground room or facade, and a sky/roofline/window
 * background.
 */
export const CINEMATIC_SLUGS = ["main-entryway", "backyard-pool", "game-room"] as const;

export type CinematicProject = {
  slug: string;
  room: string;
  description: string;
  cinematic: CinematicPair;
  /** The full (unbanded) photos — used for the reduced-motion static
   * fallback and any preview/poster frame. */
  fullBefore: string;
  fullAfter: string;
};

export const CINEMATIC_PROJECTS: CinematicProject[] = CINEMATIC_SLUGS.map((slug) => {
  const meta = PROJECTS.find((p) => p.slug === slug)!;
  return {
    slug,
    room: meta.room,
    description: meta.description,
    cinematic: resolvePair(raw[slug]),
    fullBefore: meta.pairs[0].before,
    fullAfter: meta.pairs[0].after,
  };
});
