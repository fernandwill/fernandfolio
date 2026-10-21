"use client";

import { useEffect, useRef } from "react";
import { introFrame } from "@/lib/ascii-loading";

const sessionKey = "portfolio-page-intro-v1";
const drawDuration = 5000;
const frameInterval = 50;
const transitionDuration = 350;

export function PageIntro() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!dialog?.showModal || motion.matches || window.location.hash || window.scrollY > 0 || document.activeElement !== document.body) return;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
    } catch {
      // Storage restrictions must never prevent access to the portfolio.
    }

    const wide = dialog.querySelector(".desk-wide") as { textContent: string | null } | null;
    const small = dialog.querySelector(".desk-small") as { textContent: string | null } | null;
    const skip = dialog.querySelector("button");
    const overflow = document.body.style.overflow;
    const totalSteps = drawDuration / frameInterval;
    let step = 0;
    let exitTimer: ReturnType<typeof setTimeout>;

    const paint = (progress: number) => {
      if (wide) wide.textContent = introFrame(progress, false);
      if (small) small.textContent = introFrame(progress, true);
    };

    const reset = () => {
      clearInterval(frameTimer);
      clearTimeout(drawTimer);
      clearTimeout(exitTimer);
      skip?.removeEventListener("click", finish);
      dialog.removeEventListener("cancel", finish);
      motion.removeEventListener("change", finish);
      if (dialog.open) dialog.close();
      delete dialog.dataset.phase;
      document.body.style.overflow = overflow;
    };
    const finish = (event?: Event) => {
      event?.preventDefault();
      reset();
      try {
        sessionStorage.setItem(sessionKey, "seen");
      } catch {
        // The intro still completes when session storage is unavailable.
      }
      document.getElementById("main-content")?.focus({ preventScroll: true });
    };
    const frameTimer = setInterval(() => {
      step = Math.min(totalSteps, step + 1);
      paint(step / totalSteps);
    }, frameInterval);
    const drawTimer = setTimeout(() => {
      clearInterval(frameTimer);
      paint(1);
      dialog.dataset.phase = "leaving";
      exitTimer = setTimeout(finish, transitionDuration);
    }, drawDuration);

    paint(0);
    dialog.dataset.phase = "drawing";
    dialog.showModal();
    document.body.style.overflow = "hidden";
    skip?.addEventListener("click", finish);
    dialog.addEventListener("cancel", finish);
    motion.addEventListener("change", finish);
    return reset;
  }, []);

  return (
    <dialog ref={dialogRef} className="page-intro" aria-labelledby="page-intro-title" aria-describedby="page-intro-hint">
      <p id="page-intro-title" className="sr-only">Fernand William Citra</p>
      <pre className="intro-desk desk-wide" aria-hidden="true">{introFrame(1, false)}</pre>
      <pre className="intro-desk desk-small" aria-hidden="true">{introFrame(1, true)}</pre>
      <p id="page-intro-hint" className="sr-only">Animated ASCII workspace loading screen</p>
      <button className="intro-skip" type="button">[ skip intro ]</button>
    </dialog>
  );
}
