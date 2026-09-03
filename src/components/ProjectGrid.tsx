import { GALLERY_PROJECTS } from "../data/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function ProjectGrid() {
  return (
    <section id="work" className="bg-paper px-6 py-20 md:py-28">
      <SectionHeading
        eyebrow="Every Room, Reinvented"
        title="One house, room by room"
        description="Drag any photo to compare — every image below is the actual jobsite and finished photography from this project, nothing staged."
      />

      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
