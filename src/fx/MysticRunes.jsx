import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export function MysticRunes() {
  const { fantasy } = useTheme();

  // Reduced to just 2 subtle runes for focus
  const runes = useMemo(() => [
    { id: 1, x: '12%', y: '18%', size: 100, glyph: 'ᚠ', delay: 0 },
    { id: 4, x: '88%', y: '82%', size: 140, glyph: 'ᚷ', delay: 4 },
  ], []);

  if (!fantasy) return null;

  return (
    <div className="mystic-runes-container" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      zIndex: 0,
    }}>
      {/* Distant Monolith - Much more subtle */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/assets/rune-monolith.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.12,
        filter: 'grayscale(1) brightness(0.4) blur(4px)',
        mixBlendMode: 'luminosity',
        zIndex: -2,
      }} />

      {/* Primary Magic Circle - Focused point of interest */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '65%',
        width: 700,
        height: 700,
        transform: 'translate(-50%, -50%)',
        opacity: 0.2,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: -1,
      }}>
        <img 
          src="/assets/magic-circle.png" 
          style={{ 
            width: '100%', height: '100%', 
            animation: 'cwSpin 180s linear infinite',
            filter: 'drop-shadow(0 0 12px var(--cyan))',
          }} 
        />
      </div>

      {/* Subtle floating runes */}
      {runes.map(r => (
        <div
          key={r.id}
          className="mystic-rune shimmer-text"
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            fontSize: r.size,
            fontFamily: 'serif',
            color: 'var(--cyan)',
            opacity: 0.25,
            filter: 'blur(1px) drop-shadow(0 0 15px var(--cyan))',
            transform: 'translate(-50%, -50%)',
            animation: `runeBreathe 12s ease-in-out infinite alternate`,
            animationDelay: `${r.delay}s`,
            userSelect: 'none',
            display: 'inline-block',
          }}
        >
          {r.glyph}
        </div>
      ))}
    </div>
  );
}
