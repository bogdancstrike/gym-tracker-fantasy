export function HudHeader({ title, sub }) {
  return (
    <div style={{ padding: '0 20px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cyan)' }}>
        <span className="glyph" style={{ width: 10, height: 10 }} />
        <span className="hud" style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)' }}>{sub}</span>
      </div>
      <div className="mythic glow-text" style={{ fontSize: 28, fontWeight: 600, marginTop: 6, color: 'var(--ink)' }}>{title}</div>
    </div>
  );
}
