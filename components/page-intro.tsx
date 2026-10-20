"use client";

import { useEffect, useRef } from "react";
import { deskSmall, deskWide } from "@/lib/ascii-desk";

const sessionKey = "portfolio-page-intro-v1";
const drawDuration = 1800;
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

    const skip = dialog.querySelector("button");
    const overflow = document.body.style.overflow;
    let exitTimer: ReturnType<typeof setTimeout>;
    const reset = () => {
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
    const drawTimer = setTimeout(() => {
      dialog.dataset.phase = "leaving";
      exitTimer = setTimeout(finish, transitionDuration);
    }, drawDuration);

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
      <p id="page-intro-title" className="eyebrow">[ fernand william citra ]</p>
      <pre className="intro-desk desk-wide" aria-hidden="true">{deskWide}</pre>
      <pre className="intro-desk desk-small" aria-hidden="true">{deskSmall}</pre>
      <p id="page-intro-hint" className="muted">a little corner of the internet</p>
      <button className="intro-skip" type="button">[ skip intro ]</button>
    </dialog>
  );
}
