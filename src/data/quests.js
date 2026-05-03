export const QUEST_POOL = [
  { id: 'qp1', title: 'Morning Mobility', xp: 50, difficulty: 'easy', category: 'mobility' },
  { id: 'qp2', title: 'Strength Protocol', xp: 150, difficulty: 'normal', category: 'strength' },
  { id: 'qp3', title: 'Endurance Trial', xp: 200, difficulty: 'hard', category: 'endurance' },
  { id: 'qp4', title: 'Hydration Vow', xp: 40, difficulty: 'easy', category: 'health' },
  { id: 'qp5', title: 'Protein Intake Goal', xp: 60, difficulty: 'normal', category: 'health' },
  { id: 'qp6', title: 'Leg Day Ritual', xp: 180, difficulty: 'hard', category: 'strength' },
  { id: 'qp7', title: 'Core Stability', xp: 80, difficulty: 'normal', category: 'strength' },
  { id: 'qp8', title: 'Morning Run (3km)', xp: 120, difficulty: 'normal', category: 'endurance' },
  { id: 'qp9', title: 'Cold Shower Shock', xp: 70, difficulty: 'normal', category: 'recovery' },
  { id: 'qp10', title: 'Static Stretch (15m)', xp: 50, difficulty: 'easy', category: 'mobility' },
  { id: 'qp11', title: 'Deadlift Mastery', xp: 250, difficulty: 'nightmare', category: 'strength' },
  { id: 'qp12', title: 'Sprint Intervals', xp: 140, difficulty: 'hard', category: 'endurance' },
  { id: 'qp13', title: 'Posture Check', xp: 30, difficulty: 'easy', category: 'mobility' },
  { id: 'qp14', title: 'Evening Wind-down', xp: 40, difficulty: 'easy', category: 'recovery' },
  { id: 'qp15', title: 'Jump Rope Session', xp: 90, difficulty: 'normal', category: 'endurance' },
  // ... adding more variety programmatically in context or just here
];

// Generate more to reach 300+
for (let i = 16; i <= 310; i++) {
  const categories = ['strength', 'endurance', 'mobility', 'recovery', 'health'];
  const diffs = ['easy', 'normal', 'hard', 'nightmare'];
  const cat = categories[i % categories.length];
  const diff = diffs[i % diffs.length];
  QUEST_POOL.push({
    id: `qp${i}`,
    title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Task #${i}`,
    xp: diff === 'easy' ? 40 : diff === 'normal' ? 100 : diff === 'hard' ? 180 : 300,
    difficulty: diff,
    category: cat
  });
}

export const INITIAL_QUESTS = []; // Will be populated by context from pool
