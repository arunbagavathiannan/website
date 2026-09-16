# Portfolio Website — Design Spec (DRAFT for review)

**Status:** Draft spec, partially built. Sections 1–3 are yours to own — I've pre-filled them from your resume as a starting point so you have something concrete to react to, not a finished answer. Correct anything that doesn't match your intent.

**Already implemented** (builds clean, `astro check` 0 errors): the homepage — hero, experience, projects, contact — plus the retheme, two new widgets, and site config. **Not implemented:** the Phase 0 demo-content strip, Skills (§3.5), About (§3.6), Awards (§3.7). See Section 4.

**Stack:** AstroWind fork (`arunbagavathiannan/astrowind`) — Astro 7, Tailwind v4, static output, deployed on Vercel.
**Source of truth for content:** `Arun Bagavathiannan Resume (3).pdf` (Sep 15, 2026, 7:18 pm) — supersedes resume (2).

---

## Section 1 — Problem Definition

### 1.1 Plain-English purpose
A single-page-first personal site that makes a recruiter or hiring manager believe, within ~20 seconds, that Arun is a CS sophomore at UT Austin who ships real systems used by real people — then gives them the evidence and a way to contact him.

### 1.2 Primary audience (ranked)
1. Recruiters / engineering managers screening for **SWE internships (Summer 2027)**
2. Student org and hackathon collaborators
3. Anyone arriving from the YouTube channel or the UT CS News article

### 1.3 Inputs
| Input | Source | Format |
|---|---|---|
| Bio, education, experience, projects, skills, awards | Resume PDF | Hand-authored into `.astro` page files |
| Resume PDF itself | `~/Downloads/Arun Bagavathiannan Resume (3).pdf` | Copied to `public/resume.pdf` |
| Project screenshots / logos | **MISSING — you must supply** | `src/assets/images/*` |
| Headshot | **MISSING — you must supply** | `src/assets/images/arun.jpg` |
| Social links | Resume header | Hardcoded in `navigation.ts` |

### 1.4 Outputs
- Static HTML/CSS/JS built by `astro build` → `dist/`
- Deployed to Vercel at a custom domain (TBD — see Open Question O-5)
- `sitemap-index.xml`, `rss.xml` (only if blog is kept), OG image per page

### 1.5 Dependencies
- Already in the fork: Astro 7, Tailwind v4, `astro-icon` (Tabler set), `astro-seo`, `@astrojs/sitemap`, `astro-compress`, `sharp`
- Node ≥ 22.22.3 (`.nvmrc` present, `engines` field enforces it)
- Vercel account linked to the GitHub repo
- **No new dependencies should be needed.** If a design choice below requires one, that's a signal to simplify.

### 1.6 Hard requirements
| # | Requirement |
|---|---|
| R-1 | Loads fast on mobile — Lighthouse Performance ≥ 95, all four categories ≥ 90 |
| R-2 | Works with JavaScript disabled for all content (Astro static; JS only enhances) |
| R-3 | Dark mode works — the fork defaults to `ui.theme: 'system'` with a manual toggle |
| R-4 | Every number on the site traces to a line on the resume. No invented metrics. |
| R-5 | Resume PDF downloadable in one click from the hero |
| R-6 | No fictional testimonials, no fake client logos, no "trusted by" section |
| R-7 | Accessible: real heading hierarchy, alt text on every non-decorative image, visible focus rings |

### 1.7 Done criteria
- [ ] All AstroWind demo pages and demo blog posts removed; `npm run build` clean
- [ ] `npm run check` passes (astro check + eslint + prettier)
- [ ] Every section below populated with real content — zero lorem ipsum, zero "Sarah Johnson"
- [ ] Deployed to Vercel, custom domain resolving over HTTPS
- [ ] Lighthouse run on the deployed URL meets R-1
- [ ] Manually tested at 375 px, 768 px, 1440 px in both themes

---

## Section 2 — High-Level Design

### 2.1 Site map

```
/                    Home — the whole pitch, one scroll (§3.1–3.8)
/projects/breakout   Deep dive: Breakout            ← Phase 2
/projects/utrp       Deep dive: UT Registration Plus ← Phase 2
/resume.pdf          Static file in public/
/404                 Keep the fork's, restyled
```

**Recommendation:** ship Phase 1 (`/` + 404 + PDF) first, deploy it, then add project deep-dives. A live one-pager beats an unfinished multi-page site.

### 2.2 Home page flow

