import { useMemo } from 'react';
import { useGame, STORAGE_KEY } from '../contexts/GameContext.jsx';
import { THEMES } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { QUEST_POOL } from '../data/quests.js';
import { DUNGEONS } from '../data/dungeons.js';
import { PROGRAMS } from '../data/programs.js';
import { INVENTORY, LOOT_POOL } from '../data/inventory.js';
import { RACES } from '../data/races.js';
import { RANK_BRACKETS, DIFFICULTY_MULTIPLIER } from '../data/ranks.js';
import { LIVE_WORKOUT } from '../data/workout.js';

const FORMULAS = [
  { name: 'Quest XP', value: 'round(quest.xp × difficultyMultiplier)' },
  { name: 'Set XP', value: '+40 XP whenever a set is marked complete' },
  { name: 'Workout Claim', value: '150 XP for normal training, 450 XP for boss training' },
  { name: 'Level Progress', value: 'xpPercent += amount / (xpMax / 100); level up when xpPercent >= 100' },
  { name: 'Level Up', value: 'new level = current level + 1; rank = rank bracket for new level; xp resets to 5%' },
  { name: 'Quest Loot Chance', value: '15% after completing a quest' },
  { name: 'Workout Loot Chance', value: '40% after normal training; guaranteed after boss training' },
  { name: 'Normal Loot Tier', value: '5% epic, 25% rare, 70% common' },
  { name: 'Boss Loot Tier', value: '15% legendary, 30% epic, 55% rare' },
  { name: 'Starter Workout Load', value: 'safe training load from profile lift baseline, usually 35-72% depending on exercise' },
];

const SAVED_FIELDS = [
  'avatars[].profile',
  'avatars[].program',
  'avatars[].workout',
  'avatars[].history',
  'avatars[].metrics',
  'avatars[].equippedIds',
  'avatars[].level/xp/rank/streak/bossWins/totalXpToday',
  'activeId',
  'quests',
  'difficulty',
  'inventory',
  'lastQuestRefresh',
  'schemaVersion',
  'theme: ascend_theme_v1',
];

export function Admin() {
  const state = useGame();

  const savedState = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return { error: 'Saved state could not be parsed.' };
    }
  }, [state.avatars, state.activeId, state.quests, state.inventory, state.difficulty]);

  const programRows = Object.entries(PROGRAMS).flatMap(([frequency, programs]) =>
    programs.map(program => ({ ...program, frequency }))
  );

  return (
    <div className="screen-enter" style={{ padding: '6px 16px 130px' }}>
      <Panel glass ticks style={{ padding: 24, marginTop: 8 }}>
        <div className="hud" style={{ fontSize: 10, letterSpacing: '0.28em', color: 'var(--cyan)' }}>
          ADMIN · SETTINGS · LOCAL STATE
        </div>
        <div className="mythic glow-text" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 6 }}>
          App Control Ledger
        </div>
        <div style={{ color: 'var(--ink-dim)', fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
          Static rules, generated content pools, formulas, and everything currently saved in browser storage.
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 16 }}>
        <Stat label="Quests" value={QUEST_POOL.length} />
        <Stat label="Paths / Dungeons" value={DUNGEONS.length} />
        <Stat label="Programs" value={programRows.length} />
        <Stat label="Droppable Items" value={LOOT_POOL.length} />
      </div>

      <Section title="LocalStorage Contract">
        <KeyValue label="Game key" value={STORAGE_KEY} />
        <KeyValue label="Theme key" value="ascend_theme_v1" />
        <div style={chipGrid}>
          {SAVED_FIELDS.map(field => <Chip key={field}>{field}</Chip>)}
        </div>
      </Section>

      <Section title="Formulas">
        <div style={{ display: 'grid', gap: 8 }}>
          {FORMULAS.map(formula => (
            <Row key={formula.name} label={formula.name} value={formula.value} />
          ))}
        </div>
      </Section>

      <Section title="Ranks & Difficulty">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <MiniTable rows={RANK_BRACKETS.map(r => [`Rank ${r.rank}`, `up to level ${r.maxLevel}`])} />
          <MiniTable rows={Object.entries(DIFFICULTY_MULTIPLIER).map(([k, v]) => [k, `${v}× quest XP`])} />
        </div>
      </Section>

      <Section title="Training Programs">
        <div style={{ display: 'grid', gap: 10 }}>
          {programRows.map(program => (
            <Panel key={program.id} style={{ padding: 14 }}>
              <div className="mythic" style={{ color: 'var(--ink)', fontSize: 16 }}>{program.name}</div>
              <div style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 4 }}>{program.frequency} days/week · {program.blurb}</div>
              <div style={chipGrid}>{program.days.map(day => <Chip key={day}>{day}</Chip>)}</div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="Paths / Boss Challenges">
        <div style={{ display: 'grid', gap: 10 }}>
          {DUNGEONS.map(dungeon => (
            <Panel key={dungeon.id} style={{ padding: 14 }}>
              <div className="mythic" style={{ color: 'var(--ink)', fontSize: 16 }}>{dungeon.name} · Tier {dungeon.tier}</div>
              <div style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 4 }}>{dungeon.boss} · {dungeon.xp} XP</div>
              <div style={chipGrid}>{dungeon.challenge.map(c => <Chip key={`${dungeon.id}-${c.ex}`}>{c.ex}: {c.sets} sets · {c.reps}</Chip>)}</div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="Droppable Items">
        <div style={chipGrid}>
          {LOOT_POOL.map(item => <Chip key={item.name}>{item.tier} · {item.name} · {item.slot}</Chip>)}
        </div>
      </Section>

      <Section title="Initial Content">
        <JsonBlock value={{ races: RACES, inventory: INVENTORY, liveWorkout: LIVE_WORKOUT, themes: THEMES }} />
      </Section>

      <Section title="Current Saved State">
        <JsonBlock value={savedState} />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <Panel glass style={{ padding: 20, marginTop: 16 }}>
      <div className="hud" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--cyan)', marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </Panel>
  );
}

function Stat({ label, value }) {
  return (
    <Panel style={{ padding: 16 }}>
      <div className="hud" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-dim)' }}>{label}</div>
      <div className="mythic" style={{ fontSize: 26, color: 'var(--ink)', marginTop: 4 }}>{value}</div>
    </Panel>
  );
}

function Row({ label, value }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(130px, 0.45fr) 1fr',
      gap: 12,
      padding: '10px 12px',
      border: '1px solid var(--line)',
      borderRadius: 8,
      background: 'rgba(13,15,30,0.45)',
    }}>
      <span className="hud" style={{ color: 'var(--ink-dim)', fontSize: 10 }}>{label}</span>
      <span style={{ color: 'var(--ink)', fontSize: 12, lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

function KeyValue({ label, value }) {
  return <Row label={label} value={value} />;
}

function MiniTable({ rows }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {rows.map(([label, value]) => <Row key={label} label={label} value={value} />)}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 9px',
      borderRadius: 8,
      border: '1px solid var(--line)',
      background: 'rgba(13,15,30,0.55)',
      color: 'var(--ink-dim)',
      fontSize: 11,
      lineHeight: 1.3,
    }}>
      {children}
    </span>
  );
}

function JsonBlock({ value }) {
  return (
    <pre style={{
      maxHeight: 420,
      overflow: 'auto',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      margin: 0,
      padding: 14,
      borderRadius: 10,
      border: '1px solid var(--line)',
      background: 'rgba(0,0,0,0.28)',
      color: 'var(--ink-dim)',
      fontSize: 11,
      lineHeight: 1.55,
    }}>
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

const chipGrid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 10,
};
