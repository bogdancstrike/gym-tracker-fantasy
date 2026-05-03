# Ascend

**A local-first gym tracker with RPG progression, real training programs, and visual performance feedback.**

Ascend is built for lifters who want a practical workout logger that still feels rewarding to use. Create a character, choose a real 3, 4, or 5 day program, log kilograms and reps per set, compare against previous sessions, earn XP, unlock loot, and watch your training history become a long-running fitness profile.

No backend required. Your training state lives in browser `localStorage`.

## Why Ascend?

Most gym trackers are useful but flat. Most gamified fitness apps are fun but too shallow for serious lifting.

Ascend aims for the middle:

- **Real workout logging:** edit kilograms and reps per set directly in Train.
- **Program-based training:** choose complete 3, 4, or 5 day splits like PPL, Bro Split, Upper/Lower, Full Body, Arnold Split, Powerbuilding, and custom programs.
- **Natural progression:** see previous-session loads and get next-set suggestions based on recent performance.
- **Visual feedback:** radar, volume, adherence, estimated 1RM, exercise detail, and session comparison charts.
- **RPG motivation:** XP, ranks, records, quests, boss workouts, loot drops, character stats, and themed feedback.
- **Local-first privacy:** progress is stored locally and can be exported/imported from Admin.

## Core Features

| Area | What it does |
| --- | --- |
| **Champion** | Character overview, XP, attributes, records, metrics, adherence, muscle-group frequency, volume, and strength trend charts. |
| **Train** | Edit kg/reps per set, see last session values, follow suggested progression, mark sets done, end partial sessions, and compare progress after completion. |
| **Training Programs** | Choose built-in 3, 4, or 5 day programs, or create custom programs in Admin for reuse across characters. |
| **Characters** | Create multiple lifter profiles with bodyweight, sex, experience, goal, training frequency, program, and starting lift baselines. |
| **Exercise Detail** | Open any logged exercise to inspect best set, estimated 1RM, volume, history, and per-session sets. |
| **Records** | Track personal records by set volume and estimated intensity; record events grant bonus XP. |
| **Quests** | Complete daily side objectives for strength, endurance, mobility, recovery, and health. |
| **Dungeons / Bosses** | Run challenge workouts with stronger rewards and cinematic feedback. |
| **Inventory** | Earn droppable items and equip gear that modifies character attributes. |
| **Admin** | Inspect formulas, localStorage state, loot, quests, paths, and training programs with Sankey-style program flow charts. |
| **Themes** | Switch between a cyber arcane gym theme and a verdant fantasy theme. |

## Gym Tracker Workflow

1. Create a character.
2. Enter realistic bodyweight and starting lift baselines.
3. Choose one training program for that character.
4. Train from the scheduled day in the selected program.
5. Log actual kg and reps per set.
6. End the workout even if only part of it was completed.
7. Gain XP only for completed sets and completed workout volume.
8. Review progress against the last matching session.
9. Use records, charts, and suggestions to decide what to push next time.

## Screens

| Screen | Purpose |
| --- | --- |
| **Champion** | Main dashboard for character status, records, metrics, adherence, muscle frequency, volume, and estimated 1RM trends. |
| **Train** | The core workout logger for sets, kg, reps, rest timing, previous-session comparison, progression suggestions, and post-session dotted progress bars. |
| **Path / Quests** | Daily non-workout objectives that support consistency and general fitness. |
| **Glades / Gates** | Boss-style challenge sessions. |
| **Hoard / Vault** | Inventory, loot, and equipped stat modifiers. |
| **Log** | Workout history with clickable exercises. |
| **Admin** | Configuration and state browser for formulas, training programs, custom program creation, localStorage backup/restore, quests, loot, and app data. |

## Training Programs

Ascend supports complete programs by weekly frequency:

- **3 days/week:** full-body and compact strength templates.
- **4 days/week:** PPL variants, upper/lower, and balanced hypertrophy plans.
- **5 days/week:** bro split, Arnold-style, powerbuilding, and higher-frequency splits.

Each program contains:

- program name and tags
- day split
- day focus
- exercises
- sets
- reps
- lift baseline scaling
- intensity hints

Custom programs can be created in Admin and then selected when creating future characters.

## Progress Tracking

Ascend tracks both practical gym data and motivational game data:

- per-set kg and reps
- previous matching workout values
- workout volume
- exercise volume
- estimated 1RM
- set-volume records
- intensity records
- bodyweight
- calories
- adherence calendar
- volume by muscle group
- muscle group frequency radar
- session-over-session dotted progress bars

## Local-First State

Ascend stores app state in browser `localStorage`.

Saved state includes:

- characters and active character
- character profile details
- selected training program
- active workout
- program day index
- workout history
- completed and partial session data
- metrics
- records
- inventory and equipped items
- quests
- difficulty
- custom training programs
- last daily quest refresh
- selected theme

Admin includes backup/restore tools for the saved JSON. Clearing browser storage deletes progress unless you export it first.

## Tech Stack

- **React 18**
- **Vite**
- **Recharts**
- **Three.js**
- **Lucide React**
- **Vanilla CSS with custom theme variables**
- **localStorage persistence**

## Getting Started

```bash
git clone https://github.com/yourusername/ascend.git
cd ascend
npm install
npm run dev
```

Open the local Vite URL shown in your terminal.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  avatar/       Character creation and switching
  characters/   Character visuals and class presentation
  contexts/     Game and theme state
  data/         Programs, quests, dungeons, ranks, loot, workouts
  screens/      Champion, Train, Log, Exercise Detail, Admin, and game screens
  shell/        App navigation and layout
  ui/           Shared UI components
  fx/           Backgrounds and visual effects
```

## Current Status

Ascend is playable and stateful locally. The current foundation supports real workout logging, selectable and custom training programs, character-specific progress, previous-session comparison, partial workout completion, records, XP, charts, Admin inspection, and local backup/restore.

The next major upgrades would be:

- exercise library with substitutions
- PWA install support
- better mobile chart layouts
- optional cloud sync
- CSV export
- planned deloads and periodization blocks

## License

Add a license before publishing as a public repository.
