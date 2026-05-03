# Ascend — Hunter's Forge · Implementation Plan

> A fully-animated, theme-switchable Solo-Leveling/Fantasy gym RPG, rebuilt from a Claude Design handoff into a production React + Vite codebase.

---

## 1. Vision

Recreate the **Ascend — Hunter's Forge** prototype pixel-perfectly while replacing its plain-script, single-file delivery with a modular React 18 + Vite codebase that is:

- **Fully animated** — environmental FX (petals, embers, fog, lightning, runes), screen transitions, level-up cinematics, boss intros, 3D character viewer.
- **Dual-themed** — `cyber-arcane` (Solo Leveling) and `verdant-grove` (Fantasy) swap palette, typography, copy, glyphs, cinematics, and FX layers.
- **Reusable & extensible** — primitives (`Panel`, `RankEmblem`, `StatBar`, `FloatingXp`, `Icon`) and feature modules wired through a context-driven theme + state system, so adding a sixth race, a fourth screen, or a new boss is a pure data change.

The final UX matches the design's iOS-frame mock: a 402×874 phone shell containing five tabs, multi-avatar onboarding, live workout logging, dungeon boss intros, level-up cinematic, and a developer Tweaks panel.

---

## 2. Tech Stack

| Concern | Choice | Reason |
| --- | --- | --- |
| Build | **Vite** | Fast HMR, modern ESM. |
| UI runtime | **React 18** | Matches design source, supports `createRoot` & concurrent rendering. |
| Language | **JavaScript (JSX)** | Mirrors design source, lowers friction; types-via-JSDoc where needed. |
| Styling | **CSS variables + global stylesheet** + small CSS modules per feature | Theme tokens already defined as CSS custom properties; design depends on `data-theme` attribute. |
| 3D | **three.js** (vanilla, mounted via `useEffect`) | Used for `ClassViewer3D` — 9 stylized character classes. |
| Animations | **CSS keyframes + Web Animations API** | All animations declarative; no library bloat. |
| State | **React Context** (`ThemeContext`, `GameContext`) + local state | Pure React, zero dependency. Easy to swap for Zustand/Redux later. |
| Fonts | **Google Fonts** (Cinzel, Cinzel Decorative, Cormorant Garamond, EB Garamond, JetBrains Mono, Space Grotesk, Uncial Antiqua, MedievalSharp) | Loaded via `<link>`, swapped via `--display-font`/`--body-font`/`--hud-font` vars per theme. |
| Routing | **In-state `screen` enum** | Matches design's tab system; no need for React Router. Wrap in `useScreenRouter` hook so it can swap to URL-based later. |

---

## 3. Project Structure

