import { MapPin } from "lucide-react";
import { experiences } from "@/lib/portfolio-data";

export function ExperienceCard() {
  return (
    <div className="flex flex-col justify-between font-mono">
      <ol className="flex flex-col">
        {experiences.map((experience, index) => (
          <li
            key={`${experience.company}-${experience.role}`}
            className="flex items-start gap-4"
          >
            {/* Dedicated 12px wide timeline track column */}
            <div className="relative flex flex-col items-center shrink-0 w-3 self-stretch">
              {/* Concentric Yellow Target Node (12px by 12px) */}
              <div
                aria-hidden="true"
                className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-[#facc15] bg-[#050505] z-10 mt-1"
              >
                <div className="h-1 w-1 rounded-full bg-[#facc15]" />
              </div>

              {/* Perfectly centered connector line from circle 1 center into circle 2 center */}
              {index < experiences.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-[8px] bottom-[-8px] left-1/2 -translate-x-1/2 w-px bg-[#333333]"
                />
              )}
            </div>

            {/* Experience Content */}
            <div className="flex flex-col items-start pb-6">
              <p className="text-[11px] font-medium tracking-wider text-[#facc15]">
                {experience.date}
              </p>

              <h3 className="mt-1 text-sm font-bold text-[#f8f8f2]">
                {experience.role}
              </h3>

              <p className="mt-0.5 text-xs text-[#a3a3a0]">
                {experience.company}
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#666666]">
                <MapPin size={12} strokeWidth={1.5} className="shrink-0 text-[#facc15]" aria-hidden="true" />
                <span>{experience.location}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-2 text-[11px] text-[#666666]">
        // yes, I have multiple active roles right now
      </p>
    </div>
  );
}