```
┌─────────────────────────────────────────────┐
│ Header (sticky, theme toggle)               │
├─────────────────────────────────────────────┤
│ §3.1  Hero — name, one-line pitch, 2 CTAs   │  ← 20-second test happens here
├─────────────────────────────────────────────┤
│ §3.2  Stats — 4 credibility numbers         │
├─────────────────────────────────────────────┤
│ §3.3  Projects — 3 cards, image + result    │  ← the evidence
├─────────────────────────────────────────────┤
│ §3.4  Timeline — experience, reverse-chron  │
├─────────────────────────────────────────────┤
│ §3.5  Skills — grouped, icon grid           │
├─────────────────────────────────────────────┤
│ §3.6  About — photo + 2 paragraphs + edu    │
├─────────────────────────────────────────────┤
│ §3.7  Awards — compact list                 │
├─────────────────────────────────────────────┤
│ §3.8  Contact CTA                           │
├─────────────────────────────────────────────┤
│ Footer — socials, copyright                 │
└─────────────────────────────────────────────┘
```

**Why this order:** Hero states the claim. Stats make it quantitative. Projects prove it. Timeline shows it's sustained, not a one-off. Everything after is supporting detail for someone already convinced.

### 2.3 Data interfaces
No CMS, no API, no database. Content is **hardcoded in the `.astro` page files** as props to existing widgets. Rationale: one author, ~6 content blocks, changes maybe monthly. A content collection would add indirection with no payoff.

The one exception: if `/projects/*` deep dives happen (Phase 2), they become a `project` content collection in `src/content.config.ts` modeled on the existing `post` collection.

### 2.4 Theme

| Token | Value | Why |
|---|---|---|
| `--aw-color-primary` | `rgb(191 87 0)` — UT burnt orange | Signals UT Austin without a logo; distinct from the default AstroWind blue every fork uses |
| `--aw-color-secondary` | `rgb(154 70 0)` | Darker orange for hover/active |
| `--aw-color-accent` | `rgb(51 63 72)` — UT charcoal | Second UT brand color, for muted accents |
| Font | Inter (already wired via Astro Fonts API) | Keep. Self-hosted, subset, preloaded — free performance. |

Edited in `src/components/CustomStyles.astro` (both `:root` and `.dark` blocks). See Open Question O-2 — burnt orange is a real choice, not a default, and you should confirm it.

Dark mode brightens the accent to `rgb(240 110 20)`. Stock `#BF5700` on a near-black ground is too dark to carry as a link colour; the brighter orange keeps the same identity at usable contrast.

### 2.5 Visual design language (derekchen.dev × AstroWind)

The reference site is minimal-editorial; AstroWind is a widget kit. Fusing them means **keeping AstroWind's architecture and replacing its visual defaults**, not restyling one page.

| Taken from derekchen.dev | Taken from AstroWind |
|---|---|
| Oversized name as the only display-scale type | Widget composition via `WidgetWrapper` |
| Prose-first hero with **links inside the sentences** | Scroll-reveal intersection animations |
| Plain text CTA with an arrow, not a button | Theme tokens + light/dark toggle |
| Monochrome social squares | Tabler icon set, Inter via the Fonts API |
| Experience as a divided list, not a timeline | `Projects.astro` card grid, tag pills, `result` line |
| Near-black ground, near-monochrome palette | `Headline`, `Button`, `Footer` primitives |
| Left-aligned section headings | Astro static build, image pipeline |

**The load-bearing idea:** claims stay in sentences. A conventional portfolio hero breaks "60,000+ students" into a stat tile; here it stays inside the paragraph as a link. That is what makes the page read as written rather than assembled — and it's why the hero has no image and no button row.

**Accent discipline.** Burnt orange appears only on links, hover states, the `result` line and section icons. Everything else is black, white or grey. A scarce accent is what makes it read as emphasis; spending it on headings would flatten the whole page.

**Where I deliberately did NOT follow the reference:** the contact block stays as AstroWind's centred `CallToAction`. It's the one section that is visually AstroWind rather than editorial. Flagging it as a loose end — see "What I'd push back on."

---

## Section 3 — Per-Block Specs

Each block names the existing AstroWind widget to use, the exact content from your resume, and what could go wrong.

---

### §3.1 Hero
**Widget:** `Hero.astro` (`src/components/widgets/Hero.astro`)
**Role:** Answer "who is this and why should I care" above the fold.