```
gymapp/
├─ implementation-plan.md
├─ package.json
├─ vite.config.js
├─ index.html
├─ public/
│  └─ fonts/                  # offline font fallbacks (optional)
└─ src/
   ├─ main.jsx                # ReactDOM.createRoot
   ├─ App.jsx                 # composition root: providers + Phone shell
   ├─ styles/
   │  ├─ index.css            # global tokens, base elements
   │  ├─ themes.css           # cyber-arcane + verdant-grove overrides
   │  ├─ animations.css       # all @keyframes
   │  └─ fx.css               # fantasy-fx, scanlines, vines, embers
   ├─ data/                   # pure data modules (extensibility hot-path)
   │  ├─ ranks.js             # RANKS, RANK_COLORS
   │  ├─ races.js             # RACES, glyphs
   │  ├─ programs.js          # PROGRAMS (3/4/5-day splits)
   │  ├─ avatars.js           # INITIAL_AVATARS
   │  ├─ quests.js            # INITIAL_QUESTS
   │  ├─ dungeons.js          # DUNGEONS
   │  ├─ inventory.js         # INVENTORY items
   │  ├─ workout.js           # LIVE_WORKOUT seed
   │  └─ themeCopy.js         # lex() — fantasy/cyber phrase swaps
   ├─ contexts/
   │  ├─ ThemeContext.jsx     # theme key + applyTheme + useTheme
   │  └─ GameContext.jsx      # avatars, quests, workout, modals
   ├─ hooks/
   │  ├─ useTheme.js          # subscribes to data-theme MutationObserver
   │  ├─ useScreenRouter.js   # screen enum + history
   │  └─ useFloatingXp.js     # spawn floating "+XP" tickers
   ├─ frame/
   │  └─ IOSDevice.jsx        # 402×874 device frame, notch, dynamic island
   ├─ ui/                     # reusable design-system primitives
   │  ├─ Icon.jsx             # 18 stroke icons (home, sword, gate, etc.)
   │  ├─ Panel.jsx            # panel + ::before gradient border
   │  ├─ Corners.jsx
   │  ├─ Divider.jsx          # hr-mystic / vine separator
   │  ├─ Button.jsx           # variants: primary, ghost, danger
   │  ├─ Checkbox.jsx
   │  ├─ Segmented.jsx        # .seg control
   │  ├─ StatBar.jsx
   │  ├─ HudHeader.jsx
   │  ├─ Glyph.jsx            # rotated diamond / leaf
   │  ├─ RankEmblem.jsx       # hex (cyber) ↔ heraldic shield (fantasy)
   │  ├─ FloatingXp.jsx
   │  └─ ScreenTransition.jsx # fades + .screen-enter wrapper
   ├─ fx/                     # purely visual layers
   │  ├─ AppBackground.jsx    # gradient + ::before motes
   │  ├─ Scanlines.jsx
   │  ├─ FantasyFX.jsx        # petals + embers + runes + fog + lightning + vines
   │  └─ SpellCircle.jsx      # behind-avatar rune ring
   ├─ characters/
   │  ├─ RaceGlyph.jsx        # SVG glyph used in lists
   │  ├─ RaceCharacter.jsx    # delegates to ClassViewer3D in fantasy
   │  └─ ClassViewer3D.jsx    # three.js stylized class — 9 classes
   ├─ cinematics/
   │  ├─ LevelUpCinematic.jsx
   │  ├─ QuestReward.jsx
   │  ├─ SwitchCinematic.jsx  # avatar swap dissolve
   │  ├─ BossCinematic.jsx    # parallax SVG/CSS scenes (Iron Spire, Echo Chamber, Throne)
   │  └─ BossIntro.jsx        # heraldic-crest modal wrapping the scene
   ├─ screens/
   │  ├─ Dashboard.jsx
   │  ├─ Quests.jsx
   │  ├─ Workout.jsx
   │  ├─ Dungeons.jsx
   │  └─ Inventory.jsx
   ├─ shell/
   │  ├─ BottomNav.jsx
   │  ├─ TopHeader.jsx        # ASCEND title + avatar count badge
   │  └─ TweaksPanel.jsx
   └─ avatar/
      ├─ AvatarSwitcher.jsx
      └─ AvatarCreate.jsx     # 5-step wizard
```

### Why this layout?

- **`data/` is pure** — adding races, dungeons, programs is data-only; UI re-renders automatically.
- **`ui/` is dumb** — components take props, return markup; no game state.
- **`screens/` orchestrate** — pull from `GameContext`, compose `ui/` primitives.
- **`cinematics/` and `fx/` are isolated** — easy to disable/lazy-load on low-end devices.
- **`contexts/` are the only mutable surface** — predictable testing boundary.

---

## 4. Design System

### 4.1 Tokens (CSS custom properties on `:root` & `html[data-theme="fantasy"]`)

Cyber-arcane (default):
- `--bg` `#07070e` · `--panel` `#0d0f1e` · `--ink` `#e8ecff`
- `--cyan` `oklch(0.82 0.14 210)` · `--violet` `oklch(0.65 0.22 290)` · `--gold` `oklch(0.82 0.16 80)` · `--danger` `oklch(0.65 0.25 25)`
- Display: `Cinzel` · HUD: `JetBrains Mono` · Body: `Space Grotesk`

Verdant-grove:
- `--bg` `#0a1610` · `--panel` `#15281a` · `--ink` `#f5e9c1`
- `--cyan` `oklch(0.78 0.15 145)` (moss) · `--violet` `oklch(0.7 0.16 60)` (copper) · `--gold` `oklch(0.88 0.16 88)` · `--danger` `oklch(0.62 0.22 30)`
- Display: `Cinzel Decorative` · HUD: `Cinzel` · Body: `EB Garamond`

