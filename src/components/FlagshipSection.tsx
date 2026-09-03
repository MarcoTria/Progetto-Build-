import { FLAGSHIP_PROJECTS } from "../data/projects";
import { TransformationScene } from "./transformation/TransformationScene";
import { WebGLTransformScene } from "./transformation/WebGLTransformScene";
import { SectionHeading } from "./SectionHeading";

/**
 * The three flagship cinematic transformations (spec §16) — the site's
 * primary experience and its strongest "wow" moment. Each is full-bleed,
 * occupies its own viewport-height stage, and is driven entirely by
 * scroll position (see TransformationScene / WebGLTransformScene).
 */
export function FlagshipSection() {
  return (
    <section id="transformations" className="bg-bg">
      <div className="px-6 pb-16 pt-24 md:pt-32">
        <SectionHeading
          eyebrow="The Transformation"
          title="Scroll to watch it happen"
          description="Three full-scope projects, from demo day to final walkthrough. Your scroll position is the timeline — pause anywhere, reverse anytime."
        />
      </div>
      {FLAGSHIP_PROJECTS.map((project, i) =>
        project.strategy === "webgl-plane" ? (
          <WebGLTransformScene key={project.slug} project={project} index={i} />
        ) : (
          <TransformationScene key={project.slug} project={project} index={i} mode="pinned" />
        ),
      )}
    </section>
  );
}
