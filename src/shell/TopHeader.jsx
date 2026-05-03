import { Icon } from '../ui/Icon.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export function TopHeader({ avatarCount, streak, onOpenSwitcher }) {
  const { fantasy, lex } = useTheme();
  return (
    <div style={{
      position: 'absolute', top: 54, left: 0, right: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 18px 8px', zIndex: 5,
    }}>
      <div>
        <div className="hud" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--ink-dim)' }}>
          {fantasy ? 'FANTASY · LISTENING' : 'SOLO LEVELING · ONLINE'}
        </div>
        <div className="mythic glow-text" style={{ fontSize: 18, color: 'var(--ink)', marginTop: 2 }}>
          ASCEND
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="hud" style={{
          fontSize: 9, letterSpacing: '0.18em', color: 'var(--cyan)',
          padding: '4px 8px', borderRadius: 6,
          border: '1px solid var(--line)', background: 'rgba(13,15,30,0.6)',
        }}>
          DAY {streak ?? 47}
        </div>
        <button onClick={onOpenSwitcher}
          aria-label="Switch hunter"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 8,
            border: '1px solid color-mix(in oklab, var(--cyan) 50%, transparent)',
            background: 'rgba(13,15,30,0.75)',
            color: 'var(--cyan)', cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, letterSpacing: '0.1em',
          }}>
          <Icon.users size={13} />
          <span>×{avatarCount}</span>
        </button>
      </div>
    </div>
  );
}