### 4.2 Animation library (all in `animations.css`)

| Name | Use |
| --- | --- |
| `screenEnter` (260ms) | every screen mount |
| `shimmer` (2.2s) | XP bar, hero CTAs |
| `pulseGlow` (2.4s) | active rank emblem |
| `ascend` / `rays` / `rune` | level-up cinematic |
| `xpTick` (1200ms) | floating "+XP" |
| `portalSpin` / `portalCounter` | dungeon gate rings |
| `flipIn` | loot card reveal |
| `leafFall` / `petalDrift` / `sparkRise` / `emberRise` | fantasy FX |
| `runeFloat` / `fogDrift` / `lightningStrike` / `vineDraw` / `cwSpin` | env layer |
| `charBob` / `charAuraPulse` / `charRuneSpin` / `charEyeFlicker` / `charDaggerL` / `charAxeSwing` / `charPlume` / `charHalo` / `charMonarchOrb` / etc. | per-class character flourishes |
| `bossEmber` / `echoRing` / `forgeFlicker` / `throneStrike` / `bossMoteFloat` / `parallaxMid` / `parallaxFront` | boss scenes |
| `petalFall` / `haloBreathe` / `goldenPulse` / `spinSlow` | fantasy level-up |

---

## 5. Milestones & Tasks

Each milestone produces a runnable, testable slice. Total target: **8 milestones**.

### Milestone 0 — Bootstrap

- **M0.1** `npm create vite` → React + JS scaffold.
- **M0.2** Add fonts via `index.html` `<link>` (Cinzel, Cinzel Decorative, Cormorant Garamond, EB Garamond, JetBrains Mono, Space Grotesk, Uncial Antiqua, MedievalSharp).
- **M0.3** Install `three`.
- **M0.4** Drop in `index.css` + `themes.css` + `animations.css` + `fx.css` (port from design `styles.css`).
- **M0.5** Mount `<App />` with `ThemeProvider` + `GameProvider`; render a stub `<IOSDevice>` to verify tokens.

**Exit:** dev server shows the obsidian background with violet/cyan glow inside the iOS frame.

### Milestone 1 — Design system primitives

- **M1.1** `Icon.jsx` — stroke icon factory + 18 named icons.
- **M1.2** `Panel`, `Corners`, `Divider`, `Glyph`, `StatBar`, `Segmented`, `Checkbox`, `Button` (primary/ghost/danger).
- **M1.3** `RankEmblem` with both renders (`HexRank` for cyber, `HeraldicShield` for fantasy) — selected via `useTheme()`.
- **M1.4** `FloatingXp` + `useFloatingXp()` hook.
- **M1.5** Snapshot all primitives in a hidden `/dev` route (DEV-only) to eyeball both themes side-by-side.

**Exit:** primitives gallery renders identically in both themes.

### Milestone 2 — App shell & routing

- **M2.1** `IOSDevice` frame component (status bar, notch, rounded corners, side rails) — reusable, accepts `width/height/dark`.
- **M2.2** `AppBackground`, `Scanlines` layers.
- **M2.3** `BottomNav` (5 tabs, theme-reactive labels).
- **M2.4** `TopHeader` (title, day counter, avatar-count chip).
- **M2.5** `useScreenRouter` hook: `home | quests | workout | dungeons | inventory`. Wrap each screen in `<ScreenTransition>` (`.screen-enter`).
- **M2.6** `TweaksPanel` (floating, dev-only) — theme swatches, difficulty seg, FX intensity, class & boss preview slots.

**Exit:** can navigate between five empty screens; tweaks panel toggles theme.

### Milestone 3 — Data layer & state

- **M3.1** Port `RANKS`, `RANK_COLORS`, `RACES`, `PROGRAMS`, `INITIAL_AVATARS`, `INITIAL_QUESTS`, `DUNGEONS`, `INVENTORY`, `LIVE_WORKOUT`, `themeCopy.lex()` to `data/*.js`.
- **M3.2** `GameContext` exposes: `avatars`, `activeId`, `quests`, `workout`, `modals` (`bossIntro`, `questReward`, `levelUp`, `switcherOpen`, `createOpen`, `switchCine`), and reducers (`completeQuest`, `gainXp`, `switchAvatar`, `createAvatar`, `setScreen`).
- **M3.3** Difficulty multipliers wired through context.
- **M3.4** Persist nothing in M3 (in-memory only); leave a `persistence` adapter seam (`localStorage` later).

