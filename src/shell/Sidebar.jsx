import { useGame } from '../contexts/GameContext.jsx';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';
import { Icon } from '../ui/Icon.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { RaceGlyph } from '../characters/RaceGlyph.jsx';
import { RACES } from '../data/races.js';

/** @param {{ collapsed?: boolean, onToggle?: () => void }} props */
export function Sidebar({ collapsed = false, onToggle }) {
  const { activeAvatar, screen, setScreen, setSwitcherOpen } = useGame();
  const { fantasy, themeKey, setThemeKey } = useTheme();

  const race = RACES.find(r => r.id === activeAvatar.race);

  const navItems = fantasy ? [
    { id: 'home',      label: 'Champion', icon: Icon.home },
    { id: 'quests',    label: 'Path',     icon: Icon.scroll },
    { id: 'workout',   label: 'Train',    icon: Icon.sword },
    { id: 'dungeons',  label: 'Glades',   icon: Icon.gate },
    { id: 'inventory', label: 'Hoard',    icon: Icon.chest },
    { id: 'admin',     label: 'Admin',    icon: Icon.settings },
  ] : [
    { id: 'home',      label: 'Hunter',   icon: Icon.home },
    { id: 'quests',    label: 'Quests',   icon: Icon.scroll },
    { id: 'workout',   label: 'Train',    icon: Icon.sword },
    { id: 'dungeons',  label: 'Gates',    icon: Icon.gate },
    { id: 'inventory', label: 'Vault',    icon: Icon.chest },
    { id: 'admin',     label: 'Admin',    icon: Icon.settings },
  ];

  return (
    <aside style={{
      width: collapsed ? 80 : 300, height: '100dvh', overflow: 'hidden', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, rgba(10,10,24,0.98), rgba(5,5,10,0.99))',
      borderRight: '1px solid var(--line)',
      backdropFilter: 'blur(40px)',
      transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Logo & Toggle */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)', position: 'relative' }}>
        {!collapsed && (
          <div className="screen-enter">
            <div className="hud" style={{ fontSize: 9, letterSpacing: '0.4em', color: 'var(--ink-dim)', marginBottom: 4 }}>
              {fantasy ? 'FANTASY' : 'SOLO LEVELING'} · ONLINE
            </div>
            <div className="mythic glow-text" style={{ fontSize: 22, color: 'var(--ink)' }}>ASCEND</div>
          </div>
        )}
        <button 
          onClick={onToggle}
          style={{
            position: 'absolute', right: collapsed ? '50%' : 12, top: '50%',
            transform: `translate(${collapsed ? '50%' : '0'}, -50%)`,
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)',
            color: 'var(--ink)', width: 32, height: 32, borderRadius: 8,
            cursor: 'pointer', display: 'grid', placeItems: 'center',
            transition: 'all 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* Avatar mini card */}
      <button onClick={() => setSwitcherOpen(true)} style={{
        padding: collapsed ? '16px 0' : 16, borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 12,
        background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'background 160ms ease',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in oklab, var(--cyan) 5%, transparent)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {race && (
          <div style={{ flexShrink: 0 }}>
            <RaceGlyph race={race} size={32} />
          </div>
        )}
        {!collapsed && (
          <div style={{ minWidth: 0, flex: 1 }} className="screen-enter">
            <div style={{
              fontSize: 13, fontWeight: 600, color: 'var(--ink)',
              fontFamily: 'var(--display-font)', letterSpacing: '0.04em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {activeAvatar.name}
            </div>
            <div className="hud" style={{ fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.18em', marginTop: 2 }}>
              RANK {activeAvatar.rank} · LVL {activeAvatar.level}
            </div>
          </div>
        )}
        {!collapsed && (
          <div style={{ flexShrink: 0 }}>
            <RankEmblem rank={activeAvatar.rank} size={28} />
          </div>
        )}
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? '16px 8px' : '16px 10px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = screen === item.id;
          const IconC = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={[
                'sidebar-nav-item',
                active ? 'active' : '',
              ].filter(Boolean).join(' ')}
              title={collapsed ? item.label : ''}
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '12px 0' : '10px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', border: 'none', background: 'transparent',
                color: active ? 'var(--cyan)' : 'var(--ink-dim)',
                cursor: 'pointer', borderRadius: 8,
                transition: 'all 200ms',
                fontFamily: 'var(--hud-font)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em'
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <IconC size={18} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: collapsed ? '16px 8px' : 16, borderTop: '1px solid var(--line)' }}>
        {/* Streak chip */}
        {!collapsed && (
          <div className="hud screen-enter" style={{
            fontSize: 9, letterSpacing: '0.22em', color: 'var(--cyan)',
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid var(--line)', background: 'rgba(13,15,30,0.6)',
            display: 'inline-block', marginBottom: 10,
          }}>
            DAY {activeAvatar.streak ?? 0}
          </div>
        )}

        {/* Theme swatches */}
        <div style={{ display: 'flex', flexDirection: collapsed ? 'column' : 'row', gap: 6 }}>
          {[
            { key: 'cyber-arcane', label: collapsed ? 'L' : 'LEVELING' },
            { key: 'verdant-grove', label: collapsed ? 'F' : 'FANTASY' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setThemeKey(key)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 6, cursor: 'pointer',
                border: `1px solid ${themeKey === key ? 'var(--cyan)' : 'var(--line)'}`,
                background: themeKey === key
                  ? 'color-mix(in oklab, var(--cyan) 12%, transparent)'
                  : 'rgba(13,15,30,0.4)',
                color: themeKey === key ? 'var(--cyan)' : 'var(--ink-dim)',
                fontFamily: 'var(--hud-font)', fontSize: 9, letterSpacing: '0.18em',
                transition: 'all 160ms ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
