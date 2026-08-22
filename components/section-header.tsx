import type { ReactNode } from "react";

export function SectionHeader({
  id,
  command,
  action,
}: Readonly<{ id: string; command: string; action?: ReactNode }>) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 font-mono">
      <h2 id={id} className="flex items-center text-xs font-semibold tracking-wider text-[#facc15]">
        <span>{command}</span>
        <span className="terminal-cursor" aria-hidden="true" />
      </h2>
      <div className="shrink-0">
        {action ?? (
          <span aria-hidden="true" className="text-xs font-bold text-[#facc15]">&gt;&gt;</span>
        )}
      </div>
    </div>
  );
}
