// SVG glyph used in race lists / cards.
export function RaceGlyph({ race, size = 80, color }) {
  const c = color || race.color;
  const glyphs = {
    mage: (
      <g>
        <path d="M50 10 L58 38 L86 42 L64 58 L72 86 L50 70 L28 86 L36 58 L14 42 L42 38 Z" />
        <circle cx="50" cy="50" r="6" fill={c} />
        <path d="M50 20 v-6 M50 80 v6 M20 50 h-6 M80 50 h6" strokeWidth="1" />
      </g>
    ),
    assassin: (
      <g>
        <path d="M50 8 L60 40 L90 50 L60 60 L50 92 L40 60 L10 50 L40 40 Z" />
        <path d="M50 8 L50 92" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="3" fill={c} />
      </g>
    ),
    berserker: (
      <g>
        <path d="M20 20 L80 20 L86 50 L80 80 L20 80 L14 50 Z" />
        <path d="M30 35 L50 55 L70 35 M30 65 L50 45 L70 65" />
        <circle cx="50" cy="50" r="4" fill={c} />
      </g>
    ),
    paladin: (
      <g>
        <path d="M50 10 L82 22 V50 C82 68 68 82 50 90 C32 82 18 68 18 50 V22 Z" />
        <path d="M50 28 V72 M36 50 H64" />
        <circle cx="50" cy="50" r="5" fill={c} />
      </g>
    ),
    monarch: (
      <g>
        <path d="M18 70 V30 L30 48 L42 20 L50 50 L58 20 L70 48 L82 30 V70 Z" />
        <path d="M18 78 H82" />
        <circle cx="30" cy="58" r="2.5" fill={c} />
        <circle cx="50" cy="58" r="2.5" fill={c} />
        <circle cx="70" cy="58" r="2.5" fill={c} />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={c}
         strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
         style={{ filter: `drop-shadow(0 0 12px ${c}66)` }}>
      {glyphs[race.glyph] || glyphs.paladin}
    </svg>
  );
}
