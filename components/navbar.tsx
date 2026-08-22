"use client";

import { useEffect, useState } from "react";
import { navItems, type SectionId } from "@/lib/portfolio-data";

export function Navbar() {
  const [activeSection, setActiveSection] = useState<SectionId>("experience");

  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionId);
      },
      { rootMargin: "-20% 0px -60%", threshold: [0.1, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="w-full pb-4 pt-2">
      <nav
        className="flex items-center justify-between gap-4 font-mono text-sm"
        aria-label="Main navigation"
      >
        <a
          href="#about"
          className="text-sm font-semibold text-[#facc15] transition-colors duration-200 hover:text-[#fde68a]"
        >
          &gt; fernandwill
        </a>

        <div className="flex items-center gap-6 sm:gap-8">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-xs tracking-wider transition-colors duration-200 ${
                  active ? "font-medium text-[#facc15]" : "text-[#a3a3a0] hover:text-[#f8f8f2]"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-[2px] bg-[#facc15]"
                  />
                )}
              </a>
            );
          })}

          <button
            type="button"
            aria-label="Toggle terminal"
            onClick={() =>
              document
                .getElementById("terminal")
                ?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className="flex items-center rounded border border-[#facc15] px-2 py-0.5 text-xs text-[#facc15] transition-all hover:bg-[#facc15]/10"
          >
            &gt;._
          </button>
        </div>
      </nav>
    </header>
  );
}