**Exit:** dispatches mutate state; React DevTools shows correct context values.

### Milestone 4 — Screens

- **M4.1** `Dashboard` — hunter card (rank emblem + name + title + level), XP bar (shimmer), today's stats (streak, XP today, quests done), stat panel (5 attributes), quick actions (Start workout, Open last gate), avatar switch button.
- **M4.2** `Quests` — list of `INITIAL_QUESTS` w/ progress bars, difficulty pill, checkbox; tapping completes → triggers `QuestReward`.
- **M4.3** `Workout` — header w/ exit, `LIVE_WORKOUT` exercises, set rows (target / reps / weight / done toggle), per-set XP gain → spawns `FloatingXp`.
- **M4.4** `Dungeons` — three dungeon cards (boss name, tier badge, lore, HP, loot list, color-coded gate icon w/ portal-spin).
- **M4.5** `Inventory` — equipment grid (8 items), tier coloring, equipped state.

**Exit:** all five screens are functional with mock data.

### Milestone 5 — Cinematics

- **M5.1** `LevelUpCinematic` — cyber: rays + rune + ascend; fantasy: golden halo + petal fall + illuminated initial. Branch on `useTheme().fantasy`.
- **M5.2** `QuestReward` — cyber: HUD popup; fantasy: parchment scroll w/ corner leaves.
- **M5.3** `SwitchCinematic` — dissolving avatar swap (1.2s).
- **M5.4** `BossCinematic` — three parallax SVG scenes (`d1` Iron Spire forge w/ embers, `d2` Echo Chamber maw w/ rings, `d3` Obsidian Throne w/ lightning).
- **M5.5** `BossIntro` — heraldic-crest modal wrapping the scene + name reveal + "Step into the …" CTA.

**Exit:** triggering a quest, completing a level, swapping avatars, or entering a gate plays the right cinematic in the right theme.

### Milestone 6 — Avatars & onboarding

- **M6.1** `AvatarSwitcher` — overlay drawer listing all avatars; tap to switch (fires `SwitchCinematic`); plus "Awaken new" CTA.
- **M6.2** `AvatarCreate` — 5-step wizard:
  1. **Race** — pick from 5 (Mage, Assassin, Berserker, Paladin, Monarch) with stat preview.
  2. **Codex** — `RaceDetail` lore + skills + pros/cons.
  3. **Name** — text input + race character preview.
  4. **Frequency / Program** — choose 3/4/5 days × program.
  5. **Confirm / Awaken** — animated reveal with name.
- **M6.3** `RaceCharacter` — SVG illustrated character (animated bobs/auras), used in lists & onboarding.
- **M6.4** `ClassViewer3D` — three.js stylized character (9 classes — adds Ranger, Necromancer, Monk, Spellblade beyond the 5). Used in fantasy mode + Tweaks panel.

**Exit:** can create + switch avatars; creation flow plays smooth animations.

### Milestone 7 — Environmental FX & polish

- **M7.1** `FantasyFX` — falling petals, rising embers, drifting runes, fog blobs, lightning flash, corner vines, behind-avatar spell circle. Driven by `tweaks.fxIntensity`.
- **M7.2** Theme copy lexicon `lex()` applied across every label (Hunter→Champion, Gates→Glades, etc.).
- **M7.3** Polish pass — verify shadows, corner ticks, parchment textures.
- **M7.4** Performance — `prefers-reduced-motion` respected (cinematics shorten, FX pause).
- **M7.5** Accessibility — keyboard focus rings on interactive elements; aria-labels on icon buttons.

**Exit:** the app feels alive on idle; theme toggle is dramatic and complete.

---

## 6. Reusable Components & Design Patterns

### Component design principles

