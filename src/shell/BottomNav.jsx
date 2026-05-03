import { Icon } from '../ui/Icon.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export function BottomNav({ screen, onNav }) {
  const { fantasy } = useTheme();
  const items = fantasy ? [
    { id: 'home',      label: 'Champion', icon: Icon.home },
    { id: 'quests',    label: 'Path',     icon: Icon.scroll },
    { id: 'workout',   label: 'Train',    icon: Icon.sword },
    { id: 'history',   label: 'Log',      icon: Icon.book },
    { id: 'dungeons',  label: 'Glades',   icon: Icon.gate },
    { id: 'inventory', label: 'Hoard',    icon: Icon.chest },
    { id: 'admin',     label: 'Admin',    icon: Icon.settings },
  ] : [
    { id: 'home',      label: 'Hunter', icon: Icon.home },
    { id: 'quests',    label: 'Quests', icon: Icon.scroll },
    { id: 'workout',   label: 'Train',  icon: Icon.sword },
    { id: 'history',   label: 'Log',    icon: Icon.book },
    { id: 'dungeons',  label: 'Gates',  icon: Icon.gate },
    { id: 'inventory', label: 'Vault',  icon: Icon.chest },
    { id: 'admin',     label: 'Admin',  icon: Icon.settings },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      padding: '12px 14px 26px',
      background: 'linear-gradient(180deg, transparent, rgba(5,5,13,0.9) 30%)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
        background: 'rgba(13,15,30,0.85)',
        border: '1px solid var(--line)',
        borderRadius: 20, padding: 6,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}>
        {items.map(it => {
          const active = screen === it.id;
          const IconC = it.icon;
          return (
            <button key={it.id} className={`nav-btn ${active ? 'active' : ''}`} onClick={() => onNav(it.id)} style={{
              border: 'none', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '8px 4px', borderRadius: 14,
              color: active ? 'var(--cyan)' : 'var(--ink-dim)',
              position: 'relative',
            }}>
              <IconC size={18} style={{ position: 'relative', zIndex: 1 }} />
              <span style={{
                fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                position: 'relative', zIndex: 1,
              }}>{it.label}</span>
              {active && (
                <div className="nav-dot" style={{
                  width: 4, height: 4, borderRadius: '50%', background: 'var(--cyan)',
                  boxShadow: '0 0 8px var(--cyan)',
                  position: 'absolute', bottom: 2,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
