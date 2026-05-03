import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { RACES } from '../data/races.js';
import { RaceGlyph } from '../characters/RaceGlyph.jsx';

export function SwitchCinematic({ fromAvatar, toAvatar, onDone }) {
  const { fantasy } = useTheme();
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);
  const fromRace = RACES.find(r => r.id === fromAvatar.race);
  const toRace   = RACES.find(r => r.id === toAvatar.race);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 95,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
      display: 'grid', placeItems: 'center',
      animation: 'fadeIn 220ms ease-out both',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="hud" style={{
          fontSize: 11, letterSpacing: '0.4em',
          color: fantasy ? 'oklch(0.88 0.16 88)' : 'var(--cyan)',
        }}>
          {fantasy ? '❦ A NEW HEART TAKES THE PATH ❦' : '⟡ VESSEL TRANSITION ⟡'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 22 }}>
          <div style={{ animation: 'fadeIn 600ms ease-out reverse both', opacity: 0.4 }}>
            <RaceGlyph race={fromRace} size={64} />
            <div style={{ fontSize: 11, marginTop: 6, color: 'var(--ink-dim)' }}>{fromAvatar.name}</div>
          </div>
          <div style={{ fontSize: 22, color: 'var(--cyan)' }}>→</div>
          <div style={{ animation: 'ascend 700ms ease-out both' }}>
            <RaceGlyph race={toRace} size={86} />
            <div className="mythic glow-text" style={{ fontSize: 14, marginTop: 6, color: 'var(--ink)' }}>{toAvatar.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
