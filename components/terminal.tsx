import { FileText, Folder } from "lucide-react";
import { stack } from "@/lib/portfolio-data";
import { TechLogo } from "@/components/tech-logo";

function Command({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="font-mono text-sm">
      <span className="text-[#facc15] font-semibold">$</span>{" "}
      <span className="text-[#f8f8f2]">{children}</span>
    </p>
  );
}

function Output({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="pl-4 font-mono text-sm leading-relaxed text-[#a3a3a0]">{children}</div>;
}

export function Terminal() {
  return (
    <div
      id="terminal"
      className="scroll-mt-24 overflow-hidden rounded-lg border border-[#facc15] bg-[#050505] font-mono shadow-[0_0_24px_rgba(250,204,21,0.05)]"
      aria-label="Engineer terminal profile"
    >
      {/* Header with user@fernandwill:~ and hazard stripes */}
      <header className="relative flex items-center justify-between border-b border-[#facc15]/30 bg-[#080808] px-4 py-2.5">
        <span className="text-xs text-[#facc15] font-semibold">
          user@fernandwill:~
        </span>

        {/* Hazard warning stripes */}
        <div
          aria-hidden="true"
          className="h-4 w-20 hazard-stripes opacity-80"
        />
      </header>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <Command>whoami</Command>
          <Output><span className="text-[#f8f8f2]">fernandwill</span></Output>
        </div>

        <div>
          <Command>cat role.txt</Command>
          <Output>
            <p className="text-[#f8f8f2]">Founding Engineer</p>
            <p className="text-[#a3a3a0]">Solving business problems by engineering secure backend systems, scalable software, and AI pipelines.</p>
          </Output>
        </div>

        <div>
          <Command>ls</Command>
          <Output>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#f8f8f2]">
              <span className="inline-flex items-center gap-1">
                <FileText size={13} className="text-[#facc15]" />
                <span>about.md</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText size={13} className="text-[#facc15]" />
                <span>experience.log</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Folder size={13} className="text-[#facc15]" />
                <span>projects/</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText size={13} className="text-[#facc15]" />
                <span>stack.json</span>
              </span>
            </div>
          </Output>
        </div>

        <div>
          <Command>stack --current</Command>
          <Output>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-x-3 gap-y-3.5 pt-1.5">
              {stack.map((item) => (
                <TechLogo key={item.label} {...item} />
              ))}
            </div>
          </Output>
        </div>

        <div>
          <Command>status</Command>
          <Output>
            <span className="text-[#facc15] font-medium">Available for full-time roles</span>
          </Output>
        </div>

        <div>
          <Command>location</Command>
          <Output>Medan, Indonesia (GMT+7)</Output>
        </div>

        <p className="font-mono text-sm text-[#facc15]" aria-hidden="true">
          $<span className="terminal-cursor" />
        </p>
      </div>
    </div>
  );
}
