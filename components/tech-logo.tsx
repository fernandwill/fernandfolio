import type { SimpleIcon } from "simple-icons";

export function TechLogo({ label, icon }: Readonly<{ label: string; icon: SimpleIcon }>) {
  return (
    <div className="flex flex-col items-center justify-start gap-1 text-center">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current text-[#facc15]">
        <path d={icon.path} />
      </svg>
      <span className="font-mono text-[9.5px] leading-tight text-[#a3a3a0] text-center">{label}</span>
    </div>
  );
}