**Content:**
- Title: `Arun Bagavathiannan`
- Tagline: `CS @ UT Austin · Class of 2028`
- Subtitle: *I lead a team of 5 building a Chrome extension that 60,000+ UT students use to register for classes. Before that I trained computer-vision models for agricultural research and grew a YouTube channel to 20,000 subscribers.*
- Actions: `[primary: "View my work" → #projects]`, `[secondary: "Résumé (PDF)" → /resume.pdf]`
- Image: headshot, or a screenshot of UTRP in use

**Edge cases:**
- No image supplied → the widget renders text-only and centers; acceptable but weaker. Decide before build.
- Subtitle is 3 claims in one breath. If it reads as bragging, cut the YouTube clause — it's recoverable in §3.2.

---

### §3.2 Stats
**Widget:** `Stats.astro`, with `countUp` enabled
**Role:** Four numbers that are hard to argue with.

| Amount | Label | Traces to |
|---|---|---|
| `60,000+` | Students served by UTRP | Resume, UTRP bullet 1 |
| `20,000+` | YouTube subscribers | Resume, Content Creator bullet 1 |
| `7M+` | Video views | Resume, Content Creator bullet 1 |
| `80%+` | ML model precision & recall | Resume, ML Research bullet 2 |

**Edge cases:**
- `countUp` animates on scroll; must degrade to the static number with JS off (the widget already handles this — verify).
- Mixing an engineering metric with two YouTube metrics is a deliberate bet that the audience reads "this person ships things people use." If you'd rather read as pure engineer, swap the two YouTube rows for `6×` (training data scaled) and `3` (conferences presented at). **Your call — Open Question O-3.**

---

### §3.3 Projects
**Widget:** `Projects.astro`, `columns={3}`
**Role:** The evidence. Each card: image, tags, title, one-line description, a `result`, and a link.

| # | Title | Description | Tags | Result | Href |
|---|---|---|---|---|---|
| 1 | UT Registration Plus | Chrome extension (Manifest V3) giving UT students real-time course availability inside their calendar. I lead the 5-person team. | TypeScript, React, Chrome MV3 | `60,000+ students` | GitHub / Chrome Web Store |
| 2 | Breakout | Chrome extension scoring YouTube videos against rolling channel medians, so a video is judged against its own channel's baseline. Parses `ytInitialData` instead of the quota-limited API. TF-IDF niche filter builds weighted vocabulary from seed channels. | JavaScript, Chrome MV3, TF-IDF, In progress | *(none — not shipped yet)* | — |
| 3 | Weed Detection (Texas A&M) | YOLOv8 object-detection pipeline from a 100-image raw dataset to a production model; OpenCV augmentation scaled training data 6×. | Python, YOLOv8, OpenCV | `80%+ precision & recall` | Conference slides / writeup |

