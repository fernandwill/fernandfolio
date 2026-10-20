"use client";

import { useEffect, useRef } from "react";
import { kneelingPerson } from "@/lib/ascii-confetti";

export function AsciiConfetti() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      scene.dataset.visible = String(entry.isIntersecting);
    });
    scene.dataset.ready = "true";
    observer.observe(scene);
    return () => {
      observer.disconnect();
      delete scene.dataset.ready;
      delete scene.dataset.visible;
    };
  }, []);

  return (
    <div ref={sceneRef} className="confetti-scene">
      <div className="confetti-stage" aria-hidden="true">
        {["left", "right"].map((side) => (
          <div className={`confetti-reveller confetti-${side}`} key={side}>
            <pre className="confetti-person">{kneelingPerson}</pre>
            <div className="confetti-ribbons">
              {["~", "//", ".", "~", "'", "\\"].map((ribbon, index) => (
                <span className="confetti-ribbon" key={index}>{ribbon}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
