import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { Panel } from '../ui/Panel.jsx';
import { Button } from '../ui/Button.jsx';
import { StatBar } from '../ui/StatBar.jsx';
import { RaceGlyph } from '../characters/RaceGlyph.jsx';
import { RankEmblem } from '../ui/RankEmblem.jsx';
import { ClassViewer3D } from '../characters/ClassViewer3D.jsx';
import { RACES } from '../data/races.js';
import { PROGRAMS } from '../data/programs.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { getRankForLevel } from '../data/ranks.js';

const STEPS = ['race', 'codex', 'name', 'profile', 'program', 'confirm'];

const STEP_LABELS = {
  cyber: { race: 'Select Class', codex: 'Class Codex', name: 'Designate Vessel', profile: 'Body Baseline', program: 'Training Protocol', confirm: 'Initialize' },
  fantasy: { race: 'Choose Your Nature', codex: 'The Codex Speaks', name: 'Name Your Champion', profile: 'Mortal Frame', program: 'Walk a Path', confirm: 'Awaken' },
};

export function AvatarCreate({ onClose, onCreated }) {
  const { fantasy } = useTheme();
  const labels = fantasy ? STEP_LABELS.fantasy : STEP_LABELS.cyber;

  const [step, setStep] = useState(0);
  const [selectedRace, setSelectedRace] = useState(null);
  const [name, setName] = useState('');
  const [freq, setFreq] = useState(4);
  const [programId, setProgramId] = useState(PROGRAMS[4][0].id);
  const [profile, setProfile] = useState({
    sex: 'female',
    bodyweightKg: 65,
    experience: 'beginner',
    goal: 'strength',
    startingLifts: {
      bench: 35,
      squat: 45,
      deadlift: 60,
      overhead: 22.5,
    },
  });

  const programs = PROGRAMS[freq] || [];
  const selectedProgram = programs.find(p => p.id === programId) || programs[0];

  const canAdvance = () => {
    if (STEPS[step] === 'race') return !!selectedRace && !selectedRace.locked;
    if (STEPS[step] === 'name') return name.trim().length >= 2;
    if (STEPS[step] === 'profile') {
      return Number(profile.bodyweightKg) > 0
        && Number(profile.startingLifts.bench) > 0
        && Number(profile.startingLifts.squat) > 0
        && Number(profile.startingLifts.deadlift) > 0
        && Number(profile.startingLifts.overhead) > 0;
    }
    return true;
  };

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleCreate = () => {
    const prog = selectedProgram || programs[0];
    onCreated({
      id: `av-${Date.now()}`,
      race: selectedRace.id,
      name: name.trim(),
      title: selectedRace.tagline,
      rank: getRankForLevel(1),
      level: 1,
      xp: 0,
      xpMax: 1000,
      stats: { ...selectedRace.bias },
      streak: 0,
      totalXpToday: 0,
      program: { freq, id: prog.id },
      profile: {
        ...profile,
        bodyweightKg: Number(profile.bodyweightKg),
        splitStyle: prog.name,
        startingLifts: Object.fromEntries(
          Object.entries(profile.startingLifts).map(([key, value]) => [key, Number(value)])
        ),
      },
      active: false,
      equippedIds: [],
    });
  };

  const isRaceStep = STEPS[step] === 'race';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 93,
      background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
      display: 'grid', placeItems: 'center', padding: isRaceStep ? 0 : 20,
      animation: 'fadeIn 240ms ease-out both',
    }}>
      <div className="ascend" style={{ 
        width: '100%', 
        height: isRaceStep ? '100%' : 'auto',
        maxWidth: isRaceStep ? '100%' : 500, // Enlarge form
        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)' 
      }}>
        <Panel ticks={!isRaceStep} glass={!isRaceStep} style={{ 
          padding: isRaceStep ? 0 : 32, 
          overflow: 'hidden', 
          height: isRaceStep ? '100%' : 'auto',
          border: isRaceStep ? 'none' : '1px solid var(--line)',
          background: isRaceStep ? 'transparent' : undefined,
          backdropFilter: isRaceStep ? 'none' : undefined,
        }}>
          {/* Header */}
          {!isRaceStep && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div className="hud" style={{
                  fontSize: 11, letterSpacing: '0.3em',
                  color: 'var(--cyan)',
                }}>
                  {fantasy ? `❦ STEP ${step + 1} OF ${STEPS.length} ❦` : `⟡ STEP ${step + 1} / ${STEPS.length} ⟡`}
                </div>
                <div className="mythic glow-text" style={{ fontSize: 24, color: 'var(--ink)', marginTop: 8 }}>
                  {labels[STEPS[step]]}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)',
                  color: 'var(--ink-dim)', cursor: 'pointer',
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'grid', placeItems: 'center', fontSize: 20,
                }}
              >×</button>
            </div>
          )}

          {/* Progress bar */}
          {!isRaceStep && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 4, flex: 1, borderRadius: 2,
                  background: i <= step ? 'var(--cyan)' : 'var(--line)',
                  boxShadow: i <= step ? '0 0 10px var(--cyan)' : 'none',
                  transition: 'background 300ms',
                }} />
              ))}
            </div>
          )}

          {/* Step content */}
          <div style={{ 
            height: isRaceStep ? '100%' : 'auto',
            maxHeight: isRaceStep ? 'none' : 500, 
            overflowY: isRaceStep ? 'visible' : 'auto' 
          }}>
            {isRaceStep && (
              <RaceStep selectedRace={selectedRace} onSelect={setSelectedRace} fantasy={fantasy} onClose={onClose} onNext={next} />
            )}
            {!isRaceStep && (
              <div style={{ padding: 4 }}>
                {STEPS[step] === 'codex' && selectedRace && (
                  <CodexStep race={selectedRace} fantasy={fantasy} />
                )}
                {STEPS[step] === 'name' && (
                  <NameStep name={name} setName={setName} race={selectedRace} fantasy={fantasy} />
                )}
                {STEPS[step] === 'profile' && (
                  <ProfileStep profile={profile} setProfile={setProfile} fantasy={fantasy} />
                )}
                {STEPS[step] === 'program' && (
                  <ProgramStep
                    freq={freq} setFreq={f => { setFreq(f); setProgramId(PROGRAMS[f][0].id); }}
                    programId={programId} setProgramId={setProgramId}
                    programs={programs} fantasy={fantasy}
                  />
                )}
                {STEPS[step] === 'confirm' && (
                  <ConfirmStep
                    name={name} race={selectedRace}
                    program={selectedProgram} freq={freq} profile={profile} fantasy={fantasy}
                  />
                )}
              </div>
            )}
          </div>

          {/* Navigation (Standard) */}
          {!isRaceStep && (
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {step > 0 && (
                <Button variant="ghost" style={{ flex: 1, padding: '14px' }} onClick={back}>
                  {fantasy ? 'Turn Back' : 'Back'}
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  style={{ flex: step > 0 ? 2 : 1, padding: '14px' }}
                  onClick={next}
                  disabled={!canAdvance()}
                >
                  {fantasy ? 'Walk On →' : 'Continue →'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  style={{ flex: 2, padding: '16px', fontSize: 14 }}
                  onClick={handleCreate}
                >
                  {fantasy ? '❦ Awaken Champion' : '⟡ Create Vessel'}
                </Button>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function RaceStep({ selectedRace, onSelect, fantasy, onClose, onNext }) {
  const firstUnlocked = RACES.find(r => !r.locked) || RACES[0];
  const [hoveredRace, setHoveredRace] = useState(selectedRace || firstUnlocked);
  const { desktop } = useBreakpoint();
  const videoRef = useRef(null);

  // Video lifecycle handling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play might be blocked
        });
      }
    }
  }, [hoveredRace?.video]);

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#000',
      display: 'flex',
      flexDirection: desktop ? 'row' : 'column',
      overflow: 'hidden'
    }}>
      {/* Background Cinematic (Fullscreen Zoomed) */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 0,
        background: '#000'
      }}>
        {/* The Video/Image */}
        <div style={{ 
          position: 'absolute', 
          inset: 0,
          display: 'flex',
          pointerEvents: 'none'
        }}>
          {hoveredRace?.video ? (
            <video
              ref={videoRef}
              key={hoveredRace.video}
              src={hoveredRace.video}
              autoPlay loop muted playsInline
              style={{ 
                height: '100%', 
                width: '100%',
                objectFit: 'cover',
                objectPosition: desktop ? 'right center' : 'center center',
                opacity: 0.8,
                maskImage: desktop 
                  ? 'linear-gradient(to left, black 60%, transparent 100%)'
                  : 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: desktop 
                  ? 'linear-gradient(to left, black 60%, transparent 100%)'
                  : 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            />
          ) : hoveredRace?.image ? (
            <img
              src={hoveredRace.image}
              style={{ 
                height: '100%', 
                width: '100%',
                objectFit: 'cover',
                objectPosition: desktop ? 'right center' : 'center center',
                opacity: 0.6,
                maskImage: desktop 
                  ? 'linear-gradient(to left, black 60%, transparent 100%)'
                  : 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: desktop 
                  ? 'linear-gradient(to left, black 60%, transparent 100%)'
                  : 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            />
          ) : null}
        </div>

        {/* Ambient Glows */}
        <div style={{
          position: 'absolute', top: '50%', right: '10%',
          width: '500px', height: '500px',
          background: `radial-gradient(circle, ${hoveredRace?.color || 'var(--cyan)'}22 0%, transparent 70%)`,
          filter: 'blur(80px)',
          opacity: 0.4,
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* The Mastering Black Fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: desktop 
            ? 'linear-gradient(90deg, #000 0%, #000 20%, rgba(0,0,0,0.8) 35%, transparent 75%)'
            : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 30%, #000 60%, #000 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: desktop ? 32 : 16, right: desktop ? 32 : 16, zIndex: 50,
          background: 'rgba(0,0,0,0.4)', border: '1px solid var(--line)',
          color: 'var(--ink)', cursor: 'pointer',
          width: 44, height: 44, borderRadius: '50%',
          display: 'grid', placeItems: 'center', fontSize: 24,
          backdropFilter: 'blur(12px)',
          transition: 'all 200ms'
        }}
      >×</button>

      {/* UI Selection Layer */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: desktop ? 520 : '100%',
        height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: desktop ? '60px 80px' : '20px 20px',
        justifyContent: desktop ? 'center' : 'flex-end',
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto', maxWidth: 440 }}>
          <div className="hud" style={{ fontSize: 11, letterSpacing: '0.4em', color: 'var(--cyan)', marginBottom: 8 }}>
            {fantasy ? 'FANTASY' : 'SOLO LEVELING'} · INITIALIZING
          </div>
          <div className="mythic glow-text" style={{ fontSize: desktop ? 42 : 32, color: 'var(--ink)', marginBottom: 32 }}>
            {fantasy ? 'Choose Your Nature' : 'Select Class'}
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 12, 
            marginBottom: 32,
            maxHeight: desktop ? 'none' : '40vh',
            overflowY: 'auto',
            paddingRight: 4,
          }} className="no-scrollbar">
            {RACES.map(race => {
              const selected = selectedRace?.id === race.id;
              const isHovered = hoveredRace?.id === race.id;
              return (
                <button
                  key={race.id}
                  onClick={() => { if (!race.locked) onSelect(race); setHoveredRace(race); }}
                  onMouseEnter={() => desktop && setHoveredRace(race)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 8, textAlign: 'left',
                    border: `1.5px solid ${selected ? race.color : isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    background: selected
                      ? `color-mix(in oklab, ${race.color} 20%, rgba(0,0,0,0.8))`
                      : isHovered ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,20,0.4)',
                    cursor: race.locked ? 'not-allowed' : 'pointer',
                    opacity: race.locked ? 0.3 : 1,
                    color: 'inherit', width: '100%',
                    transition: 'all 240ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered && desktop ? 'translateX(12px)' : 'none',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                     <RaceGlyph race={race} size={desktop ? 48 : 40} />
                     {selected && (
                       <div style={{
                         position: 'absolute', inset: -5, borderRadius: '50%',
                         border: `2px solid ${race.color}`,
                         animation: 'pulse 2s infinite',
                       }} />
                     )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mythic" style={{ fontSize: 16, color: selected ? race.color : 'var(--ink)' }}>
                      {race.name}
                    </div>
                    <div className="hud" style={{ fontSize: 9, color: 'var(--ink-dim)', marginTop: 4, letterSpacing: '0.12em' }}>
                      {race.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            style={{ width: '100%', padding: '20px', fontSize: 14, fontWeight: 700 }}
            onClick={onNext}
            disabled={!selectedRace}
          >
            {fantasy ? 'EMBRACE NATURE' : 'INITIALIZE VESSEL'}
          </Button>
        </div>
      </div>

      {/* Details (Desktop Only - Floating Right) */}
      {desktop && hoveredRace && (
        <div style={{
          position: 'absolute', bottom: 80, right: 100, zIndex: 10,
          pointerEvents: 'none', textAlign: 'right', maxWidth: 440
        }}>
          <div key={hoveredRace.id} style={{ animation: 'slideUp 500ms cubic-bezier(0.4, 0, 0.2, 1) both' }}>
            <div className="hud" style={{ fontSize: 11, color: hoveredRace.color, marginBottom: 8, letterSpacing: '0.2em' }}>
              CLASS SPECIFICATION
            </div>
            <div className="mythic glow-text" style={{ fontSize: 56, color: 'var(--ink)', marginBottom: 20 }}>
              {hoveredRace.name.toUpperCase()}
            </div>
            <div style={{
              fontSize: 16, color: 'var(--ink-dim)', lineHeight: 1.7,
              fontStyle: 'italic', marginBottom: 40,
            }}>
              "{hoveredRace.lore}"
            </div>

            <div style={{ display: 'grid', gap: 14, width: 340, marginLeft: 'auto' }}>
              {Object.entries(hoveredRace.bias).map(([k, v]) => (
                <div key={k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="hud" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>{k}</span>
                    <span className="hud" style={{ fontSize: 10, color: hoveredRace.color }}>{v}%</span>
                  </div>
                  <div className="stat-bar" style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ width: `${v}%`, height: '100%', background: hoveredRace.color, boxShadow: `0 0 15px ${hoveredRace.color}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CodexStep({ race, fantasy }) {
  return (
    <div style={{ fontSize: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <RaceGlyph race={race} size={72} />
        <div>
          <div className="mythic" style={{ fontSize: 24, color: 'var(--ink)' }}>{race.name}</div>
          <div style={{ fontSize: 16, color: race.color, marginTop: 4, fontStyle: 'italic' }}>
            {race.tagline}
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.8,
        fontStyle: 'italic', marginBottom: 24,
        padding: '16px 20px', borderRadius: 12,
        background: 'rgba(13,15,30,0.5)', border: '1px solid var(--line)',
      }}>
        "{race.lore}"
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{
          flex: 1, padding: '16px', borderRadius: 12,
          background: 'rgba(0,200,80,0.07)',
          border: '1px solid rgba(0,200,80,0.18)',
        }}>
          <div className="hud" style={{
            fontSize: 10, letterSpacing: '0.2em', color: '#4bcc88', marginBottom: 10,
          }}>
            {fantasy ? 'GIFTS' : 'STRENGTHS'}
          </div>
          {race.pros.map((p, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--ink-dim)', marginBottom: 6, lineHeight: 1.4 }}>
              · {p}
            </div>
          ))}
        </div>
        <div style={{
          flex: 1, padding: '16px', borderRadius: 12,
          background: 'rgba(200,50,50,0.07)',
          border: '1px solid rgba(200,50,50,0.18)',
        }}>
          <div className="hud" style={{
            fontSize: 10, letterSpacing: '0.2em', color: '#cc4444', marginBottom: 10,
          }}>
            {fantasy ? 'BURDENS' : 'WEAKNESSES'}
          </div>
          {race.cons.map((c, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--ink-dim)', marginBottom: 6, lineHeight: 1.4 }}>
              · {c}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(race.bias).map(([k, v]) => (
          <StatBar key={k} label={k} value={v} max={100} color={race.color} />
        ))}
      </div>
    </div>
  );
}

function NameStep({ name, setName, race, fantasy }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <RaceGlyph race={race} size={100} />
        <div style={{
          fontSize: 16, color: 'var(--ink-dim)', marginTop: 16,
          fontStyle: 'italic', lineHeight: 1.6,
        }}>
          {fantasy
            ? 'The realms await a name to remember you by.'
            : 'The system awaits a designation for this vessel.'}
        </div>
      </div>
      <label className="hud" style={{
        fontSize: 11, letterSpacing: '0.24em',
        color: 'var(--cyan)', display: 'block', marginBottom: 12,
      }}>
        {fantasy ? 'CHAMPION NAME' : 'VESSEL NAME'}
      </label>
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={fantasy ? 'e.g. Kaelen Vhirst…' : 'e.g. Hunter-01…'}
        maxLength={30}
        style={{
          width: '100%', padding: '16px 20px',
          background: 'rgba(13,15,30,0.7)',
          border: '1px solid var(--line)',
          borderRadius: 12, color: 'var(--ink)',
          fontFamily: fantasy ? 'EB Garamond, Georgia, serif' : 'Space Grotesk, sans-serif',
          fontSize: 20, outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 200ms',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
      />
      {name.trim().length > 0 && name.trim().length < 2 && (
        <div style={{ fontSize: 10, color: 'oklch(0.7 0.2 25)', marginTop: 6 }}>
          {fantasy ? 'The realms need at least two letters.' : 'Name must be at least 2 characters.'}
        </div>
      )}
    </div>
  );
}

function ProfileStep({ profile, setProfile, fantasy }) {
  const update = (patch) => setProfile(prev => ({ ...prev, ...patch }));
  const updateLift = (key, value) => setProfile(prev => ({
    ...prev,
    startingLifts: { ...prev.startingLifts, [key]: value },
  }));

  return (
    <div>
      <div style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: 18 }}>
        {fantasy
          ? 'Set the body you are actually training. The first path will scale from these numbers.'
          : 'Set realistic training baselines. Workouts will be generated from this profile.'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <Field label="Profile">
          <select value={profile.sex} onChange={e => update({ sex: e.target.value })} style={fieldStyle}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="not-specified">Prefer not to say</option>
          </select>
        </Field>
        <Field label="Bodyweight KG">
          <input type="number" min="30" max="250" step="0.1" value={profile.bodyweightKg} onChange={e => update({ bodyweightKg: e.target.value })} style={fieldStyle} />
        </Field>
        <Field label="Experience">
          <select value={profile.experience} onChange={e => update({ experience: e.target.value })} style={fieldStyle}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
        <Field label="Goal">
          <select value={profile.goal} onChange={e => update({ goal: e.target.value })} style={fieldStyle}>
            <option value="strength">Strength</option>
            <option value="hypertrophy">Hypertrophy</option>
            <option value="fat-loss">Fat loss</option>
            <option value="conditioning">Conditioning</option>
          </select>
        </Field>
      </div>

      <div className="hud" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--cyan)', margin: '22px 0 12px' }}>
        STARTING LIFTS · KG
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {[
          ['bench', 'Chest / Bench'],
          ['squat', 'Squat'],
          ['deadlift', 'Deadlift'],
          ['overhead', 'Overhead'],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              type="number"
              min="2.5"
              max="400"
              step="2.5"
              value={profile.startingLifts[key]}
              onChange={e => updateLift(key, e.target.value)}
              style={fieldStyle}
            />
          </Field>
        ))}
      </div>
    </div>
  );
}

function ProgramStep({ freq, setFreq, programId, setProgramId, programs, fantasy }) {
  return (
    <div>
      <div className="hud" style={{
        fontSize: 11, letterSpacing: '0.24em',
        color: 'var(--cyan)', marginBottom: 16,
      }}>
        {fantasy ? 'DAYS PER CYCLE' : 'TRAINING DAYS / WEEK'}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[3, 4, 5].map(d => (
          <button
            key={d}
            onClick={() => setFreq(d)}
            style={{
              flex: 1, padding: '16px 4px', borderRadius: 12,
              border: `1.5px solid ${freq === d ? 'var(--cyan)' : 'var(--line)'}`,
              background: freq === d
                ? 'color-mix(in oklab, var(--cyan) 14%, transparent)'
                : 'rgba(13,15,30,0.5)',
              color: freq === d ? 'var(--cyan)' : 'var(--ink-dim)',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 24, fontWeight: 700,
              transition: 'all 180ms',
            }}
          >{d}×</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {programs.map(p => {
          const selected = programId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setProgramId(p.id)}
              style={{
                padding: '16px 20px', borderRadius: 12, textAlign: 'left',
                border: `1.5px solid ${selected ? 'var(--cyan)' : 'var(--line)'}`,
                background: selected
                  ? 'color-mix(in oklab, var(--cyan) 10%, transparent)'
                  : 'rgba(13,15,30,0.5)',
                cursor: 'pointer', color: 'inherit', width: '100%',
                transition: 'all 180ms',
              }}
            >
              <div className="mythic" style={{ fontSize: 16, color: 'var(--ink)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 4 }}>{p.blurb}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmStep({ name, race, program, freq, profile, fantasy }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ margin: '8px 0 24px' }}>
        <RaceGlyph race={race} size={120} />
      </div>
      <div className="mythic glow-text" style={{ fontSize: 32, color: 'var(--ink)' }}>
        {name}
      </div>
      <div style={{ fontSize: 16, color: race.color, marginTop: 8, fontStyle: 'italic' }}>
        {race.tagline}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <RankEmblem rank="E" size={72} />
      </div>
      <div style={{
        marginTop: 24, padding: '20px 24px', borderRadius: 14,
        background: 'rgba(13,15,30,0.6)', border: '1px solid var(--line)',
        textAlign: 'left',
      }}>
        <Row label={fantasy ? 'Nature' : 'Class'} value={race.name} />
        <Row label={fantasy ? 'Path' : 'Program'} value={program?.name} />
        <Row label={fantasy ? 'Cycle' : 'Frequency'} value={`${freq}× per week`} />
        <Row label="Bodyweight" value={`${profile.bodyweightKg}kg`} />
        <Row label="Bench baseline" value={`${profile.startingLifts.bench}kg`} last />
      </div>
      <div style={{
        marginTop: 12, fontSize: 12, color: 'var(--ink-dim)',
        lineHeight: 1.7, fontStyle: 'italic',
      }}>
        {fantasy
          ? 'The world will remember every step. Begin when you are ready.'
          : 'Hunter profile initialized. Awaiting gate breach.'}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 7 }}>
      <span className="hud" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-dim)' }}>{label}</span>
      {children}
    </label>
  );
}

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 12px',
  background: 'rgba(13,15,30,0.7)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  color: 'var(--ink)',
  fontFamily: 'var(--body-font)',
  fontSize: 14,
  outline: 'none',
};

function Row({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      paddingBottom: last ? 0 : 10, marginBottom: last ? 0 : 10,
      borderBottom: last ? 'none' : '1px solid var(--line)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--ink)' }}>{value}</span>
    </div>
  );
}
