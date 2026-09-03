import { useState } from "react";
import { NO_BAKED_LABEL_SLUGS, type Project } from "../data/projects";
import { SplitCompare } from "./SplitCompare";
import { Reveal } from "./Reveal";

export function ProjectCard({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const pair = project.pairs[active];
  const multi = project.pairs.length > 1;

  return (
    <Reveal as="div" className="group">
      <SplitCompare
        pair={pair}
        roomLabel={project.room}
        showBadge={NO_BAKED_LABEL_SLUGS.has(project.slug)}
      />

      {multi && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label={`${project.room} views`}>
          {project.pairs.map((p, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`min-h-[36px] rounded-sm border px-3 py-1.5 font-body text-xs uppercase tracking-wide transition-colors duration-200 ${
                active === i
                  ? "border-gold bg-gold/10 text-gold-deep"
                  : "border-border text-ink-soft hover:border-gold/50"
              }`}
            >
              {p.label ?? `View ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <h3 className="mt-4 font-display text-xl text-ink md:text-2xl">{project.room}</h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
        {project.description}
      </p>
    </Reveal>
  );
}
