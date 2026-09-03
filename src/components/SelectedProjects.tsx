import { GALLERY_ITEMS } from "../data/projects";
import { GalleryTile } from "./GalleryTile";
import { SectionHeading } from "./SectionHeading";

/**
 * Editorial project gallery (spec §21) — a photography-first masonry
 * built from each real photo's own aspect ratio (genuine asymmetry, not
 * arbitrary spans), generous whitespace, minimal text. Replaces the old
 * card grid / drag-slider grid entirely.
 */
export function SelectedProjects() {
  return (
    <section id="work" className="bg-bg px-6 py-20 md:py-28">
      <SectionHeading
        eyebrow="Selected Renovations"
        title="One house, room by room"
        description="Every photograph here is the actual jobsite and finished photography from this project — nothing staged, nothing stock."
      />

      <div className="mx-auto mt-16 max-w-7xl columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-10">
        {GALLERY_ITEMS.map((item) => (
          <GalleryTile key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
