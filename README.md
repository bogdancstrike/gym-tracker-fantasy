# Ascend

**A local-first gym tracker wrapped in RPG progression.**

Ascend turns training into a game loop: create a character, pick a real training program, log sets in the gym, earn XP, complete daily quests, unlock loot, and watch your progress build into a long-running fitness profile.

It is built for lifters who want a tracker that feels motivating without losing the practical details that matter: programs, days, exercises, sets, reps, kilograms, bodyweight, workout history, and local persistence.

![Ascend dashboard preview](public/reference/pasted-1777796879257-0.png)

## Why Ascend?

Most gym trackers are useful but dry. Most gamified fitness apps are fun but too shallow for real lifting.

Ascend aims for the middle ground:

- **Real gym tracking:** log kilograms and reps per set.
- **Program-based training:** choose a 3, 4, or 5 day split such as Full Body, PPL, Upper/Lower, Bro Split, Arnold Split, Athletic Protocol, or Powerbuilding.
- **Character-based progression:** each character has its own profile, training program, workout state, metrics, history, XP, rank, inventory, and equipment.
- **Motivation layer:** daily quests, boss workouts, loot drops, ranks, attributes, and cinematic feedback.
- **Local-first storage:** the app saves state in browser localStorage, making it fast, private, and easy to run without a backend.

## Core Features

| Area | What it does |
| --- | --- |
| **Train** | Edit kilograms and reps per set, complete workouts, claim XP, and store workout history. |
| **Programs** | Pick full training plans by frequency: 3, 4, or 5 days per week. |
| **Characters** | Create multiple lifter profiles with bodyweight, training goal, experience, frequency, program, and starting lift baselines. |
| **Progression** | Earn XP from sets, workouts, quests, and boss challenges. Rank up from E to S. |
| **Quests** | Get randomized daily fitness quests across strength, endurance, mobility, recovery, and health. |
| **Dungeons / Bosses** | Start themed challenge workouts with exercise prescriptions and stronger rewards. |
| **Inventory** | Earn droppable items and equip gear that modifies character attributes. |
| **Metrics** | Track bodyweight, calories, workout frequency, and training history with charts. |
| **Admin** | Inspect app data: quests, paths, programs, loot, formulas, and saved localStorage state. |
| **Themes** | Switch between Solo-Leveling-inspired cyber arcane styling and high-fantasy verdant styling. |

## Product Direction

Ascend is evolving into a full gym tracker with a game layer, not just a themed habit app.

The intended workflow:

1. Create a character.
2. Enter realistic body and strength baselines.
3. Choose a training split.
4. Train from the generated workout plan.
5. Log actual kg and reps.
6. Review history and progress.
7. Use XP, records, quests, loot, and bosses as motivation to stay consistent.

## Screens

| Screen | Purpose |
| --- | --- |
| **Dashboard** | Character overview, rank, XP, attributes, metrics, and training charts. |
| **Train** | The actual workout logger. This is the core gym-tracker surface. |
| **Quests** | Daily side objectives for health, mobility, endurance, and strength. |
| **Dungeons** | Boss-style workouts and challenge sessions. |
| **Inventory** | Loot, equipment, and RPG stat modifiers. |
| **Admin** | Data browser for all configurable/static app systems and saved local state. |

## Local-First State

Ascend currently stores app state in browser localStorage.

Saved state includes:

- characters
- active character
- character profile details
- selected training program
- active workout
- workout history
- metrics
- inventory and equipped items
- quests
- difficulty
- last daily quest refresh
- selected theme

This makes the app easy to run locally and private by default. It also means clearing browser storage deletes progress unless export/import support is added.

## Tech Stack

- **React 18**
- **Vite**
- **Recharts**
- **Three.js**
- **Lucide React**
- **Vanilla CSS with custom theme variables and visual effects**
- **localStorage persistence**

## Getting Started

```bash
git clone https://github.com/yourusername/ascend.git
cd ascend
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

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
  screens/      Dashboard, Train, Quests, Dungeons, Inventory, Admin
  shell/        App navigation and layout
  ui/           Shared UI components
  fx/           Backgrounds and visual effects
```

## Roadmap

- [ ] Custom training program builder in Admin
- [ ] Program day rotation after workout completion
- [ ] Previous-session comparison inside Train
- [ ] Personal records for intensity and volume
- [ ] XP bonus and animation when setting records
- [ ] Exercise library with muscles, equipment, and substitutions
- [ ] Rest timer
- [ ] Import/export localStorage backup
- [ ] PWA install support
- [ ] Optional cloud sync

## Status

Ascend is under active development. The current app is playable and stateful locally, with the main foundation for a gym tracker already in place: character profiles, selectable training programs, editable set logging, quests, rewards, metrics, and local persistence.

## License

Add a license before publishing as a public repository.
