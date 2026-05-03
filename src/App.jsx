import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { GameProvider, useGame } from './contexts/GameContext.jsx';
import { useTheme } from './contexts/ThemeContext.jsx';
import { AppBackground, Scanlines } from './fx/AppBackground.jsx';
import { FantasyFX } from './fx/FantasyFX.jsx';
import { TopHeader } from './shell/TopHeader.jsx';
import { BottomNav } from './shell/BottomNav.jsx';
import { Sidebar } from './shell/Sidebar.jsx';
import { Dashboard } from './screens/Dashboard.jsx';
import { Quests } from './screens/Quests.jsx';
import { Workout } from './screens/Workout.jsx';
import { Dungeons } from './screens/Dungeons.jsx';
import { Inventory } from './screens/Inventory.jsx';
import { BossIntro } from './cinematics/BossIntro.jsx';
import { QuestReward } from './cinematics/QuestReward.jsx';
import { LevelUpCinematic } from './cinematics/LevelUpCinematic.jsx';
import { SwitchCinematic } from './cinematics/SwitchCinematic.jsx';
import { AvatarSwitcher } from './avatar/AvatarSwitcher.jsx';
import { AvatarCreate } from './avatar/AvatarCreate.jsx';
import { useBreakpoint } from './hooks/useBreakpoint.js';

const SCREEN_MAP = {
  home: Dashboard,
  quests: Quests,
  workout: Workout,
  dungeons: Dungeons,
  inventory: Inventory,
};

function Overlays({ onWorkout }) {
  const {
    bossIntro, setBossIntro,
    questReward, setQuestReward,
    levelUp, setLevelUp,
    switcherOpen, setSwitcherOpen,
    createOpen, setCreateOpen,
    switchCine, setSwitchCine,
    createAvatar, setScreen,
  } = useGame();

  return (
    <>
      {bossIntro && (
        <BossIntro
          dungeon={bossIntro}
          onClose={() => setBossIntro(null)}
          onAccept={() => { setBossIntro(null); setScreen('workout'); }}
        />
      )}
      {questReward && (
        <QuestReward quest={questReward} onDismiss={() => setQuestReward(null)} />
      )}
      {levelUp && (
        <LevelUpCinematic {...levelUp} onDismiss={() => setLevelUp(null)} />
      )}
      {switcherOpen && (
        <AvatarSwitcher
          onClose={() => setSwitcherOpen(false)}
          onCreateNew={() => { setSwitcherOpen(false); setCreateOpen(true); }}
        />
      )}
      {createOpen && (
        <AvatarCreate onClose={() => setCreateOpen(false)} onCreated={createAvatar} />
      )}
      {switchCine && (
        <SwitchCinematic
          fromAvatar={switchCine.from}
          toAvatar={switchCine.to}
          onDone={() => setSwitchCine(null)}
        />
      )}
    </>
  );
}

function AppShell() {
  const [fxIntensity, setFxIntensity] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { avatars, activeAvatar, screen, setScreen, setSwitcherOpen } = useGame();
  const { fantasy } = useTheme();
  const { desktop } = useBreakpoint();

  const Screen = SCREEN_MAP[screen] || Dashboard;

  const isWidePage = screen === 'home' || screen === 'quests';

  if (desktop) {
    document.documentElement.setAttribute('data-layout', 'desktop');
    return (
      <>
        {/* Fixed full-viewport background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <AppBackground />
          <FantasyFX intensity={fxIntensity} />
          <Scanlines />
        </div>

        {/* Desktop grid layout */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: `${sidebarCollapsed ? 80 : 300}px 1fr`,
          height: '100dvh',
          transition: 'grid-template-columns 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

          <main style={{
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', position: 'relative',
          }}>
            {/* Top bar */}
            <div style={{
              padding: '16px 32px',
              borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(8,8,18,0.6)',
              backdropFilter: 'blur(32px)',
            }}>
              <div>
                <div className="hud" style={{ fontSize: 9, letterSpacing: '0.4em', color: 'var(--ink-dim)' }}>
                  {fantasy ? 'FANTASY' : 'SOLO LEVELING'} · ONLINE
                </div>
                <div className="mythic glow-text" style={{ fontSize: 24, color: 'var(--ink)' }}>ASCEND</div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="hud" style={{
                  fontSize: 10, letterSpacing: '0.22em', color: 'var(--cyan)',
                  padding: '5px 12px', borderRadius: 8,
                  border: '1px solid var(--line)', background: 'rgba(13,15,30,0.6)',
                }}>
                  DAY {activeAvatar.streak ?? 0}
                </div>
                <button
                  onClick={() => setSwitcherOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 14px', borderRadius: 10,
                    border: '1px solid color-mix(in oklab, var(--cyan) 50%, transparent)',
                    background: 'rgba(13,15,30,0.75)',
                    color: 'var(--cyan)', cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, letterSpacing: '0.1em',
                  }}
                >
                  ×{avatars.length} vessels
                </button>
              </div>
            </div>

            {/* Screen content - Adjusted for wide pages */}
            <div key={screen} style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{
                maxWidth: isWidePage ? '100%' : 1200, margin: '0 auto', width: '100%',
                padding: isWidePage ? '20px 60px' : '20px 40px',
                transition: 'padding 300ms ease',
              }}>
                <Screen />
              </div>
            </div>

            {/* Overlays inside main */}
            <Overlays />
          </main>
        </div>
      </>
    );
  }

  // Mobile layout
  document.documentElement.removeAttribute('data-layout');
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100dvh',
      overflow: 'hidden', background: 'var(--bg)',
    }}>
      <AppBackground />
      <FantasyFX intensity={fxIntensity} />
      <Scanlines />

      <TopHeader
        avatarCount={avatars.length}
        streak={activeAvatar.streak}
        onOpenSwitcher={() => setSwitcherOpen(true)}
      />

      <div key={screen} style={{
        position: 'absolute', top: 104, left: 0, right: 0, bottom: 0,
        overflowY: 'auto', WebkitOverflowScrolling: 'touch',
      }}>
        <Screen />
      </div>

      <BottomNav screen={screen} onNav={setScreen} />

      {/* Cinematic overlays */}
      <Overlays />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppShell />
      </GameProvider>
    </ThemeProvider>
  );
}
