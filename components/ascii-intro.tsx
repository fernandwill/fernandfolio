"use client";

import { useState } from "react";
import { deskSmall, deskWide } from "@/lib/ascii-desk";
import { AsciiSteam } from "@/components/ascii-steam";

export function AsciiIntro() {
  const [screenText, setScreenText] = useState("");

  const prompt = (
    <span className="monitor-prompt" data-empty={screenText.length === 0}>
      <input
        type="text"
        value={screenText}
        onChange={(event) => setScreenText(event.currentTarget.value)}
        maxLength={12}
        aria-label="ASCII computer prompt"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </span>
  );

  return (
    <figure className="desk-scene" aria-label="An ASCII workspace with an interactive monitor, coffee, plant, and seated character">
      <div className="desk-art desk-wide">
        <pre aria-hidden="true">{deskWide}<AsciiSteam /></pre>
        {prompt}
      </div>
      <div className="desk-art desk-small">
        <pre aria-hidden="true">{deskSmall}<AsciiSteam compact /></pre>
        {prompt}
      </div>
      <figcaption>a little corner of the internet / medan, indonesia</figcaption>
    </figure>
  );
}