**Edge cases:**
- **Breakout is not shipped yet.** R-4 and R-6 apply hardest here. The card carries no `result` metric and leads with "In progress." — because inventing "surfaces 10x outliers" for unwritten software is exactly the fabrication those requirements exist to prevent. It also carries an `In progress` tag. **This is the honest framing, and it is weaker than a shipped project.** If you'd rather not show unbuilt work at all, cut it to two cards; the grid handles `columns={2}` fine. My recommendation is to keep it — a designed-but-unbuilt system with a real architecture doc still shows how you think, as long as it says so.
- Breakout (formerly named ViewTube in an earlier draft) replaced Investly at your request. **Investly is the stronger résumé item today** — it's finished, it has a measured result, and rejecting your own strategy is a genuine signal of judgment. Consider showing both once Breakout ships.
- Missing images: the widget renders a card without one, but three image-less cards look bare. Need at least a screenshot each. UTRP → Chrome Web Store screenshot. Breakout → a badge-injection screenshot once it exists. Weed detection → an annotated detection frame (confirm you're allowed to publish A&M research imagery — **Open Question O-4**).
- `result` is small and easy to miss. It's the highest-value text on the card; verify visual weight after first build.

---

### §3.4 Experience Timeline
**Widget:** `Timeline.astro`, `layout="vertical"`
**Role:** Show a sustained trajectory, not scattered one-offs.

| Date | Title | Description | Flags |
|---|---|---|---|
| Aug 2026 – Present | Technical Lead, UT Registration Plus | Promoted from Software Engineer. Lead 5 developers. Ran the fellowship hiring: 80+ applications screened, 4 engineers selected (~5% acceptance). | `highlight: true` |
| Jan 2026 – Aug 2026 | Software Engineer, UT Registration Plus | Built the Course Status Checker (cited in UT CS News), a throttled refresh system in React/TS, and a reactive store syncing service-worker and UI state. | |
| Jan 2025 – Mar 2025 | ML Research Intern, Texas A&M | YOLOv8 detection pipeline; presented at 3 conferences including WSSA (Vancouver) and EWRS (Spain). | |
| Jul 2021 – Present | Content Creator, YouTube | 20k subscribers, 32M+ impressions. Launched buyorphic.com, $500+ in preset sales. | |

**Edge cases:**
- Splitting UTRP into two entries is the point — it makes the promotion visible, which one merged entry hides.
- YouTube (2021–present) overlaps everything else, so strict reverse-chronological ordering is impossible. Placing it last is a judgment call; flag if you disagree.
- The `ghost` prop exists for a faded "what's next" entry (e.g. "Summer 2027 — seeking SWE internship"). **Recommend against it** — it reads as asking rather than showing. Mentioned so you can overrule.

---

### §3.5 Skills
**Widget:** `Features3.astro`, `columns={3}`, icon per group
**Role:** Keyword coverage for humans skimming and for ATS-style keyword matching.

| Group | Items | Icon |
|---|---|---|
| Languages | Python, TypeScript, Java, C, C++, Assembly, Bash | `tabler:code` |
| Web & Tools | React, Node.js, Chrome Extensions (MV3), Git/GitHub, Astro | `tabler:browser` |
| AI / ML | LLM inference, RAG pipelines, ChromaDB, model training & validation, Claude API, MCP, Ollama | `tabler:brain` |

**Edge cases:**
- **Resolved in resume (3):** the Gemma 3 / Gemma 4 contradiction is gone — Gemma now appears only once, in Skills.
- **New in resume (3):** dropping Investly left `ChromaDB`, `RAG Pipelines` and `Gemma 4 E4B` in Skills with **no project on the résumé that uses them**. A recruiter who asks "where did you use ChromaDB?" gets no answer from the page or the PDF. Either bring Investly back, or cut those three skills. See O-1.
- Spoken languages (English, Tamil, German, Japanese) are on the resume but don't belong in a technical skills grid. Recommend folding them into the About paragraph instead.
- Resist adding anything not on the resume. R-4 applies here too.

---

### §3.6 About
**Widget:** `Content.astro` with `isReversed`, image on one side
**Role:** The human paragraph. Everything above is claims and numbers; this is voice.

**Content (draft — rewrite in your own voice, this is placeholder-quality):**
> I'm a sophomore studying Computer Science at UT Austin, expected to graduate in Spring 2028. Most of my time goes to UT Registration Plus, where I lead a team of five building the Chrome extension that tens of thousands of students use to plan their schedules.
>
> I got into engineering sideways — through a YouTube channel where I taught video editing, which taught me more about shipping on a deadline than any class has. Coursework: Data Structures, Discrete Math, Software Design & Implementation, Embedded Systems, Linear Algebra. I speak English and Tamil natively, and I'm working on German and Japanese.

**Edge cases:**
- This draft is mine, not yours. It will sound like a bot until you rewrite it. **Flagging this as the single highest-value thing only you can do.**
- Needs a photo. Text-only About is a wall.

---

### §3.7 Awards
**Widget:** `Features2.astro` or a compact `Content` block with `items`
**Role:** Third-party validation. Small section — don't overbuild it.

- **1st Place**, AI Data Portability Hackathon — The AI Collective / AITX / DTI (Mar 2026)
- International Education Fee Scholarship (IEFS) (Mar 2026)
- Friends of Alec Engineering Scholarship (Feb 2026)

**Edge case:** Three lines don't justify a full-width widget with heavy padding. If it looks thin, merge it into §3.6 as a sidebar list.

---

### §3.8 Contact CTA
**Widget:** `CallToAction.astro`
**Role:** One clear next action.

- Title: `Let's build something`
- Subtitle: `Open to SWE internships for Summer 2027.`
- Actions: `[primary: "Email me" → mailto:arun.bagavathiannan@gmail.com]`, `[secondary: "LinkedIn"]`, `[secondary: "GitHub"]`

**Edge cases:**
- **Recommend `mailto:` over a contact form.** A form on a static site needs a third-party service (Formspree, Vercel serverless) — new dependency, new failure mode, spam handling — for an audience that will email you anyway.
- Publishing your email in plain HTML means scrapers will find it. That's the trade for one-click contact; it's the normal choice for a portfolio, but it is a choice.
- Phone number from the resume: **recommend omitting** from the public site. It's on the PDF for people who asked for the PDF.

---

## Section 4 — Implementation Plan (my execution, from your specs)

### Phase 0 — Strip the template
1. ☐ Delete demo pages: `src/pages/homes/`, `src/pages/landing/`, `pricing.astro`, `services.astro`, `about.astro`, `contact.astro`
2. ☐ Delete demo blog: `src/pages/[...blog]/`, `src/data/post/*`, `rss.xml.ts`; set `apps.blog.isEnabled: false` in `src/config.yaml` (see O-6)
3. ☐ Rewrite `src/navigation.ts` — anchor links only for a one-pager. *(The homepage overrides header and footer inline, so the demo nav is invisible on `/` but still ships on every demo page.)*
4. ☑ `src/config.yaml` — site name, URL, metadata, OG description; cleared the AstroWind Google verification ID and `@arthelokyo` Twitter handle
5. ☐ Replace favicons in `src/assets/favicons/`

### Phase 1 — Build the home page
6. ☑ Retheme `CustomStyles.astro` per §2.4 — dark-first, near-monochrome, burnt orange accent
7. ☑ `src/pages/index.astro` composing §3.1, §3.3, §3.4, §3.8. **§3.5 Skills, §3.6 About and §3.7 Awards are not built** — About needs your voice (see its edge case), and the other two are quick once you confirm O-3
8. ☑ New widget `HeroIntro.astro` — §3.1, editorial hero with inline-link prose
9. ☑ New widget `ExperienceList.astro` — §3.4, divided list rather than `Timeline.astro`
10. ☑ `Projects.astro` recoloured to the monochrome palette (was blue-tinted `slate-900`)
11. ☑ Logo shows your name instead of "🚀 AstroWind"; minimal footer on `/`
12. ☑ `resume.pdf` copied to `public/` — **see the phone-number warning below**
13. ☐ Project images — blocked on O-7
14. ☐ Restyle 404

### Phase 2 — Verify
10. `npm run check` → clean
11. `npm run build` → clean; check `dist/` for orphaned demo routes
12. Manual pass: 375/768/1440 px, light + dark, keyboard-only tab through
13. Lighthouse on the Vercel preview URL against R-1

### Phase 3 — Deploy
14. Import repo into Vercel — it auto-detects Astro; no config needed beyond the existing `vercel.json` (which already sets `cleanUrls` and immutable caching on `/_astro/*`)
15. Build command `npm run build`, output `dist/` — both Vercel defaults for Astro
16. Set Node 22 in project settings to match `engines`
17. Attach custom domain, verify HTTPS
18. Set `site.site` in `config.yaml` to the final domain **before** the production build — sitemap and canonical URLs depend on it

---

## Open Questions — I need your answers before Phase 1

| # | Question | My recommendation |
|---|---|---|
| **O-1** | Résumé (3) still lists ChromaDB, RAG Pipelines and Gemma 4 E4B under Skills, but Investly — the only project that used them — is gone. | Either restore Investly as a fourth project, or cut those three skills. Unbacked skills are the first thing an interviewer probes. |
| **O-8** | `public/resume.pdf` carries your **phone number**. Publishing it puts (979) 575-3148 on a public URL for scrapers. | Your call. Either accept it, or export a web version of the résumé with the phone removed and ship that as `resume.pdf`. |
| **O-2** | UT burnt orange, or something not tied to the school? | Burnt orange — instantly legible, and you're a current student |
| **O-3** | Stats: include the YouTube numbers, or keep all four engineering? | Include them. 20k subscribers is rarer than a good GPA. |
| **O-4** | Can you publish Texas A&M research imagery? | Check with your PI before using it |
| **O-5** | Domain name? | `arunbagavathiannan.com` if available; otherwise `arunb.dev` |
| **O-6** | Keep the blog? | Cut it for now. An empty blog is worse than no blog. The fork keeps working if you re-enable it later. |
| **O-7** | Headshot + 3 project screenshots — do you have these? | Blocks §3.1 and §3.3; nothing else can start without them |

---

## What I'd push back on

**The site is doing two jobs.** The engineering story (UTRP, Breakout, YOLOv8) and the creator story (20k subs, 32M impressions, an e-commerce side business) are both genuinely strong, but they pull toward different readers. This spec leans engineering-first and lets the creator work appear as *evidence of shipping ability* rather than as a parallel identity. If you'd rather foreground the creator side, §3.1, §3.2, and §3.4 all change — tell me before Phase 1, not after.

**One page is enough right now.** Multi-page portfolios are where student sites go to die half-finished. Deployed and complete beats ambitious and 70% done.
