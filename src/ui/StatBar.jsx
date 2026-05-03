export function StatBar({ value, max = 100, label, color = 'var(--cyan)' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="hud" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>{label}</span>
          <span className="hud" style={{ fontSize: 10, color: 'var(--ink)' }}>{value}</span>
        </div>
      )}
      <div className="stat-bar">
        <span style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, var(--violet))` }} />
      </div>
    </div>
  );
}
