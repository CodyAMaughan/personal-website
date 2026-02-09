# LibreMotion + Follow Him Scripture Shorts Implementation Plan

## Goals
- Rebrand **Say Play** to **LibreMotion** across the site (excluding historical Build Logs content).
- Add a dedicated LibreMotion product page and portfolio browsing experience powered by Astro content collections.
- Integrate Mux playback for video entries using a reusable React player component.
- Add a dedicated **Follow Him Scripture Shorts** page that showcases the project, links profiles, and surfaces related videos.

## Constraints
- Keep Build Logs historical references to "Say Play" unchanged.
- Keep secrets server-side only (Mux token/secret in `.env`, never in client code).
- Support internal project links cleanly (no forced `target="_blank"` for local routes).

## Execution Steps
1. **Rebrand and project card updates**
   - Copy `public/images/libre-motion-logo.png` to `src/assets/images/libre-motion-logo.png`.
   - Update `src/data/projects.ts`:
     - Rename project title to `LibreMotion`.
     - Update hook/description branding text.
     - Apply LibreMotion colors:
       - primary `#06b6d4`
       - secondary `#a855f7`
     - Replace waitlist behavior with `link: "/libremotion"`.
   - Update logo imports/maps in:
     - `src/components/ProjectList.astro`
     - `src/pages/index.astro`
   - Update internal/external link behavior in project card CTAs:
     - `src/components/BentoGrid.tsx`
     - `src/components/ProjectList.astro`

2. **Rebrand text outside build logs**
   - Update non-build-log content references from Say Play to LibreMotion (e.g., About content).

3. **Portfolio content collection**
   - Extend `src/content/config.ts` with a new `portfolio` collection.
   - Use JSON files under `src/content/portfolio/` with schema fields:
     - `title`, `description`, `pubDate`, `project`
     - optional `muxPlaybackId`, optional `youtubeId`
     - `profiles`, `featured`, `scripture`, `weekOf`
   - Add schema validation that each entry has either `muxPlaybackId` or `youtubeId`.
   - Seed initial entries for LibreMotion and Follow Him Scripture Shorts.

4. **LibreMotion pages**
   - Add `/libremotion` showcase page.
   - Add `/libremotion/portfolio` gallery page.
   - Add `/libremotion/portfolio/[slug]` detail page.
   - Use Astro content APIs to filter portfolio entries by project and render latest/featured videos.

5. **Mux player component**
   - Create `src/components/MuxPlayer.tsx` with `@mux/mux-player-react`.
   - Props: playback ID, title, optional poster/time, and className.

6. **Follow Him Scripture Shorts page**
   - Add `/follow-him-scripture-shorts` page.
   - Include mission/context copy, profile links, publishing cadence, and related video grid.
   - Cross-link back to LibreMotion as the production tool.

7. **Dependency + verification**
   - Install `@mux/mux-player-react`.
   - Run build checks (`npm run build` preferred; fallback `npm run dev` smoke check).
   - Confirm route generation and no TypeScript/content schema errors.

## Deliverables
- Updated project branding and CTAs.
- New portfolio collection + seed content.
- New pages:
  - `/libremotion`
  - `/libremotion/portfolio`
  - `/libremotion/portfolio/[slug]`
  - `/follow-him-scripture-shorts`
- New React component: `src/components/MuxPlayer.tsx`
- Dependency added: `@mux/mux-player-react`
