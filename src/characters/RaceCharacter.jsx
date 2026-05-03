// SVG-illustrated character with idle bob + aura. In fantasy mode delegates to ClassViewer3D.
import { useTheme } from '../contexts/ThemeContext.jsx';
import { ClassViewer3D } from './ClassViewer3D.jsx';
import { RaceGlyph } from './RaceGlyph.jsx';

export function RaceCharacter({ race, size = 220 }) {
  const { fantasy } = useTheme();
  if (fantasy) {
    return <ClassViewer3D classId={race.id} size={size} showStage autoRotate />;
  }
  // Cyber: stylized SVG with aura ring
  return (
    <div style={{
      position: 'relative', width: size, height: size,
      display: 'grid', placeItems: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 60%, ${race.color}30, transparent 60%)`,
        animation: 'charAuraPulse 3s ease-in-out infinite',
        borderRadius: '50%',
      }} />
      <svg viewBox="0 0 200 200" width={size * 0.95} height={size * 0.95}
           style={{ position: 'relative', animation: 'charBob 3s ease-in-out infinite' }}>
        <defs>
          <radialGradient id={`grd-${race.id}`}>
            <stop offset="0"   stopColor={race.color}  stopOpacity="0.9" />
            <stop offset="1"   stopColor={race.color2} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {/* Body silhouette */}
        <path d="M100 30 L120 70 L140 90 L130 130 L130 170 L100 165 L70 170 L70 130 L60 90 L80 70 Z"
              fill={`url(#grd-${race.id})`} stroke={race.color} strokeWidth="1.5" />
        {/* Head */}
        <circle cx="100" cy="44" r="14" fill={race.color2} stroke={race.color} strokeWidth="1.2" />
        {/* Eye glow */}
        <circle cx="95"  cy="44" r="2" fill={race.color} style={{ animation: 'charEyeFlicker 4s infinite' }} />
        <circle cx="105" cy="44" r="2" fill={race.color} style={{ animation: 'charEyeFlicker 4s infinite' }} />

        {/* Glyph behind / runes */}
        <g style={{ transformOrigin: '100px 100px', animation: 'charRuneSpin 24s linear infinite' }} opacity="0.5">
          <circle cx="100" cy="100" r="78" fill="none" stroke={race.color} strokeWidth="0.5" strokeDasharray="3 4" />
          <circle cx="100" cy="100" r="65" fill="none" stroke={race.color2} strokeWidth="0.4" strokeDasharray="1 4" />
        </g>
      </svg>
      <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0.4 }}>
        <RaceGlyph race={race} size={36} />
      </div>
    </div>
  );
}
