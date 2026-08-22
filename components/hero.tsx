import { Mail, MapPin } from "lucide-react";
import { siGithub } from "simple-icons";
import { contact, metrics } from "@/lib/portfolio-data";

// ponytail: siLinkedin was removed from simple-icons (brand takedown); inline the last published glyph
const linkedinIcon: { path: string } = {
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

function BrandIcon({ icon }: Readonly<{ icon: { path: string } }>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[14px] w-[14px] shrink-0 fill-current text-[#facc15]">
      <path d={icon.path} />
    </svg>
  );
}

export function Hero() {
  return (
    <div id="about" className="flex flex-col items-start font-mono">
      <p className="text-xs font-semibold tracking-wider text-[#facc15]">
        // FULL STACK SOFTWARE ENGINEER
      </p>

      <h1
        id="hero-heading"
        className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-[#f8f8f2] sm:text-5xl lg:text-6xl"
      >
        <span className="text-[#facc15]">Fernand</span>
        <br />
        William
        <br />
        Citra.
      </h1>

      <p className="mt-3 flex items-center gap-2 text-xs text-[#a3a3a0]">
        <MapPin size={13} strokeWidth={1.5} className="shrink-0 text-[#facc15]" aria-hidden="true" />
        <span>{contact.location}</span>
      </p>

      <p className="mt-5 max-w-md text-sm leading-relaxed text-[#a3a3a0]">
        I solve real-world business problems by building secure backend architectures, scalable software systems, and AI pipelines that drive measurable impact from requirements to production.
      </p>

      <ul className="mt-6 flex flex-col gap-2 text-sm">
        {metrics.map((metric) => (
          <li key={metric.label} className="flex items-baseline gap-2">
            <span aria-hidden="true" className="text-[#facc15] font-bold">&gt;</span>
            <span>
              <strong className="font-semibold text-[#facc15]">{metric.value}</strong>{" "}
              <span className="text-[#a3a3a0]">{metric.label}</span>
            </span>
          </li>
        ))}
      </ul>

      <address className="mt-8 flex flex-col gap-3 text-xs not-italic">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2.5 text-[#a3a3a0] transition-colors duration-200 hover:text-[#facc15]"
        >
          <Mail size={14} strokeWidth={1.5} className="shrink-0 text-[#facc15]" aria-hidden="true" />
          <span>{contact.email}</span>
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-[#a3a3a0] transition-colors duration-200 hover:text-[#facc15]"
        >
          <BrandIcon icon={linkedinIcon} />
          <span>linkedin.com/in/fernandwill</span>
        </a>
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-[#a3a3a0] transition-colors duration-200 hover:text-[#facc15]"
        >
          <BrandIcon icon={siGithub} />
          <span>github.com/fernandwill</span>
        </a>
      </address>
    </div>
  );
}
