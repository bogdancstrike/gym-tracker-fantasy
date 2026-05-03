import { useMemo, useState } from 'react';
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
  const [programName, setProgramName] = useState('My Custom Program');
  const [programFreq, setProgramFreq] = useState(3);
  const [programBlurb, setProgramBlurb] = useState('A custom training split.');
  const [programDaysJson, setProgramDaysJson] = useState(JSON.stringify([
    {
      name: 'Day 1',
      focus: 'push',
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 8, lift: 'bench', intensity: 0.7 },
        { name: 'Overhead Press', sets: 3, reps: 8, lift: 'overhead', intensity: 0.6 }
      ]
    },
    {
      name: 'Day 2',
      focus: 'pull',
      exercises: [
        { name: 'Deadlift', sets: 3, reps: 5, lift: 'deadlift', intensity: 0.7 },
        { name: 'Barbell Row', sets: 3, reps: 10, lift: 'bench', intensity: 0.5 }
      ]
    },
    {
      name: 'Day 3',
      focus: 'legs',
      exercises: [
        { name: 'Squat', sets: 4, reps: 8, lift: 'squat', intensity: 0.7 },
        { name: 'Leg Curl', sets: 3, reps: 12, lift: 'deadlift', intensity: 0.3 }
      ]
    }
  ], null, 2));
  const [builderError, setBuilderError] = useState('');
  const [importText, setImportText] = useState('');

  const savedState = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return { error: 'Saved state could not be parsed.' };
    }
  }, [state.avatars, state.activeId, state.quests, state.inventory, state.difficulty]);

  const sourcePrograms = state.availablePrograms || PROGRAMS;
  const programRows = Object.entries(sourcePrograms).flatMap(([frequency, programs]) =>
    programs.map(program => ({ ...program, frequency }))
  );
  const groupedPrograms = [3, 4, 5].map(frequency => ({
    frequency,
    programs: (sourcePrograms[frequency] || []).map(program => ({ ...program, frequency })),
  }));

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
        <div style={{ display: 'grid', gap: 16 }}>
          {groupedPrograms.map(group => (
            <ProgramFlowChart key={`program-group-${group.frequency}`} programs={group.programs} frequency={group.frequency} />
          ))}
        </div>
      </Section>

      <Section title="Create Training Program">
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <Field label="Program name" value={programName} onChange={setProgramName} />
            <Field label="Days / week" type="number" value={programFreq} onChange={v => setProgramFreq(Number(v))} min="3" max="5" />
            <Field label="Description" value={programBlurb} onChange={setProgramBlurb} />
          </div>
          <textarea
            value={programDaysJson}
            onChange={e => setProgramDaysJson(e.target.value)}
            style={textAreaStyle}
          />
          {builderError && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{builderError}</div>}
          <button
            onClick={() => {
              try {
                const days = JSON.parse(programDaysJson);
                if (!Array.isArray(days) || days.length < 1) throw new Error('Days must be an array.');
                state.saveCustomProgram({
                  id: `custom-${Date.now()}`,
                  name: programName,
                  blurb: programBlurb,
                  frequency: programFreq,
                  tags: ['custom'],
                  days,
                });
                setBuilderError('');
              } catch (error) {
                setBuilderError(error.message || 'Invalid program JSON.');
              }
            }}
            style={adminButtonStyle}
          >
            Save custom program
          </button>
        </div>
      </Section>

      <Section title="Backup / Restore">
        <div style={{ display: 'grid', gap: 10 }}>
          <button
            style={adminButtonStyle}
            onClick={() => {
              const data = localStorage.getItem(STORAGE_KEY) || '{}';
              navigator.clipboard?.writeText(data);
              setImportText(data);
            }}
          >
            Copy current save JSON
          </button>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Paste exported save JSON here..."
            style={{ ...textAreaStyle, minHeight: 140 }}
          />
          <button
            style={adminButtonStyle}
            onClick={() => {
              try {
                state.importSaveData(JSON.parse(importText));
              } catch (error) {
                window.alert('Invalid save JSON.');
              }
            }}
          >
            Import save JSON
          </button>
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

