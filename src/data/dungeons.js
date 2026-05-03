export const DUNGEONS = [
  {
    id: 'd1', name: 'The Iron Spire', tier: 'C',
    boss: 'Moltengrip, the Barbell Wraith',
    lore: 'A specter bound to forgotten weights. Its grip grows heavier with every set.',
    hp: 4800, xp: 420, loot: ['Gauntlets of Grip +2', 'Rune of Strength'],
    color: 'oklch(0.65 0.22 25)',
    challenge: [
      { ex: 'Bench Press',     sets: 5, reps: '5 × 80kg' },
      { ex: 'Overhead Press',  sets: 4, reps: '8 × 40kg' },
      { ex: 'Deadlift',        sets: 3, reps: '3 × 120kg' },
    ],
  },
  {
    id: 'd2', name: 'Echo Chamber', tier: 'B',
    boss: "Vhel'Reth, the Endless Echo",
    lore: 'Your own breath is the beast. Outlast the echo or be consumed.',
    hp: 7200, xp: 680, loot: ['Lungs of the Leviathan', 'Phantom Bounding'],
    color: 'oklch(0.7 0.2 180)',
    challenge: [
      { ex: 'Sprint Intervals', sets: 10, reps: '200m' },
      { ex: 'Burpees',          sets:  5, reps: '15 reps' },
      { ex: 'Jump Rope',        sets:  1, reps: '12 min' },
    ],
  },
  {
    id: 'd3', name: 'Obsidian Throne', tier: 'A',
    boss: 'Kharne the Unbroken',
    lore: 'Seated upon iron. None who enter have returned unchanged.',
    hp: 12000, xp: 1400, loot: ['Crown of the Unbroken', 'Mark of Ascension', 'Legendary Fragment'],
    color: 'oklch(0.65 0.22 290)',
    challenge: [
      { ex: 'Squat Marathon',   sets: 8, reps: '10 × 100kg' },
      { ex: 'Pull-ups',         sets: 6, reps: '10 weighted' },
      { ex: "Farmer's Carry",   sets: 4, reps: '40m × 2×32kg' },
    ],
  },
];