1. **One job per component.** `RankEmblem` only renders a rank; theme decides hex vs shield. `Panel` only frames children. No screen logic in primitives.
2. **Composition over configuration.** A `Panel` does not have `variant="dungeon"`; instead, dungeons compose `<Panel><DungeonHeader/>…</Panel>`.
3. **Theme via tokens, not props.** Components read `var(--cyan)` rather than receive a `color` prop, except where data overrides (rank emblem color from `RANK_COLORS`).
4. **Animations declared in CSS.** Components apply class names; no inline keyframes. Lets us swap engines (e.g., to Framer Motion) without rewriting components.
5. **Data is portable.** `RACES`, `DUNGEONS`, etc. are plain arrays. Adding a new race is one entry in `data/races.js` plus one glyph SVG and (optionally) one `ClassViewer3D` signature.

### Hooks

- `useTheme()` — `{ themeKey, theme, fantasy, lex(key) }`. Subscribes to `data-theme` mutations so non-React code (e.g., three.js) stays in sync.
- `useGame()` — typed selectors over `GameContext`.
- `useScreenRouter()` — `{ screen, setScreen, history }`.
- `useFloatingXp()` — fire-and-forget `spawn(amount, x, y)`.
- `useReducedMotion()` — guards cinematics.

### Patterns

- **Provider-Composition pattern:** `<ThemeProvider><GameProvider><App/></GameProvider></ThemeProvider>` — single root of truth, easy to swap.
- **Strategy pattern for theme variants:** `RankEmblem` and `LevelUpCinematic` take their *strategy* (cyber vs fantasy renderer) from theme. Adding a 3rd theme = add a strategy; no caller changes.
- **Adapter seam for persistence:** `GameContext` writes through `persistence.set/get`. Default = noop; can plug into `localStorage` or a backend.
- **Lazy-load heavy modules:** `ClassViewer3D` and `BossCinematic` are dynamic imports — fantasy theme triggers them; cyber stays light.

### Extensibility checklist (for the next contributor)

- **Add a race** → append to `data/races.js`, add glyph SVG to `RaceGlyph`, optionally add a class signature in `ClassViewer3D`.
- **Add a screen** → file under `screens/`, register id in `useScreenRouter`, add a `BottomNav` entry.
- **Add a theme** → append a `THEMES` entry, add a `html[data-theme="…"]` block in `themes.css`, optionally a strategy branch in `RankEmblem`/`LevelUpCinematic`.
- **Add a boss** → append to `data/dungeons.js`, optionally add a parallax scene to `BossCinematic`.

---

## 7. Animation Strategy

- **All visible motion is intentional.** Every pause, every tick, every screen transition has a defined keyframe; nothing is "left default."
- **Three motion tiers:**
  1. **Idle ambient** (always on) — XP shimmer, motes drift, petals/embers, portal counter-rotation. ~2-40s loops.
  2. **Reactive feedback** (200-260ms) — screen transitions, button press, checkbox flip, hover lift. Sharp, snappy.
  3. **Cinematic** (900-1600ms) — level-up rays, rune burst, boss intro parallax, switch dissolve. Reserved for "moments."
- **Reduced motion** kills tier 3 entirely, keeps tier 2 at half-duration, replaces tier 1 with static gradients.

---

## 8. Build & Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

### Dev affordances

- Tweaks panel always rendered in `import.meta.env.DEV`; gated off in prod.
- Test data: `INITIAL_AVATARS` is preloaded with `Kaelen Vhirst` (Berserker, Rank C, Lv 23, 47-day streak) so first paint is rich.

---

## 9. Out of scope (for v1)

- Backend / sync.
- Real workout-history tracking (`LIVE_WORKOUT` is a fixed sample).
- Push notifications, social/guild features.
- Native iOS shell (the iOS frame is purely visual; no Capacitor/Expo).

These all fit cleanly behind the existing seams (`persistence` adapter, `GameContext` actions) — by design.

---

## 10. Definition of Done

- All 5 screens render in both themes with no regressions.
- Toggling theme swaps colors, fonts, glyphs, copy, FX, and cinematics with zero flicker.
- Cinematics fire on the right triggers (quest complete → reward; XP cross 100 → level-up; gate tap → boss intro; avatar switch → dissolve).
- Tweaks panel can: change theme, change difficulty, preview any 3D class, preview any boss scene, scrub FX intensity.
- `npm run build` produces a deployable static bundle ≤ ~600 KB gzipped (three.js excluded — code-split).
- Lighthouse: Performance ≥ 85 on a mid-tier laptop; Accessibility ≥ 95.
