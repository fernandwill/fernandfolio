"use client";

import { useEffect, useRef } from "react";
import { steamFrame } from "@/lib/ascii-steam";

export function AsciiSteam({ compact = false }: { compact?: boolean }) {
  const cellsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cells = cellsRef.current;
    if (!cells || typeof IntersectionObserver === "undefined") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame: number | null = null;
    let elapsed = 0;
    let previous = 0;
    let painted = -1;
    const draw = (now: number) => {
      elapsed += Math.min(now - previous, 100) / 1000;
      previous = now;
      const tick = Math.floor(now / (1000 / 60));
      if (tick !== painted) {
        cells.textContent = steamFrame(elapsed, compact);
        painted = tick;
      }
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (motion.matches) cells.textContent = steamFrame(0, compact);
      if (visible && !motion.matches && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(cells);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [compact]);

  return (
    <span className="desk-steam-block" aria-hidden="true">
      <span ref={cellsRef} className="desk-steam-cells">{steamFrame(0, compact)}</span>
    </span>
  );
}
