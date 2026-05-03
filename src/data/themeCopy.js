// Phrase bank for fantasy ↔ cyber translation. lex(key, fantasy) returns the right wording.

const FANTASY = {
  HUNTER: 'CHAMPION',
  Hunter: 'Champion',
  hunter: 'champion',
  GATE: 'GLADE',
  Gate: 'Glade',
  gate: 'glade',
  GATES: 'GLADES',
  Gates: 'Glades',
  VAULT: 'HOARD',
  Vault: 'Hoard',
  TRAIN: 'FORGE',
  Train: 'Forge',
  QUEST: 'PATH',
  Quest: 'Path',
  QUESTS: 'PATHS',
  Quests: 'Paths',
  ATTRIBUTES: 'GIFTS',
  Attributes: 'Gifts',
  TIER: 'BOUGH',
  Tier: 'Bough',
  RANK: 'BOUGH',
  Rank: 'Bough',
  LEVEL: 'BLOOM',
  Level: 'Bloom',
  XP: 'lumen',
  SYSTEM: 'FANTASY',
  System: 'Fantasy',
  VESSEL: 'SOUL',
  Vessel: 'Soul',
  DORMANT: 'LISTENING',
  Dormant: 'Listening',
  'Enter the Gate': 'Walk Today\'s Path',
  'Start Workout': 'Walk Today\'s Path',
  'A new gate has opened.': 'A new glade has opened. The wood holds its breath.',
  'QUEST CLEARED': 'PATH WALKED',
  'RANK ASCENSION': 'NEW BOUGH RISES',
  'VESSEL TRANSITION': 'A NEW HEART TAKES THE PATH',
  BOUND: 'ENTRUSTED',
  '+3 UNSPENT': '+3 UNGRANTED',
  'AWAITING SUMMON': 'AWAITING THE CALL OF FANTASY',
};

export function lex(text, fantasy) {
  if (!fantasy) return text;
  return FANTASY[text] ?? text;
}

export const FANTASY_FLAVOR = [
  'The magic listens. Each rep echoes through the realms.',
  'A spectral mote drifts past — a benediction.',
  'Light through the void. Today, you walk further.',
  'The world remembers every path walked.',
  'Even rest is a kind of bloom.',
];

export const CYBER_FLAVOR = [
  'The system observes. A new threshold awaits.',
  'Compile your strength. Solo Leveling begins.',
  'Each set, a checksum.',
  'The gate hums — it knows you.',
  'Every rep, a ledger entry.',
];
