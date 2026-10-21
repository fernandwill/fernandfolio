"use client";

import { useEffect, useRef } from "react";
import {
  CAPYBARA_HEIGHT,
  CAPYBARA_WIDTH,
  capybaraArt,
  capybaraFrame,
  type CapybaraStep,
  clampCapybaraTarget,
  createCapybaraState,
  stepCapybara,
} from "@/lib/ascii-capybara";

export function AsciiCapybara() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const art = button?.querySelector("pre");
    if (!button || !art) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getBounds = () => ({ width: window.innerWidth, height: window.innerHeight });
    let state = createCapybaraState(getBounds());
    let pointer = { x: state.x, y: state.y };
    let hasPointer = false;
    let frame: number | null = null;
    let previous = 0;
    let painted = -1;

    const render = () => {
      const step: CapybaraStep = !state.moving || motion.matches
        ? 0
        : (Math.floor(state.strideTime * 8) % 2 === 0 ? 1 : 2);
      button.style.transform = `translate3d(${Math.round(state.x)}px, ${Math.round(state.y)}px, 0)`;
      button.dataset.following = String(state.following);
      button.dataset.facing = state.facing;
      button.dataset.moving = String(state.moving && !motion.matches);
      button.setAttribute("aria-pressed", String(state.following));
      art.textContent = capybaraFrame({
        facing: state.facing,
        following: state.following,
        step,
      });
    };

    const draw = (now: number) => {
      const dt = Math.min(now - previous, 100) / 1000;
      previous = now;
      state = stepCapybara(state, dt, getBounds());
      const tick = Math.floor(now / (1000 / 60));
      if (tick !== painted) {
        render();
        painted = tick;
      }
      frame = requestAnimationFrame(draw);
    };

    const sync = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      render();
      if (!motion.matches && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    const updatePointer = (event: Event) => {
      const { clientX, clientY } = event as MouseEvent;
      if (typeof clientX !== "number" || typeof clientY !== "number") return;
      if (clientX === 0 && clientY === 0 && !hasPointer) return;
      hasPointer = true;
      pointer = clampCapybaraTarget(
        clientX - CAPYBARA_WIDTH / 2,
        clientY - CAPYBARA_HEIGHT / 2,
        getBounds(),
      );
      if (state.following) {
        state = {
          ...state,
          targetX: pointer.x,
          targetY: pointer.y,
          facing: Math.abs(pointer.x - state.x) > 1
            ? (pointer.x < state.x ? "left" : "right")
            : state.facing,
        };
      }
    };

    const onClick = (event: Event) => {
      updatePointer(event);
      const nextFollowing = !state.following;
      state = {
        ...state,
        following: nextFollowing,
        pauseRemaining: 0,
        targetX: nextFollowing && hasPointer ? pointer.x : state.targetX,
        targetY: nextFollowing && hasPointer ? pointer.y : state.targetY,
      };
      render();
    };

    const onResize = () => {
      const bounds = getBounds();
      const clamped = clampCapybaraTarget(state.x, state.y, bounds);
      const clampedTarget = clampCapybaraTarget(state.targetX, state.targetY, bounds);
      state = {
        ...state,
        x: clamped.x,
        y: clamped.y,
        targetX: clampedTarget.x,
        targetY: clampedTarget.y,
      };
      render();
    };

    button.dataset.ready = "true";
    sync();
    button.addEventListener("click", onClick);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("resize", onResize);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      button.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      delete button.dataset.ready;
      delete button.dataset.following;
      delete button.dataset.facing;
      delete button.dataset.moving;
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="ascii-capybara"
      aria-label="ASCII capybara"
      aria-pressed="false"
    >
      <pre aria-hidden="true">{capybaraArt}</pre>
    </button>
  );
}
