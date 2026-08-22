import { ExternalLink } from "lucide-react";
import { siGithub } from "simple-icons";
import { project } from "@/lib/portfolio-data";

export function ProjectCard() {
  return (
    <article className="flex flex-col font-mono">
      {/* Title & Live / GitHub Links */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#f8f8f2]">{project.name}</h3>

        <div className="flex items-center gap-3 text-xs">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#facc15] transition-colors duration-200 hover:text-[#fde68a]"
            aria-label={`View live ${project.name}`}
          >
            <span>[ live</span>
            <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
            <span>]</span>
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#a3a3a0] transition-colors duration-200 hover:text-[#facc15]"
            aria-label={`View ${project.name} source code on GitHub`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 fill-current">
              <path d={siGithub.path} />
            </svg>
            <span>github</span>
            <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <span key={technology} className="tag">
            {technology}
          </span>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2 text-xs leading-relaxed text-[#a3a3a0]">
        {project.achievements.map((achievement) => (
          <li key={achievement} className="flex items-start gap-2">
            <span aria-hidden="true" className="shrink-0 font-bold text-[#facc15]">&gt;</span>
            <span>{achievement}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
