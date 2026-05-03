export function FloatingXp({ amount, x = 0, y = 0, id, label = '' }) {
  return (
    <div key={id} className="xp-tick hud" style={{
      position: 'absolute', left: x, top: y,
      fontSize: 18, fontWeight: 700,
      color: 'var(--cyan)',
      textShadow: '0 0 10px currentColor',
      pointerEvents: 'none', zIndex: 80,
    }}>
      {label ? `${label} · ` : ''}+{amount} XP
    </div>
  );
}
