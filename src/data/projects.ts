import generated from "./renovations.generated.json";

export type Pair = {
  label: string | null;
  before: string;
  after: string;
  beforeDim: [number, number];
  afterDim: [number, number];
  beforeLQIP: string;
  afterLQIP: string;
};

export type Strategy = "layered" | "webgl-plane" | "masked";

export type Project = {
  slug: string;
  title: string;
  room: string;
  description: string;
  pairs: Pair[];
  strategy: Strategy;
};

type Generated = Record<string, { title: string; pairs: Pair[] }>;

const g = generated as unknown as Generated;

/** Curated copy, written from what is visibly true in each photo pair —
 * no invented statistics, reviews, or claims. */
const META: Record<string, { room: string; description: string; strategy: Strategy }> = {
  "main-entryway": {
    room: "Exterior & Approach",
    description:
      "Aging stucco, tired shutters and a cracked driveway gave way to a warm, lantern-lit approach — new garage doors, uplit landscaping and a paved motor court that sets the tone before the front door opens.",
    strategy: "layered",
  },
  kitchen: {
    room: "Kitchen",
    description:
      "Stripped to the studs and framed out from a hand-marked plan, the kitchen was rebuilt around a five-seat island, integrated ovens and full-height custom cabinetry finished in warm white oak.",
    strategy: "masked",
  },
  "master-bedroom": {
    room: "Primary Suite",
    description:
      "A bare concrete shell with peeling drywall became a serene primary bedroom — engineered oak flooring, a upholstered bed wall and a reading nook framed by the room's original windows.",
    strategy: "masked",
  },
  "master-bathroom": {
    room: "Primary Bathroom",
    description:
      "Demoed to the studs around a failing whirlpool tub, the primary bath was rebuilt as a spa-style retreat: a freestanding soaking tub, glass-enclosed rain shower and a furniture-style double vanity.",
    strategy: "masked",
  },
  "upstairs-bathroom": {
    room: "Upstairs Bathroom",
    description:
      "Exposed framing and subfloor were closed in with a tiled tub-shower, a floating wood vanity and warm cove lighting — a full plumbing and finish rebuild in a tight footprint.",
    strategy: "masked",
  },
  "jack-and-jill-bathroom": {
    room: "Jack & Jill Bathroom",
    description:
      "Mid-demolition and open to the rafters, this shared bathroom was reconfigured into a dedicated vanity room and a separate glass shower-and-water-closet suite, finished in brushed brass and warm plaster tones.",
    strategy: "masked",
  },
  "first-floor-bedroom": {
    room: "Ground-Floor Bedroom",
    description:
      "An unfinished sunroom-style shell with a poured concrete floor was converted into a bright bedroom suite, with wall-to-wall glazing kept and framed by new drapery, oak flooring and a woven area rug.",
    strategy: "masked",
  },
  "upstairs-bedroom-1": {
    room: "Upstairs Bedroom",
    description:
      "Bare drywall and louvered jalousie windows were reframed into a bright bedroom with a built-in window bench, custom millwork and a curated gallery wall — the original windows kept as the room's centerpiece.",
    strategy: "masked",
  },
  "upstairs-lounge": {
    room: "Upstairs Lounge",
    description:
      "An unfinished loft — plywood subfloor and construction debris — was finished into a vaulted upstairs lounge with a built-in media wall, wide-plank flooring and a glass stair rail overlooking the stairwell.",
    strategy: "masked",
  },
  "backyard-pool": {
    room: "Backyard & Pool",
    description:
      "A neglected green pool and weathered deck were rebuilt into a resort-style backyard — resurfaced pool, paver decking, an outdoor kitchen and landscape lighting for evening use.",
    strategy: "webgl-plane",
  },
  "game-room": {
    room: "Game Room",
    description:
      "An empty poured-concrete room with exposed conduit was finished into a garden-view game room, centered on a pool table beneath a linear pendant, with a gallery wall and built-in bench seating.",
    strategy: "masked",
  },
};

const ORDER = [
  "main-entryway",
  "kitchen",
  "backyard-pool",
  "master-bedroom",
  "master-bathroom",
  "upstairs-bathroom",
  "jack-and-jill-bathroom",
  "first-floor-bedroom",
  "upstairs-bedroom-1",
  "upstairs-lounge",
  "game-room",
] as const;

export const PROJECTS: Project[] = ORDER.map((slug) => ({
  slug,
  title: g[slug].title,
  room: META[slug].room,
  description: META[slug].description,
  strategy: META[slug].strategy,
  pairs: g[slug].pairs,
}));

/**
 * The three flagship cinematic scroll transformations. Each uses the
 * strongest reliable technique available for its own photography — no
 * per-object segmentation exists in the source material (no isolated,
 * alpha-cut furniture), so per section 07/33 of the spec, none of these
 * fabricate object layers. Instead:
 *
 * - "layered": two REAL photographs of the same renovation (different
 *   camera angles) are treated as two genuine depth layers moving at
 *   different scroll-scrubbed rates/timing — real 2.5D from real photos.
 * - "webgl-plane": a WebGL (Three.js/R3F) shader-driven plane transition
 *   between the two real photo textures — used once, where it earns its
 *   keep on the most dramatic lighting change (day → twilight).
 * - "masked": the whole-frame masked/perspective 3D-transform reveal used
 *   everywhere else — real photography, simpler motion, per the spec's
 *   "real photography + simpler motion beats fake objects + complex
 *   motion" rule.
 */
export const FLAGSHIP_SLUGS = ["main-entryway", "kitchen", "backyard-pool"] as const;

export const FLAGSHIP_PROJECTS = PROJECTS.filter((p) =>
  (FLAGSHIP_SLUGS as readonly string[]).includes(p.slug),
);

export const GALLERY_PROJECTS = PROJECTS.filter(
  (p) => !(FLAGSHIP_SLUGS as readonly string[]).includes(p.slug),
);

export type GalleryItem = {
  key: string;
  slug: string;
  room: string;
  description: string;
  pair: Pair;
};

/** Flattens multi-pair gallery projects (Jack & Jill has two camera
 * angles) into individual editorial gallery tiles. */
export const GALLERY_ITEMS: GalleryItem[] = GALLERY_PROJECTS.flatMap((p) =>
  p.pairs.map((pair, i) => ({
    key: `${p.slug}-${i}`,
    slug: p.slug,
    room: p.pairs.length > 1 && pair.label ? `${p.room} — ${pair.label}` : p.room,
    description: p.description,
    pair,
  })),
);

/** Real business data — not placeholders. */
export const BUSINESS = {
  name: "Progetto Build",
  tagline: "Built with vision. Finished with purpose.",
  phone: "215-501-2583",
  phoneHref: "tel:+12155012583",
  serviceArea: ["Pompano Beach", "Fort Lauderdale", "Lauderdale-by-the-Sea", "Broward County"],
  region: "South Florida",
};
