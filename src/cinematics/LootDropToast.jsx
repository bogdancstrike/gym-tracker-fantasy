import { TIER_COLOR } from '../data/inventory.js';

export function LootDropToast({ item, onDismiss }) {
  if (!item) return null;
  const tier = TIER_COLOR[item.tier] || TIER_COLOR.common;

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        pointerEvents: 'auto',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.38)',
      }}
    >
      <div
        className="glass-fantasy"
        style={{
          width: 'min(360px, calc(100vw - 32px))',
          border: `1px solid ${tier.a}`,
          borderRadius: 18,
          padding: 22,
          textAlign: 'center',
          background: 'rgba(8,8,18,0.94)',
          boxShadow: `0 0 60px ${tier.a}55`,
          animation: 'loot-pop 1200ms cubic-bezier(0.2, 0.9, 0.2, 1)',
        }}
      >
        <style>
          {`
            @keyframes loot-pop {
              0% { transform: scale(0.72) translateY(30px); opacity: 0; filter: blur(10px); }
              45% { transform: scale(1.06) translateY(0); opacity: 1; filter: blur(0); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
        <div className="hud" style={{ color: tier.a, fontSize: 11, letterSpacing: '0.28em' }}>
          ITEM DROPPED
        </div>
        <div
          style={{
            width: 82,
            height: 82,
            margin: '18px auto 14px',
            borderRadius: 22,
            display: 'grid',
            placeItems: 'center',
            background: `linear-gradient(135deg, ${tier.a}, ${tier.b})`,
            color: '#fff',
            fontFamily: 'Cinzel, serif',
            fontSize: 34,
            fontWeight: 700,
            boxShadow: `0 0 34px ${tier.a}77`,
          }}
        >
          {item.name?.[0] || '?'}
        </div>
        <div className="mythic glow-text" style={{ color: 'var(--ink)', fontSize: 22 }}>
          {item.name}
        </div>
        <div style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 8 }}>
          {tier.text} · {item.slot}
        </div>
        <div className="hud" style={{ color: 'var(--ink-ghost)', fontSize: 10, marginTop: 16 }}>
          Tap to dismiss
        </div>
      </div>
    </div>
  );
}
