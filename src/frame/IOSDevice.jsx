// iOS phone shell — 402x874 by default. Visual-only frame.
export function IOSDevice({ children, width = 402, height = 874, dark = true }) {
  const bezel = dark ? '#000' : '#1a1a1f';
  return (
    <div style={{
      width: width + 16,
      height: height + 16,
      background: bezel,
      borderRadius: 56,
      padding: 8,
      position: 'relative',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 2px #1f1f24, 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width, height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: '#000',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 124, height: 36, borderRadius: 22, background: '#000',
          zIndex: 50, pointerEvents: 'none',
        }} />
        {/* Status bar text */}
        <div style={{
          position: 'absolute', top: 14, left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 30px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14, fontWeight: 600, color: '#fff',
          pointerEvents: 'none',
        }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <SignalDots /><Wifi /><Battery />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function SignalDots() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="#fff">
      <rect x="0"  y="6" width="3" height="4" rx="0.5" />
      <rect x="4"  y="4" width="3" height="6" rx="0.5" />
      <rect x="8"  y="2" width="3" height="8" rx="0.5" />
      <rect x="12" y="0" width="3" height="10" rx="0.5" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#fff" strokeWidth="1.2">
      <path d="M1 3 Q7 -1 13 3" />
      <path d="M3 5 Q7 2 11 5" />
      <path d="M5 7 Q7 6 9 7" />
      <circle cx="7" cy="9" r="0.7" fill="#fff" />
    </svg>
  );
}
function Battery() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="#fff" />
      <rect x="2" y="2" width="13" height="7" rx="1" fill="#fff" />
      <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.5" fill="#fff" />
    </svg>
  );
}
