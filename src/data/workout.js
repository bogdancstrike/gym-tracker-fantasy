export const LIVE_WORKOUT = {
  name: 'The Iron Spire — Day 3',
  exercises: [
    { id: 'e1', name: 'Bench Press', sets: [
      { target: '80kg × 5', done:  true, reps: 5, weight:  80 },
      { target: '80kg × 5', done:  true, reps: 5, weight:  80 },
      { target: '80kg × 5', done: false, reps: 0, weight:  80 },
      { target: '80kg × 5', done: false, reps: 0, weight:  80 },
      { target: '80kg × 5', done: false, reps: 0, weight:  80 },
    ]},
    { id: 'e2', name: 'Overhead Press', sets: [
      { target: '40kg × 8', done: false, reps: 0, weight:  40 },
      { target: '40kg × 8', done: false, reps: 0, weight:  40 },
      { target: '40kg × 8', done: false, reps: 0, weight:  40 },
      { target: '40kg × 8', done: false, reps: 0, weight:  40 },
    ]},
    { id: 'e3', name: 'Deadlift', sets: [
      { target: '120kg × 3', done: false, reps: 0, weight: 120 },
      { target: '120kg × 3', done: false, reps: 0, weight: 120 },
      { target: '120kg × 3', done: false, reps: 0, weight: 120 },
    ]},
  ],
};

const DEFAULT_LIFTS = {
  bench: 35,
  squat: 45,
  deadlift: 60,
  overhead: 22.5,
};

const liftKeyByName = [
  { match: /bench|chest/i, key: 'bench' },
  { match: /squat|leg/i, key: 'squat' },
  { match: /deadlift|hinge/i, key: 'deadlift' },
  { match: /overhead|shoulder/i, key: 'overhead' },
];

export function formatSetTarget(weight, reps, fallback = '') {
  if (Number.isFinite(weight) && weight > 0 && Number.isFinite(reps) && reps > 0) {
    return `${weight}kg × ${reps}`;
  }
  if (Number.isFinite(reps) && reps > 0) return `${reps} reps`;
  return fallback || 'Set target';
}

export function createSets(count, { weight = 0, reps = 8, target } = {}) {
  return Array.from({ length: count }, () => ({
    target: target || formatSetTarget(weight, reps),
    plannedReps: reps,
    reps: reps,
    weight,
    done: false,
  }));
}

export function parseTrainingPrescription(raw) {
  const text = String(raw || '');
  const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*kg/i);
  const weight = weightMatch ? Number(weightMatch[1]) : 0;
  const beforeMultiply = text.match(/(\d+)\s*[×x]\s*\d+(?:\.\d+)?\s*kg/i);
  const afterMultiply = text.match(/\d+(?:\.\d+)?\s*kg\s*[×x]\s*(\d+)/i);
  const plainReps = text.match(/(\d+)\s*reps?/i);
  const reps = Number(beforeMultiply?.[1] || afterMultiply?.[1] || plainReps?.[1] || 8);
  return { weight, reps, target: text };
}

function getProfileLifts(profile = {}) {
  return {
    ...DEFAULT_LIFTS,
    ...(profile.startingLifts || {}),
  };
}

function getTrainingLoad(profile, liftKey, intensity = 0.72) {
  const lifts = getProfileLifts(profile);
  const base = Number(lifts[liftKey] || DEFAULT_LIFTS[liftKey] || 20);
  return Math.max(2.5, Math.round((base * intensity) / 2.5) * 2.5);
}

function liftKeyForExercise(name) {
  return liftKeyByName.find(({ match }) => match.test(name))?.key;
}

