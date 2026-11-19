"use client";

import { useEffect, useRef } from "react";
import {
  CAPYBARA_HEIGHT,
  CAPYBARA_WIDTH,
  capybaraArt,
  capybaraFrame,
  capybaraWalkStep,
  type CapybaraStep,
  clampCapybaraTarget,
  createCapybaraState,
  retargetCapybara,
  stepCapybara,
} from "@/lib/ascii-capybara";

export function AsciiCapybara() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const art = button?.querySelector("pre");
    if (!button || !art) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Matches the CSS breakpoint that parks the capybara in the page flow, where no gutter fits it.
    const narrow = window.matchMedia("(max-width: 78em)");
    const getBounds = () => {
      const column = button.parentElement?.getBoundingClientRect();
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        column: column && { left: column.left, right: column.right },
      };
    };
    let state = createCapybaraState(getBounds());
    let pointer = { x: state.x, y: state.y };
    let hasPointer = false;
    let frame: number | null = null;
    let previous = 0;
    let painted = -1;

    const render = () => {
      const still = motion.matches || narrow.matches;
      const step: CapybaraStep = !state.moving || still ? 0 : capybaraWalkStep(state.strideTime);
      button.style.transform = narrow.matches ? "" : `translate3d(${Math.round(state.x)}px, ${Math.round(state.y)}px, 0)`;
      button.dataset.following = String(state.following);
      button.dataset.facing = state.facing;
      button.dataset.moving = String(state.moving && !still);
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
      if (!motion.matches && !narrow.matches && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    const updatePointer = ({ clientX, clientY }: MouseEvent) => {
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

    const onClick = (event: MouseEvent) => {
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
      if (state.following) {
        const clamped = clampCapybaraTarget(state.x, state.y, bounds);
        const clampedTarget = clampCapybaraTarget(state.targetX, state.targetY, bounds);
        state = { ...state, x: clamped.x, y: clamped.y, targetX: clampedTarget.x, targetY: clampedTarget.y };
      } else {
        // The old waypoint may now sit over the text column.
        state = retargetCapybara(state, bounds);
      }
      render();
    };

    button.dataset.ready = "true";
    // The column width settles only after the web font swaps in, so watch it rather than measuring once.
    const shell = button.parentElement;
    let columnObserver: ResizeObserver | undefined;
    if (shell) {
      columnObserver = new ResizeObserver(onResize);
      columnObserver.observe(shell);
    }
    sync();
    button.addEventListener("click", onClick);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("resize", onResize);
    motion.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      columnObserver?.disconnect();
      button.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
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