function Field({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span className="hud" style={{ color: 'var(--ink-dim)', fontSize: 9 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        {...rest}
      />
    </label>
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

function ProgramDay({ day, dayIndex }) {
  const dayName = typeof day === 'string' ? day : day.name;
  const focus = typeof day === 'string' ? '' : day.focus;
  const exercises = Array.isArray(day?.exercises) ? day.exercises : [];

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 10,
      background: 'rgba(13,15,30,0.38)',
      padding: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', marginBottom: 8 }}>
        <div className="mythic" style={{ color: 'var(--ink)', fontSize: 14 }}>
          Day {dayIndex + 1} · {dayName}
        </div>
        {focus && (
          <div className="hud" style={{ color: 'var(--ink-dim)', fontSize: 9, textAlign: 'right' }}>
            {focus}
          </div>
        )}
      </div>
      {exercises.length > 0 ? (
        <div style={{ display: 'grid', gap: 6 }}>
          {exercises.map((exercise, exerciseIndex) => (
            <Row
              key={`${dayName}-${exercise.name || exerciseIndex}`}
              label={exercise.name}
              value={`${exercise.sets} sets × ${exercise.reps}${exercise.note ? ` · ${exercise.note}` : ''}${exercise.lift ? ` · scales from ${exercise.lift}` : ''}`}
            />
          ))}
        </div>
      ) : (
        <div style={{ color: 'var(--ink-dim)', fontSize: 12 }}>No exercises configured.</div>
      )}
    </div>
  );
}

function ProgramFlowChart({ programs, frequency }) {
  const chart = buildProgramSankey(programs);
  const width = 1180;
  const height = Math.max(520, Math.max(chart.programs.length, chart.days.length, chart.exercises.length) * 34 + 140);
  const columns = {
    program: { x: 42, nodeWidth: 210 },
    day: { x: 438, nodeWidth: 260 },
    exercise: { x: 862, nodeWidth: 260 },
  };
  const colors = ['#22d3ee', '#facc15', '#a78bfa', '#fb7185', '#34d399', '#f59e0b', '#60a5fa'];
  const maxValue = Math.max(1, ...chart.links.map(link => link.value));
  const nodeMeta = new Map();

  const positionNodes = (nodes, column, top = 112) => {
    const gap = Math.max(24, Math.min(42, (height - top - 44) / Math.max(1, nodes.length)));
    nodes.forEach((node, index) => {
      nodeMeta.set(node.id, {
        ...node,
        x: columns[column].x,
        y: top + index * gap,
        width: columns[column].nodeWidth,
        color: node.color || colors[index % colors.length],
      });
    });
  };

  positionNodes(chart.programs, 'program', 124);
  positionNodes(chart.days, 'day', 104);
  positionNodes(chart.exercises, 'exercise', 86);

  if (programs.length === 0) {
    return (
      <div style={{
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: 16,
        color: 'var(--ink-dim)',
        fontSize: 12,
        background: 'rgba(13,15,30,0.34)',
      }}>
        No {frequency} day programs configured.
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 12,
      background: 'rgba(0,0,0,0.22)',
      overflowX: 'auto',
      overflowY: 'hidden',
    }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label={`${frequency} day training split Sankey diagram`}>
        <title>{frequency} days per week training split architecture</title>
        <text x={width / 2} y="30" fill="var(--ink)" textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="inherit">
          {frequency}x/week Training Split Architecture
        </text>
        <text x={width / 2} y="52" fill="var(--ink-dim)" textAnchor="middle" fontSize="12" fontFamily="inherit">
          Volume Distribution · Total Prescribed Reps
        </text>
        <text x={columns.program.x} y="84" fill="var(--ink-dim)" fontSize="10" fontFamily="JetBrains Mono, monospace">PROGRAM</text>
        <text x={columns.day.x} y="84" fill="var(--ink-dim)" fontSize="10" fontFamily="JetBrains Mono, monospace">TRAINING DAY</text>
        <text x={columns.exercise.x} y="84" fill="var(--ink-dim)" fontSize="10" fontFamily="JetBrains Mono, monospace">EXERCISE</text>

        {chart.links.map((link, index) => {
          const source = nodeMeta.get(link.source);
          const target = nodeMeta.get(link.target);
          if (!source || !target) return null;
          const strokeWidth = 2 + (link.value / maxValue) * 18;
          const color = source.color;
          return (
            <g key={`${link.source}-${link.target}-${index}`}>
              <title>{source.label} -> {target.label}: {link.value} reps</title>
              <path
                d={`M ${source.x + source.width} ${source.y + 12} C ${source.x + source.width + 115} ${source.y + 12}, ${target.x - 115} ${target.y + 12}, ${target.x} ${target.y + 12}`}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeOpacity="0.26"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {[...chart.programs, ...chart.days, ...chart.exercises].map(node => {
          const meta = nodeMeta.get(node.id);
          if (!meta) return null;
          return (
            <g key={node.id}>
              <rect
                x={meta.x}
                y={meta.y}
                width={meta.width}
                height="24"
                rx="7"
                fill="rgba(13,15,30,0.88)"
                stroke={meta.color}
                strokeOpacity="0.75"
              />
              <text x={meta.x + 10} y={meta.y + 16} fill="var(--ink)" fontSize="11" fontFamily="inherit">
                {truncate(meta.label, meta.width > 240 ? 34 : 26)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function buildProgramSankey(programs) {
  const programNodes = [];
  const dayNodes = [];
  const exerciseMap = new Map();
  const links = [];
  const programColors = ['#f18bbf', '#0078D7', '#EA005E', '#3891A7', '#2BCC7F', '#8164A3'];

  programs.forEach((program, programIndex) => {
    const programId = `program:${program.id}`;
    const programColor = programColors[programIndex % programColors.length];
    programNodes.push({ id: programId, label: program.name, color: programColor });

    (program.days || []).forEach((day, dayIndex) => {
      const dayName = typeof day === 'string' ? day : day.name;
      const exercises = Array.isArray(day?.exercises) ? day.exercises : [];
      const dayId = `day:${program.id}:${dayIndex}`;
      const dayValue = exercises.reduce((sum, exercise) => sum + exerciseReps(exercise), 0);

      dayNodes.push({
        id: dayId,
        label: `${programCode(program.name)} Day ${dayIndex + 1}: ${dayName}`,
        color: programColor,
      });
      links.push({ source: programId, target: dayId, value: dayValue });

      exercises.forEach(exercise => {
        const exerciseId = `exercise:${exercise.name}`;
        if (!exerciseMap.has(exerciseId)) {
          exerciseMap.set(exerciseId, {
            id: exerciseId,
            label: exercise.name,
            color: exerciseColor(exercise.name),
          });
        }
        links.push({ source: dayId, target: exerciseId, value: exerciseReps(exercise) });
      });
    });
  });

  return {
    programs: programNodes,
    days: dayNodes,
    exercises: [...exerciseMap.values()].sort((a, b) => a.label.localeCompare(b.label)),
    links,
  };
}

function exerciseReps(exercise) {
  return Number(exercise?.sets || 0) * parseRepValue(exercise?.reps);
}

function parseRepValue(reps) {
  if (typeof reps === 'number') return reps;
  const matches = String(reps || '').match(/\d+/g);
  if (!matches?.length) return 0;
  const values = matches.map(Number);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function programCode(name = '') {
  const cleaned = String(name).replace(/[·/×+]/g, ' ');
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return words.map(word => word[0]).join('').toUpperCase();
  return words.slice(0, 3).map(word => word[0]).join('').toUpperCase();
}

function exerciseColor(name = '') {
  const n = name.toLowerCase();
  if (/squat|leg|lunge|calf|quad|hamstring/.test(n)) return '#2BCC7F';
  if (/bench|chest|press|fly|push-up|pushup/.test(n)) return '#00BCF2';
  if (/deadlift|hinge|thrust/.test(n)) return '#D13438';
  if (/row|pull|lat|back/.test(n)) return '#A5644E';
  if (/curl|triceps|skull|pressdown|arms/.test(n)) return '#EA005E';
  if (/overhead|shoulder|lateral|rear delt/.test(n)) return '#8164A3';
  if (/plank|carry|sprint|burpee|jump|bike/.test(n)) return '#f59e0b';
  return '#94a3b8';
}

function truncate(value = '', max = 40) {
  const text = String(value);
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
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

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 11px',
  borderRadius: 8,
  border: '1px solid var(--line)',
  background: 'rgba(13,15,30,0.55)',
  color: 'var(--ink)',
  outline: 'none',
};

const textAreaStyle = {
  width: '100%',
  minHeight: 280,
  boxSizing: 'border-box',
  padding: 12,
  borderRadius: 10,
  border: '1px solid var(--line)',
  background: 'rgba(0,0,0,0.24)',
  color: 'var(--ink)',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 12,
  lineHeight: 1.5,
  outline: 'none',
};

const adminButtonStyle = {
  justifySelf: 'start',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid var(--line)',
  background: 'color-mix(in oklab, var(--cyan) 14%, rgba(13,15,30,0.7))',
  color: 'var(--cyan)',
  cursor: 'pointer',
  fontFamily: 'var(--hud-font)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};