const SPLIT_EXERCISES = {
  push: [
    { name: 'Bench Press', lift: 'bench', sets: 3, reps: 8, intensity: 0.7 },
    { name: 'Overhead Press', lift: 'overhead', sets: 3, reps: 8, intensity: 0.68 },
    { name: 'Incline Dumbbell Press', lift: 'bench', sets: 3, reps: 10, intensity: 0.5 },
  ],
  pull: [
    { name: 'Deadlift', lift: 'deadlift', sets: 3, reps: 5, intensity: 0.72 },
    { name: 'Row', lift: 'bench', sets: 3, reps: 10, intensity: 0.45 },
    { name: 'Lat Pulldown', lift: 'bench', sets: 3, reps: 12, intensity: 0.4 },
  ],
  legs: [
    { name: 'Squat', lift: 'squat', sets: 4, reps: 8, intensity: 0.7 },
    { name: 'Romanian Deadlift', lift: 'deadlift', sets: 3, reps: 10, intensity: 0.55 },
    { name: 'Walking Lunge', lift: 'squat', sets: 3, reps: 12, intensity: 0.35 },
  ],
  upper: [
    { name: 'Bench Press', lift: 'bench', sets: 3, reps: 8, intensity: 0.68 },
    { name: 'Row', lift: 'bench', sets: 3, reps: 10, intensity: 0.45 },
    { name: 'Overhead Press', lift: 'overhead', sets: 3, reps: 8, intensity: 0.65 },
  ],
  lower: [
    { name: 'Squat', lift: 'squat', sets: 4, reps: 8, intensity: 0.68 },
    { name: 'Deadlift', lift: 'deadlift', sets: 3, reps: 5, intensity: 0.68 },
    { name: 'Leg Press', lift: 'squat', sets: 3, reps: 12, intensity: 0.8 },
  ],
  full: [
    { name: 'Squat', lift: 'squat', sets: 3, reps: 8, intensity: 0.65 },
    { name: 'Bench Press', lift: 'bench', sets: 3, reps: 8, intensity: 0.65 },
    { name: 'Deadlift', lift: 'deadlift', sets: 2, reps: 5, intensity: 0.68 },
  ],
  conditioning: [
    { name: 'Sprint Intervals', sets: 6, reps: 1, target: '200m' },
    { name: 'Burpees', sets: 4, reps: 12, target: '12 reps' },
    { name: 'Jump Rope', sets: 1, reps: 12, target: '12 min' },
  ],
};

function dayTypeForName(dayName = '') {
  const day = String(dayName).toLowerCase();
  if (day.includes('push') || day.includes('chest') || day.includes('shoulder') || day.includes('arms')) return 'push';
  if (day.includes('pull') || day.includes('back')) return 'pull';
  if (day.includes('leg') || day.includes('lower') || day.includes('squat')) return 'legs';
  if (day.includes('upper') || day.includes('bench')) return 'upper';
  if (day.includes('deadlift')) return 'lower';
  if (day.includes('speed') || day.includes('condition')) return 'conditioning';
  return 'full';
}

export function createWorkoutFromProfile(profile = {}, program, dayIndex = 0) {
  const days = program?.days || [];
  const safeDayIndex = days.length > 0 ? dayIndex % days.length : 0;
  const firstDay = days[safeDayIndex] || { name: 'Full Body', exercises: SPLIT_EXERCISES.full };
  const dayName = typeof firstDay === 'string' ? firstDay : firstDay.name;
  const dayType = dayTypeForName(dayName);
  const templates = Array.isArray(firstDay.exercises) && firstDay.exercises.length > 0
    ? firstDay.exercises
    : SPLIT_EXERCISES[dayType] || SPLIT_EXERCISES.full;
  return {
    id: `wk-${Date.now()}`,
    name: `${program?.name || 'Training'} · ${dayName}`,
    programId: program?.id,
    dayIndex: safeDayIndex,
    dayName,
    isBoss: false,
    exercises: templates.map((ex, index) => {
      const liftKey = ex.lift || liftKeyForExercise(ex.name);
      const weight = liftKey ? getTrainingLoad(profile, liftKey, ex.intensity) : 0;
      return {
        id: `ex-${Date.now()}-${index}`,
        name: ex.name,
        sets: createSets(ex.sets, {
          weight,
          reps: ex.reps,
          target: ex.target || ex.note,
        }),
      };
    }),
  };
}
