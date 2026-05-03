export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

export const RANK_BRACKETS = [
  { rank: 'E', maxLevel: 15 },
  { rank: 'D', maxLevel: 25 },
  { rank: 'C', maxLevel: 40 },
  { rank: 'B', maxLevel: 70 },
  { rank: 'A', maxLevel: 90 },
  { rank: 'S', maxLevel: 99 },
];

export const getRankForLevel = (level) => {
  for (const bracket of RANK_BRACKETS) {
    if (level <= bracket.maxLevel) return bracket.rank;
  }
  return 'S';
};

export const RANK_COLORS = {
  E:  { a: '#6b7280', b: '#374151', label: 'AWAKENED' },
  D:  { a: '#10b981', b: '#064e3b', label: 'ASCENDING' },
  C:  { a: '#06b6d4', b: '#0e4a5f', label: 'ADEPT' },
  B:  { a: '#3b82f6', b: '#1e3a8a', label: 'VETERAN' },
  A:  { a: '#a855f7', b: '#4c1d95', label: 'ELITE' },
  S:  { a: '#f59e0b', b: '#78350f', label: 'MONARCH' },
};

export const DIFFICULTY_MULTIPLIER = {
  easy: 0.7, normal: 1, hard: 1.35, nightmare: 1.8,
};
