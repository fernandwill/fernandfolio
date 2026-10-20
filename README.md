# Fernand William Citra — portfolio

A paper-and-ink ASCII portfolio: warm ivory, charcoal text, rust-colored links, and a hand-drawn character workspace. The narrow single-column page uses IBM Plex Mono, native HTML navigation, and expandable project notes. Portfolio content and destinations remain in `lib/portfolio-data.ts`.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. On a fresh checkout, run `npm run dev` or `npm run build` once before `npm run typecheck` so Next.js generates its type declarations.

Known installation limitation: the existing lockfile has incomplete transitive dependency entries and differs from the installed environment used for verification. This cleanup only prunes unused dependencies; repairing and reconciling the lockfile is separate work. `npm install --package-lock=false` is a local workaround, but may resolve newer versions and is not a reproducible install.

## Page structure

- Desktop and phone-sized desk illustrations, introduction, availability, and impact metrics.
- Selected work with live/source links and native expandable project notes.
- Experience, original descriptions, and technologies.
- Everyday toolkit, email, GitHub, and LinkedIn.

The server-rendered page lives in `app/page.tsx`, styling in `app/globals.css`, and the original ASCII desk drawings in `lib/ascii-desk.ts`. Phones use a smaller composition rather than shrinking the desktop artwork.

## Design and accessibility

- Background `#F6F2E9`, ink `#292720`, secondary text `#686257`, accent `#984B35`.
- Real headings, lists, links, and disclosure controls; decorative characters are hidden from assistive technology and the desk figure has an accessible description.
- Visible keyboard focus, a skip link, and reduced-motion support for smooth scrolling.
- Content and project notes work without JavaScript. No canvas or image illustrations.
- On the first visit in a tab session, a full-screen ivory intro draws the desk for 1.8 seconds, then crossfades into the portfolio over 350 milliseconds. The native dialog keeps keyboard focus inside the intro and blocks background interaction/scrolling until it closes. The skip button or Escape goes straight to the page and focuses the main content.
- Reduced-motion preferences, direct section links, and repeat visits in the same session bypass the intro. It also stays out of the way if a visitor has already scrolled or focused something before hydration. The initial HTML contains a closed dialog and all portfolio content, so JavaScript-disabled and unsupported browsers go directly to the page. If session storage is blocked, the intro can replay on reload. The transition lives in `components/page-intro.tsx`; `components/ascii-intro.tsx` retains the interactive desk without a second reveal.
- The computer prompt is a labelled, keyboard-accessible text input with a blinking idle cursor and a compact underline focus indicator, rather than a box around its larger click target. It accepts up to 12 characters and backspace clears the text. Desktop and phone monitors share the text while the page is open. The page carries no on-screen usage instructions. Nothing is stored, transmitted, or executed, and the idle cursor stays static for reduced-motion users.
- Coffee steam flows inside a fixed character block above the cup: 16 x 8 small cells on desktop, 12 x 4 on phones. A requestAnimationFrame loop targets 60 updates per second without React re-renders, and stops when offscreen or the tab is hidden. Reduced-motion preferences disable the loop and restore a static frame; disabled JavaScript or missing IntersectionObserver also leaves static steam. The renderer lives in `lib/ascii-steam.ts` and its lifecycle in `components/ascii-steam.tsx`.
- Two mirrored kneeling figures at the bottom blow ASCII ribbons inward. Ribbons loop automatically whenever the footer scene is in view, without a visible control. Phones use fewer ribbons and smaller figures. Reduced motion, disabled JavaScript, or missing IntersectionObserver leaves static artwork. The scene lives in `components/ascii-confetti.tsx` and the figure in `lib/ascii-confetti.ts`.
- Only the current desk, steam, monitor, and confetti renderers are retained; earlier experimental renderers and their dedicated tests have been removed.

## Repository hygiene

- Live components are in `components/`, their character drawings/renderers in `lib/`, and served icons in `public/`. Unreferenced legacy components, experimental ASCII renderers, old CSS/video, and duplicate root favicon assets have been removed.
- `.gitignore` excludes dependencies, Next.js/build/test output, TypeScript caches, logs, local environment files, Vercel metadata, OS metadata, and the local `FAILURES.md` log. `.env.example` remains eligible for version control; project instructions in `AGENTS.md` are retained.
- `next-env.d.ts` and `request.log` are no longer tracked but remain available locally. Next.js regenerates its declaration file automatically; ignore rules do not remove files from Git history.
- Unused `framer-motion` and `lucide-react` dependencies and exclusive `motion-*` lock entries have been removed without changing other locked versions. The local npm fetch policy blocked npm's automated removal, so those entries were pruned directly; a clean install has not been verified.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

The repository has no lint or browser/E2E script. Homepage tests check character budgets, responsive artwork hooks, immediate content, navigation destinations, preserved data, and project notes. Page-intro tests cover drawing/transition timing, skipping, session memory, reduced motion, direct links, pre-hydration interaction, native-dialog fallback, blocked storage, focus handoff, and cleanup. Desk tests cover shared monitor input, native length/accessibility attributes, and safe rendering of typed text. Steam tests cover fixed grids, deterministic flowing frames, refresh-rate limiting, viewport/tab visibility, live reduced-motion changes, cleanup, and static fallbacks. Confetti tests cover figure character budgets, decorative markup without controls, viewport activation, observer cleanup, and the static fallback.
