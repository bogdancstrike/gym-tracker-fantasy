import { RANK_COLORS } from '../data/ranks.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

export function RankEmblem({ rank = 'E', size = 64, pulsing = false }) {
  const { fantasy } = useTheme();
  const c = RANK_COLORS[rank];
  if (fantasy) return <HeraldicShield rank={rank} size={size} c={c} pulsing={pulsing} />;
  return <HexEmblem rank={rank} size={size} c={c} pulsing={pulsing} />;
}

function HexEmblem({ rank, size, c, pulsing }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="hex" style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${c.a}, ${c.b})`,
        filter: 'blur(6px)', opacity: 0.6,
      }} />
      <div className="hex" style={{
        position: 'absolute', inset: 3,
        background: `linear-gradient(180deg, ${c.a}, ${c.b})`,
      }} />
      <div className="hex" style={{
        position: 'absolute', inset: 6,
        background: 'linear-gradient(180deg, #1a1e3a, #05050d)',
      }} />
      <div className="mythic" style={{
        position: 'relative', zIndex: 2,
        fontSize: size * 0.42, fontWeight: 700, color: c.a,
        textShadow: `0 0 12px ${c.a}`, letterSpacing: 0,
      }}>
        {rank}
      </div>
      {pulsing && (
        <div className="hex pulse-glow" style={{
          position: 'absolute', inset: -2,
          background: 'transparent',
          border: `1px solid ${c.a}`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

function HeraldicShield({ rank, size, c, pulsing }) {
  const gold = 'oklch(0.88 0.16 88)';
  const goldDeep = 'oklch(0.7 0.18 80)';
  return (
    <div style={{
      width: size, height: size * 1.12, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox="0 0 100 112" width={size} height={size * 1.12}
           style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${size * 0.12}px ${c.a})` }}>
        <defs>
          <linearGradient id={`shield-${rank}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor={c.a}     stopOpacity="0.85" />
            <stop offset="0.5" stopColor={c.b}     stopOpacity="0.95" />
            <stop offset="1"   stopColor="#0a1408" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`gold-${rank}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={gold} />
            <stop offset="1" stopColor={goldDeep} />
          </linearGradient>
          {pulsing && (
            <radialGradient id={`pulse-${rank}`}>
              <stop offset="0"   stopColor={c.a} stopOpacity="0" />
              <stop offset="0.7" stopColor={c.a} stopOpacity="0" />
              <stop offset="1"   stopColor={c.a} stopOpacity="0.5" />
            </radialGradient>
          )}
        </defs>
        <path d="M50 4 L92 14 L92 56 Q92 86 50 108 Q8 86 8 56 L8 14 Z"
              fill={`url(#shield-${rank})`} stroke={`url(#gold-${rank})`} strokeWidth="2.5" />
        <path d="M50 10 L86 19 L86 56 Q86 82 50 100 Q14 82 14 56 L14 19 Z"
              fill="none" stroke={`url(#gold-${rank})`} strokeWidth="0.6" opacity="0.7" />
        <path d="M50 8 L52 12 L56 12 L53 15 L54 19 L50 17 L46 19 L47 15 L44 12 L48 12 Z"
              fill={gold} opacity="0.9" />
        <path d="M14 28 Q18 30 22 28 M86 28 Q82 30 78 28" stroke={gold} strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M16 70 Q20 72 24 70 M84 70 Q80 72 76 70" stroke={gold} strokeWidth="0.8" fill="none" opacity="0.5" />
        <circle cx="50" cy="100" r="2" fill={gold} opacity="0.8" />
        {pulsing && <path d="M50 4 L92 14 L92 56 Q92 86 50 108 Q8 86 8 56 L8 14 Z" fill={`url(#pulse-${rank})`} />}
      </svg>
      <div style={{
        position: 'relative', zIndex: 2,
        fontFamily: 'Cinzel Decorative, serif',
        fontSize: size * 0.5, fontWeight: 900,
        color: gold,
        textShadow: `0 0 ${size * 0.18}px ${c.a}, 0 2px 0 #2a1a08, 0 0 4px rgba(0,0,0,0.6)`,
        marginTop: size * 0.06,
        letterSpacing: '-0.02em',
        WebkitTextStroke: `0.5px ${goldDeep}`,
      }}>
        {rank}
      </div>
    </div>
  );
}
