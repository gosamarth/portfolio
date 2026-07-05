# Portfolio Build Spec — Techie + Car Guy (NFS Garage)

> Living spec. Captures decisions so the build survives model/session switches.
> Owner is Director of Engineering @ ThrivePass. Site doubles as proof-of-build.

## Locked decisions

| Area | Decision |
|------|----------|
| Car graphics | **AI renders only** — generated in **Higgsfield by the owner**, dropped into `/public/cars/`. No copyrighted press photos. |
| Car world | **NFS Underground garage**: dark showroom, wet reflective floor, cyan/magenta neon rim light, volumetric haze, turntable pedestals, `IN GARAGE` / `SOLD` stamp per car. |
| Tone | **Balanced** — engineering leadership credibility + site-as-portfolio-piece + car passion. |
| Gen tooling / MCP | **None required.** Owner generates art in Higgsfield. Claude uses existing `WebSearch`/`WebFetch` (specs) + `browser-tools` MCP (screenshot/verify). |
| Optional wow | Higgsfield **360° turntable video loops** for 2–3 hero cars → video texture on pedestal. |
| Stack | Vite + React + TS + react-three-fiber + drei + postprocessing + Tailwind (already scaffolded). |
| Build model | Switch to **Fable** to implement once data below is filled in. |

## Planned sections (journey order)
1. **Hero** — name, "Director of Engineering @ ThrivePass" + gearhead hook.
2. **About / Leadership** — who you are, scope, what you own.
3. **The Garage** — the NFS car gallery (the centerpiece). Turntables, stamps, per-car bios + stats.
4. **Engineering / Work** — projects that prove capability (incl. this site, Imnoting, etc.).
5. **Stack / Skills** — languages, cloud, domains.
6. **Career timeline** — roles over time (optional).
7. **Contact** — email CTA + socials + optional resume download.

## Car art direction (so every render matches)
Master style prompt (owner pastes into Higgsfield, per car):

> Ultra-detailed cinematic 3/4 front studio render of a **{YEAR MAKE MODEL TRIM}** in
> **{EXACT COLOR + FINISH}**, parked on a dark glossy wet reflective concrete floor inside a
> moody underground showroom. Dramatic neon rim lighting (cyan key, magenta fill),
> volumetric haze, wet-look body reflections, shallow depth of field, photoreal, 8k,
> octane-render quality, high-end automotive advertising photography, Need for Speed
> Underground aesthetic. Car centered, seamless dark background, no text, no watermark.

Rules for cohesion:
- Same camera angle (3/4 front, slight low angle) and same neon lighting for every car.
- Output framing: square or 16:9, car centered, dark seamless bg (reads as a car-select stage).
- Turntable video (hero cars): append "seamless 360° turntable rotation, slow, 5-second loop".
- File convention: `/public/cars/<slug>.jpg` e.g. `2018-bmw-m3-competition.jpg`;
  extra angles `<slug>-2.jpg`; hero loop `<slug>.mp4`.

## DATA — fill these in (then we build)

### Profile
- Full name / display name:
- Headline: Director of Engineering @ ThrivePass
- Location:
- Years in engineering / in leadership:
- What ThrivePass does (1 line) + your scope (team size, what you own):
- Signature achievements / metrics:
- Tech to flex (languages, cloud, domains):
- Other projects to showcase (name — 1 liner — stack/link):
- Career timeline (Company — Title — years), most recent first:
- Socials: LinkedIn / GitHub / X / email / other:
- Headshot photo? (drop at /public/me.jpg):
- Resume/CV PDF? (drop at /public/resume.pdf):
- Tagline / personal motto:

### Cars (repeat block per car; be exact)
- Status: Owned (In Garage) | Sold | Previously owned | Dream/Wishlist
- Hero? (feature large / turntable video): yes/no
- Year / Make / Model / exact Trim:
- Exact factory color + finish (metallic/matte/pearl):
- Visual mods for render accuracy (wheels, body kit, spoiler, tint, stance, decals):
- Owned from → to (month/year):
- Engine / drivetrain / transmission:
- HP / torque / 0–60 / top speed:  (leave blank → Claude fetches via WebSearch)
- Mileage (optional):
- Nickname (optional):
- Your story / why this car / best memory (1–2 lines):
- Have your own photos to also include? (optional):
