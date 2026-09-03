import { FLAGSHIP_PROJECTS } from "../data/projects";
import { FlagshipTransform } from "./FlagshipTransform";
import { SectionHeading } from "./SectionHeading";

export function TransformationsSection() {
  return (
    <section id="transformations" className="bg-ink">
      <div className="px-6 pb-14 pt-20 md:pt-28">
        <SectionHeading
          eyebrow="The Transformation"
          title="Scroll to watch it happen"
          description="Two full-scope projects, from demo day to final walkthrough. Keep scrolling — the photo changes with you."
          light
        />
      </div>
      {FLAGSHIP_PROJECTS.map((project, i) => (
        <FlagshipTransform key={project.slug} project={project} index={i} />
      ))}
    </section>
  );
}
