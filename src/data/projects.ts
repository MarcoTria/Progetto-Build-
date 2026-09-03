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

export type Project = {
  slug: string;
  title: string;
  room: string;
  description: string;
  pairs: Pair[];
};

type Generated = Record<
  string,
  { title: string; pairs: Pair[] }
>;

const g = generated as unknown as Generated;

/** Curated copy, written from what is visibly true in each photo pair —
 * no invented statistics, reviews, or claims. Order controls the
 * storytelling sequence down the page. */
const META: Record<string, { room: string; description: string }> = {
  "main-entryway": {
    room: "Exterior & Approach",
    description:
      "Aging stucco, tired shutters and a cracked driveway gave way to a warm, lantern-lit approach — new garage doors, uplit landscaping and a paved motor court that sets the tone before the front door opens.",
  },
  kitchen: {
    room: "Kitchen",
    description:
      "Stripped to the studs and framed out from a hand-marked plan, the kitchen was rebuilt around a five-seat island, integrated ovens and full-height custom cabinetry finished in warm white oak.",
  },
  "master-bedroom": {
    room: "Primary Suite",
    description:
      "A bare concrete shell with peeling drywall became a serene primary bedroom — engineered oak flooring, a upholstered bed wall and a reading nook framed by the room's original windows.",
  },
  "master-bathroom": {
    room: "Primary Bathroom",
    description:
      "Demoed to the studs around a failing whirlpool tub, the primary bath was rebuilt as a spa-style retreat: a freestanding soaking tub, glass-enclosed rain shower and a furniture-style double vanity.",
  },
  "upstairs-bathroom": {
    room: "Upstairs Bathroom",
    description:
      "Exposed framing and subfloor were closed in with a tiled tub-shower, a floating wood vanity and warm cove lighting — a full plumbing and finish rebuild in a tight footprint.",
  },
  "jack-and-jill-bathroom": {
    room: "Jack & Jill Bathroom",
    description:
      "Mid-demolition and open to the rafters, this shared bathroom was reconfigured into a dedicated vanity room and a separate glass shower-and-water-closet suite, finished in brushed brass and warm plaster tones.",
  },
  "first-floor-bedroom": {
    room: "Ground-Floor Bedroom",
    description:
      "An unfinished sunroom-style shell with a poured concrete floor was converted into a bright bedroom suite, with wall-to-wall glazing kept and framed by new drapery, oak flooring and a woven area rug.",
  },
  "upstairs-bedroom-1": {
    room: "Upstairs Bedroom",
    description:
      "Bare drywall and louvered jalousie windows were reframed into a bright bedroom with a built-in window bench, custom millwork and a curated gallery wall — the original windows kept as the room's centerpiece.",
  },
  "upstairs-lounge": {
    room: "Upstairs Lounge",
    description:
      "An unfinished loft — plywood subfloor and construction debris — was finished into a vaulted upstairs lounge with a built-in media wall, wide-plank flooring and a glass stair rail overlooking the stairwell.",
  },
  "backyard-pool": {
    room: "Backyard & Pool",
    description:
      "A neglected green pool and weathered deck were rebuilt into a resort-style backyard — resurfaced pool, paver decking, an outdoor kitchen and landscape lighting for evening use.",
  },
  "game-room": {
    room: "Game Room",
    description:
      "An empty poured-concrete room with exposed conduit was finished into a garden-view game room, centered on a pool table beneath a linear pendant, with a gallery wall and built-in bench seating.",
  },
};

const ORDER = [
  "main-entryway",
  "kitchen",
  "master-bedroom",
  "master-bathroom",
  "upstairs-bathroom",
  "jack-and-jill-bathroom",
  "first-floor-bedroom",
  "upstairs-bedroom-1",
  "upstairs-lounge",
  "backyard-pool",
  "game-room",
] as const;

export const PROJECTS: Project[] = ORDER.map((slug) => ({
  slug,
  title: g[slug].title,
  room: META[slug].room,
  description: META[slug].description,
  pairs: g[slug].pairs,
}));

/** The two flagship, full-bleed pinned-scroll transformations shown early
 * on the page (kept to 1-2 per the skill's scroll-storytelling guidance —
 * pinning more than that fights native scroll feel). Chosen for full-bleed
 * photography with no baked-in annotations, since this slot overlays its
 * own headline text on top of the photograph. */
export const FLAGSHIP_SLUGS = ["main-entryway", "backyard-pool"] as const;

export const FLAGSHIP_PROJECTS = PROJECTS.filter((p) =>
  (FLAGSHIP_SLUGS as readonly string[]).includes(p.slug),
);

/** Source composites whose photography has no baked-in "BEFORE"/"AFTER"
 * pill (the "framed" caption template used its own text banner instead,
 * cropped away during processing) — safe to overlay our own label here
 * without duplicating/clashing with the source image. */
export const NO_BAKED_LABEL_SLUGS = new Set(["kitchen", "master-bathroom", "upstairs-lounge"]);

export const GALLERY_PROJECTS = PROJECTS.filter(
  (p) => !(FLAGSHIP_SLUGS as readonly string[]).includes(p.slug),
);
