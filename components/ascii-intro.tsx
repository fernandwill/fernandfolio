"use client";

import { useEffect, useRef, useState } from "react";
import { deskSmall, deskWide } from "@/lib/ascii-desk";
import { AsciiSteam } from "@/components/ascii-steam";

const sessionKey = "portfolio-desk-intro-v1";
const duration = 1800;

export function AsciiIntro() {
  const sceneRef = useRef<HTMLElement>(null);
  const [screenText, setScreenText] = useState("");

  useEffect(() => {
    const scene = sceneRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!scene || motion.matches || window.location.hash) return;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
    } catch {
      // Storage restrictions must never prevent access to the portfolio.
    }

    const reset = () => {
      delete scene.dataset.intro;
      clearTimeout(timer);
      scene.removeEventListener("click", finish);
      scene.removeEventListener("focusin", finish);
      window.removeEventListener("keydown", finish);
      motion.removeEventListener("change", finish);
    };
    const finish = () => {
      if (scene.contains(document.activeElement) && document.activeElement?.classList.contains("desk-skip")) {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
      reset();
      try {
        sessionStorage.setItem(sessionKey, "seen");
      } catch {
        // The intro still completes when session storage is unavailable.
      }
    };

    scene.dataset.intro = "drawing";
    const timer = setTimeout(finish, duration);
    scene.addEventListener("click", finish);
    scene.addEventListener("focusin", finish);
    window.addEventListener("keydown", finish);
    motion.addEventListener("change", finish);
    return reset;
  }, []);

  const prompt = (
    <span className="monitor-prompt" data-empty={screenText.length === 0}>
      <input
        type="text"
        value={screenText}
        onChange={(event) => setScreenText(event.currentTarget.value)}
        maxLength={12}
        aria-label="Type on the ASCII computer (12 characters maximum)"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </span>
  );

  return (
    <figure ref={sceneRef} className="desk-scene" aria-label="An ASCII workspace with an interactive monitor, coffee, plant, and seated character">
      <div className="desk-art desk-wide">
        <pre aria-hidden="true">{deskWide}<AsciiSteam /></pre>
        {prompt}
      </div>
      <div className="desk-art desk-small">
        <pre aria-hidden="true">{deskSmall}<AsciiSteam compact /></pre>
        {prompt}
      </div>
      <figcaption>
        a little corner of the internet / medan, indonesia
        <span className="monitor-hint">click the computer prompt to type</span>
        <span className="desk-intro-controls"><button className="desk-skip" type="button">[ skip intro ]</button></span>
      </figcaption>
    </figure>
  );
}
