export const INVENTORY = [
  { id: 'i1', name: 'Gauntlets of Grip',     tier: 'rare',      slot: 'hands',    desc: '+2 STR on pulling motions',                  equipped:  true, icon: 'gauntlet', stats: { STR: 2 } },
  { id: 'i2', name: 'Rune of Endurance',     tier: 'rare',      slot: 'rune',     desc: '+8% stamina recovery',                       equipped:  true, icon: 'rune',     stats: { END: 3 } },
  { id: 'i3', name: 'Phantom Bounding',      tier: 'epic',      slot: 'feet',     desc: '+3 AGI, silence on landing',                 equipped: false, icon: 'boots',    stats: { AGI: 3 } },
  { id: 'i4', name: 'Sigil of the First Dawn', tier: 'epic',    slot: 'sigil',    desc: 'Double XP on first quest of the day',        equipped:  true, icon: 'sigil',    stats: { VIT: 2, INT: 2 } },
  { id: 'i5', name: 'Crown of the Unbroken', tier: 'legendary', slot: 'head',     desc: 'Resurrect once per dungeon',                 equipped: false, icon: 'crown',    stats: { VIT: 5, STR: 2 } },
  { id: 'i6', name: 'Whetstone Fragment',    tier: 'common',    slot: 'material', desc: 'Crafting material ×3',                       equipped: false, icon: 'fragment', stats: {} },
  { id: 'i7', name: 'Leviathan Lungs',       tier: 'legendary', slot: 'core',     desc: '+5 END, +10% VO2 ceiling',                   equipped: false, icon: 'lungs',    stats: { END: 5 } },
  { id: 'i8', name: 'Shadow Weight',         tier: 'epic',      slot: 'material', desc: 'Fused to your training. Permanent.',         equipped:  true, icon: 'weight',   stats: { STR: 1, END: 1, VIT: 1 } },
];

export const TIER_COLOR = {
  common:    { a: '#8a8fb8',                 b: '#2a2d4a',                 text: 'Common'    },
  rare:      { a: 'oklch(0.75 0.14 220)',   b: 'oklch(0.35 0.14 220)',   text: 'Rare'      },
  epic:      { a: 'oklch(0.68 0.22 290)',   b: 'oklch(0.35 0.18 290)',   text: 'Epic'      },
  legendary: { a: 'oklch(0.82 0.16 80)',    b: 'oklch(0.45 0.14 60)',    text: 'Legendary' },
};

export const LOOT_POOL = [
  { name: 'Ancient Wrist-Wraps', tier: 'common', slot: 'hands', stats: { STR: 1 } },
  { name: 'Broken Chain Link', tier: 'common', slot: 'material', stats: {} },
  { name: 'Obsidian Plate', tier: 'rare', slot: 'chest', stats: { VIT: 3 } },
  { name: 'Swift-Step Sandal', tier: 'rare', slot: 'feet', stats: { AGI: 2 } },
  { name: 'Arcane Band', tier: 'rare', slot: 'finger', stats: { INT: 3 } },
  { name: 'Dragonheart Core', tier: 'epic', slot: 'core', stats: { VIT: 4, STR: 1 } },
  { name: 'Void-Touched Shard', tier: 'epic', slot: 'rune', stats: { INT: 4 } },
  { name: 'Monarch\'s Mantle', tier: 'legendary', slot: 'chest', stats: { VIT: 6, STR: 3, AGI: 2 } },
];

export const TIER_VALUE = {
  common: { salvage: 10, buy: 35 },
  rare: { salvage: 35, buy: 110 },
  epic: { salvage: 90, buy: 280 },
  legendary: { salvage: 220, buy: 700 },
};

export function itemSalvageValue(item) {
  return TIER_VALUE[item?.tier]?.salvage || 10;
}

export function itemBuyValue(item) {
  return TIER_VALUE[item?.tier]?.buy || 35;
}
