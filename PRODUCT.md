# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single-page personal portfolio for Fernand William Citra, a full stack software engineer based in Indonesia. All four audiences are confirmed:

- **Hiring managers and tech leads:** evaluate engineering depth (architecture, security, testing, operations) before a conversation.
- **Recruiters:** scan quickly for current title, impact, and stack.
- **Founders and freelance clients:** look for someone who can own a business system end to end.
- **Peers and community:** other developers, CapyHub's badminton club members, and open-source contributors.

## Product Purpose

The site presents Fernand's work and experience and leads visitors to contact him. He is open to full-time roles (his main preference), freelance work (accepted, secondary), and good conversations. Success means a qualified visitor reaches the contact links (email, GitHub, LinkedIn) convinced he can be trusted with a real system.

## Positioning

Fernand owns systems end to end: he designs, builds, secures, deploys, and operates real business platforms. The evidence is specific and verifiable: a company portal for ~8000 agents with 186 API routes, a quote engine for 17 insurance products, 4,600+ automated tests, zero-downtime CI/CD with restore drills, and a field-sales app that led to a 125M IDR sale.

## Operating Context

- Visitors arrive from LinkedIn, GitHub, applications, and direct links, on desktop and phone.
- Hiring evaluators may open the expandable project and role notes for depth; recruiters may read only the first screen and the experience list.
- Some roles overlap in time on purpose; the page says so.

## Capabilities and Constraints

- Next.js (App Router), React, TypeScript, Tailwind CSS 4, Vitest. One server-rendered page (`app/page.tsx`); all content lives in `lib/portfolio-data.ts`.
- Content and project notes must work without JavaScript. Interactive ASCII pieces (intro, monitor prompt, steam, capybara, footer confetti) are progressive enhancements with reduced-motion fallbacks.
- No canvas or raster illustrations; artwork is text characters.
- The current Technical Lead role is under NDA: no company name, product, or details beyond what `portfolio-data.ts` states.

## Brand Commitments

Current commitments, which the user also marked as open to revisit in a deliberate redesign:

- ASCII / terminal identity: hand-drawn ASCII art and monospace type.
- The capybara character (also links to the CapyHub project).
- A lowercase, casual voice ("things i've built", "leave a note", "yes, the dates overlap").

## Evidence on Hand

- Roles, descriptions, highlights, metrics, and stack: `lib/portfolio-data.ts`.
- One open-source project, CapyHub: live site and source on GitHub.
- Favicons: `public/favicon/`.
- No testimonials, client logos, press, or photos exist. Do not fabricate them.

## Product Principles

1. Specific evidence over adjectives: numbers, systems, and verifiable links carry the claim.
2. Respect the fast reader: title, impact, and contact are reachable in seconds; depth sits behind disclosures.
3. Personality supports credibility and never blocks content.
4. Truthful scope: confidential work stays confidential; no invented proof.

## Accessibility & Inclusion

Semantic HTML, a skip link, visible keyboard focus, and reduced-motion support are existing requirements. Decorative ASCII is hidden from assistive technology; meaningful art has an accessible description. Keep these guarantees.
