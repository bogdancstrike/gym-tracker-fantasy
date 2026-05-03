import { useTheme } from '../contexts/ThemeContext.jsx';
import { Button } from '../ui/Button.jsx';

export function BossVictory({ xp, time, onDismiss }) {
  const { fantasy } = useTheme();

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
      display: 'grid', placeItems: 'center', padding: 20,
      animation: 'fadeIn 400ms ease-out both',
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'linear-gradient(180deg, rgba(20,22,51,0.6), rgba(10,11,28,0.8))',
        border: '1px solid var(--line)', borderRadius: 16,
        padding: 40, textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '80%',
          background: 'radial-gradient(circle, rgba(139, 148, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hud" style={{ fontSize: 12, letterSpacing: '0.3em', color: 'var(--cyan)', marginBottom: 12 }}>
            {fantasy ? 'GLADE CLEARED' : 'GATE SECURED'}
          </div>
          <div className="mythic glow-text" style={{ fontSize: 48, color: 'var(--ink)', marginBottom: 32 }}>
            VICTORY
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 12, padding: 24, marginBottom: 32,
            display: 'grid', gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="hud" style={{ fontSize: 11, color: 'var(--ink-dim)' }}>TIME ELAPSED</span>
              <span className="mythic" style={{ fontSize: 18, color: 'var(--ink)' }}>{time} MIN</span>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="hud" style={{ fontSize: 11, color: 'var(--ink-dim)' }}>{fantasy ? 'LUMEN GAINED' : 'XP GAINED'}</span>
              <span className="mythic glow-text" style={{ fontSize: 24, color: 'var(--cyan)' }}>+{xp}</span>
            </div>
          </div>

          <Button variant="primary" style={{ width: '100%', padding: '16px' }} onClick={onDismiss}>
            {fantasy ? 'Return to the Grove' : 'Extract from Gate'}
          </Button>
        </div>
      </div>
    </div>
  );
}