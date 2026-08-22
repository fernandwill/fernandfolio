import { ExperienceCard } from "@/components/experience-card";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Terminal } from "@/components/terminal";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000] p-3 sm:p-6 lg:p-8 flex items-center justify-center font-mono text-[#f8f8f2]">
      <div className="w-full max-w-[1240px] rounded-xl border border-[#facc15] bg-[#050505] p-5 sm:p-8 shadow-[0_0_40px_rgba(250,204,21,0.06)] flex flex-col gap-8">
        <Navbar />

        {/* Top Grid: Hero Left + Terminal Right */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.35fr]">
          <Hero />
          <Terminal />
        </div>

        {/* Bottom Grid: Experience Log Left + Selected Work Right */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <section
            id="experience"
            className="scroll-mt-24 rounded-lg border border-[#facc15] bg-[#050505] p-5 sm:p-6 flex flex-col h-full"
            aria-labelledby="experience-heading"
          >
            <SectionHeader
              id="experience-heading"
              command="> experience.log"
              action={<span aria-hidden="true" className="text-xs font-bold text-[#facc15]">&gt;&gt;</span>}
            />
            <div className="flex-1 flex flex-col justify-start">
              <ExperienceCard />
            </div>
          </section>

          <section
            id="projects"
            className="scroll-mt-24 rounded-lg border border-[#facc15] bg-[#050505] p-5 sm:p-6 flex flex-col h-full"
            aria-labelledby="projects-heading"
          >
            <SectionHeader id="projects-heading" command="> selected.work" />
            <div className="flex-1 flex flex-col justify-start">
              <ProjectCard />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
