export function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
      <div className="hr-mystic" style={{ flex: 1 }} />
      {label && (
        <>
          <span className="hud" style={{ fontSize: 9, letterSpacing: '0.24em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>{label}</span>
          <div className="hr-mystic" style={{ flex: 1 }} />
        </>
      )}
    </div>
  );
}
