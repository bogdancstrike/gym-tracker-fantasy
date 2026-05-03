const ex = (name, sets, reps, lift = null, intensity = 0.6, note = '') => ({
  name,
  sets,
  reps,
  lift,
  intensity,
  note,
});

const day = (name, focus, exercises) => ({ name, focus, exercises });

const push = [
  ex('Bench Press', 3, 8, 'bench', 0.7),
  ex('Overhead Press', 3, 8, 'overhead', 0.65),
  ex('Incline Dumbbell Press', 3, 10, 'bench', 0.5),
  ex('Cable Fly', 2, 12, 'bench', 0.25),
  ex('Triceps Pressdown', 3, 12, 'overhead', 0.35),
];

const pull = [
  ex('Deadlift', 3, 5, 'deadlift', 0.72),
  ex('Barbell Row', 3, 8, 'bench', 0.55),
  ex('Lat Pulldown', 3, 10, 'bench', 0.45),
  ex('Face Pull', 2, 15, 'overhead', 0.25),
  ex('Dumbbell Curl', 3, 12, 'bench', 0.25),
];

const legs = [
  ex('Squat', 4, 8, 'squat', 0.7),
  ex('Romanian Deadlift', 3, 10, 'deadlift', 0.55),
  ex('Leg Press', 3, 12, 'squat', 0.8),
  ex('Leg Curl', 3, 12, 'deadlift', 0.3),
  ex('Standing Calf Raise', 4, 15, 'squat', 0.35),
];

const upper = [
  ex('Bench Press', 3, 8, 'bench', 0.68),
  ex('Barbell Row', 3, 8, 'bench', 0.55),
  ex('Overhead Press', 3, 8, 'overhead', 0.62),
  ex('Lat Pulldown', 3, 10, 'bench', 0.45),
  ex('Lateral Raise', 3, 15, 'overhead', 0.22),
];

const lower = [
  ex('Squat', 4, 8, 'squat', 0.68),
  ex('Deadlift', 3, 5, 'deadlift', 0.68),
  ex('Bulgarian Split Squat', 3, 10, 'squat', 0.35),
  ex('Leg Curl', 3, 12, 'deadlift', 0.3),
  ex('Plank', 3, 45, null, 0, 'seconds'),
];

const fullA = [
  ex('Squat', 3, 8, 'squat', 0.65),
  ex('Bench Press', 3, 8, 'bench', 0.65),
  ex('Barbell Row', 3, 10, 'bench', 0.5),
  ex('Romanian Deadlift', 2, 10, 'deadlift', 0.5),
];

const fullB = [
  ex('Deadlift', 3, 5, 'deadlift', 0.68),
  ex('Overhead Press', 3, 8, 'overhead', 0.62),
  ex('Lat Pulldown', 3, 10, 'bench', 0.45),
  ex('Walking Lunge', 3, 12, 'squat', 0.32),
];

const fullC = [
  ex('Front Squat', 3, 8, 'squat', 0.55),
  ex('Incline Press', 3, 10, 'bench', 0.55),
  ex('Hip Thrust', 3, 10, 'deadlift', 0.5),
  ex('Dumbbell Row', 3, 12, 'bench', 0.4),
];

const chest = [
  ex('Bench Press', 4, 8, 'bench', 0.7),
  ex('Incline Dumbbell Press', 3, 10, 'bench', 0.52),
  ex('Machine Chest Press', 3, 10, 'bench', 0.58),
  ex('Cable Fly', 3, 14, 'bench', 0.25),
  ex('Push-up', 2, 15, null, 0),
];

const back = [
  ex('Deadlift', 3, 5, 'deadlift', 0.7),
  ex('Pull-up / Assisted Pull-up', 4, 8, null, 0),
  ex('Barbell Row', 3, 8, 'bench', 0.55),
  ex('Lat Pulldown', 3, 12, 'bench', 0.42),
  ex('Face Pull', 3, 15, 'overhead', 0.22),
];

const shouldersArms = [
  ex('Overhead Press', 4, 8, 'overhead', 0.65),
  ex('Lateral Raise', 4, 15, 'overhead', 0.22),
  ex('Rear Delt Fly', 3, 15, 'overhead', 0.18),
  ex('Dumbbell Curl', 3, 12, 'bench', 0.25),
  ex('Triceps Pressdown', 3, 12, 'overhead', 0.35),
];

const strength = [
  ex('Squat', 4, 5, 'squat', 0.78),
  ex('Bench Press', 4, 5, 'bench', 0.78),
  ex('Deadlift', 3, 4, 'deadlift', 0.78),
  ex('Farmer Carry', 3, 40, 'deadlift', 0.45, 'meters'),
];

const conditioning = [
  ex('Sprint Intervals', 6, 1, null, 0, '200m'),
  ex('Burpees', 4, 12, null, 0),
  ex('Jump Rope', 1, 12, null, 0, 'minutes'),
  ex('Bike Cooldown', 1, 10, null, 0, 'minutes'),
];

export const PROGRAMS = {
  3: [
    {
      id: 'full-body-3',
      name: 'Full Body',
      blurb: 'Classic 3-day. Every muscle, every session.',
      tags: ['balanced', 'beginner'],
      days: [
        day('Full A · Squat-focus', 'balanced strength', fullA),
        day('Full B · Deadlift-focus', 'posterior chain', fullB),
        day('Full C · Hypertrophy', 'volume practice', fullC),
      ],
    },
    {
      id: 'ppl-3',
      name: 'Push · Pull · Legs',
      blurb: 'One cycle per week. Minimalist PPL.',
      tags: ['intermediate'],
      days: [
        day('Push', 'chest, shoulders, triceps', push),
        day('Pull', 'back, biceps, hinge', pull),
        day('Legs', 'quads, hamstrings, calves', legs),
      ],
    },
    {
      id: 'arnold-3',
      name: 'The Golden Split',
      blurb: 'Chest+Back, Shoulders+Arms, Legs.',
      tags: ['classic', 'aesthetic'],
      days: [
        day('Chest & Back', 'paired upper volume', [...chest.slice(0, 3), ...back.slice(1, 4)]),
        day('Shoulders & Arms', 'delts, biceps, triceps', shouldersArms),
        day('Legs', 'lower body volume', legs),
      ],
    },
    {
      id: 'upper-lower-3',
      name: 'Upper / Lower / Full',
      blurb: 'Hybrid for strength & volume.',
      tags: ['strength'],
      days: [
        day('Upper', 'upper strength', upper),
        day('Lower', 'lower strength', lower),
        day('Full Body', 'whole-body volume', fullA),
      ],
    },
  ],
  4: [
    {
      id: 'upper-lower-4',
      name: 'Upper / Lower',
      blurb: 'Twice each. Simple, effective.',
      tags: ['balanced', 'strength'],
      days: [
        day('Upper A', 'horizontal press and pull', upper),
        day('Lower A', 'squat emphasis', lower),
        day('Upper B', 'vertical press and pull', [ex('Overhead Press', 4, 6, 'overhead', 0.7), ex('Pull-up / Assisted Pull-up', 4, 8), ex('Incline Press', 3, 10, 'bench', 0.55), ex('Cable Row', 3, 12, 'bench', 0.42), ex('Lateral Raise', 3, 15, 'overhead', 0.22)]),
        day('Lower B', 'hinge emphasis', [ex('Deadlift', 3, 5, 'deadlift', 0.72), ex('Front Squat', 3, 8, 'squat', 0.55), ex('Hip Thrust', 3, 10, 'deadlift', 0.5), ex('Leg Curl', 3, 12, 'deadlift', 0.3), ex('Calf Raise', 4, 15, 'squat', 0.35)]),
      ],
    },
    {
      id: 'bro-split-4',
      name: 'The Bro Split',
      blurb: 'Chest, Back, Legs, Arms+Shoulders.',
      tags: ['hypertrophy'],
      days: [
        day('Chest', 'chest hypertrophy', chest),
        day('Back', 'back width and thickness', back),
        day('Legs', 'lower body volume', legs),
        day('Arms & Shoulders', 'delts and arms', shouldersArms),
      ],
    },
    {
      id: 'ppl-push-4',
      name: 'PPL + Upper',
      blurb: 'PPL with an extra upper focus.',
      tags: ['hybrid'],
      days: [
        day('Push', 'chest, shoulders, triceps', push),
        day('Pull', 'back, biceps, hinge', pull),
        day('Legs', 'quads, hamstrings, calves', legs),
        day('Upper', 'extra upper volume', upper),
      ],
    },
    {
      id: 'athletic-4',
      name: 'Athletic Protocol',
      blurb: 'Strength, speed, hypertrophy, conditioning.',
      tags: ['advanced', 'athlete'],
      days: [
        day('Strength', 'heavy compounds', strength),
        day('Speed', 'sprints and jumps', [ex('Box Jump', 5, 3), ex('Sprint Intervals', 8, 1, null, 0, '100m'), ex('Kettlebell Swing', 4, 12, 'deadlift', 0.3), ex('Med Ball Slam', 4, 10)]),
        day('Hypertrophy', 'upper/lower pump', [...upper.slice(0, 3), ...legs.slice(1, 3)]),
        day('Conditioning', 'engine and recovery', conditioning),
      ],
    },
  ],
  5: [
    {
      id: 'ppl-5',
      name: 'Push · Pull · Legs ×',
      blurb: 'PPL with a repeat; pick your weak link.',
      tags: ['intermediate'],
      days: [
        day('Push', 'chest, shoulders, triceps', push),
        day('Pull', 'back, biceps, hinge', pull),
        day('Legs', 'quads, hamstrings, calves', legs),
        day('Upper', 'upper volume', upper),
        day('Lower', 'lower volume', lower),
      ],
    },
    {
      id: 'bro-split-5',
      name: 'Classic Bro Split',
      blurb: 'One muscle group per day. Old-school.',
      tags: ['hypertrophy', 'classic'],
      days: [
        day('Chest', 'chest hypertrophy', chest),
        day('Back', 'back hypertrophy', back),
        day('Shoulders', 'delt focus', shouldersArms.slice(0, 4)),
        day('Arms', 'biceps and triceps', [ex('Close-Grip Bench Press', 3, 8, 'bench', 0.55), ex('Dumbbell Curl', 4, 10, 'bench', 0.25), ex('Skull Crusher', 3, 10, 'overhead', 0.32), ex('Hammer Curl', 3, 12, 'bench', 0.25), ex('Cable Pressdown', 3, 15, 'overhead', 0.28)]),
        day('Legs', 'leg hypertrophy', legs),
      ],
    },
    {
      id: 'arnold-5',
      name: 'Golden Split ×5',
      blurb: 'Expanded Arnold. Two upper pairings, legs, and arms.',
      tags: ['aesthetic', 'advanced'],
      days: [
        day('Chest & Back A', 'heavy paired upper', [...chest.slice(0, 3), ...back.slice(1, 3)]),
        day('Shoulders', 'delts and traps', shouldersArms.slice(0, 4)),
        day('Arms', 'arm specialization', [ex('Barbell Curl', 4, 10, 'bench', 0.25), ex('Close-Grip Bench Press', 4, 8, 'bench', 0.55), ex('Incline Curl', 3, 12, 'bench', 0.2), ex('Overhead Triceps Extension', 3, 12, 'overhead', 0.28)]),
        day('Legs', 'lower body volume', legs),
        day('Chest & Back B', 'volume paired upper', [...chest.slice(1, 5), ...back.slice(2, 5)]),
      ],
    },
    {
      id: 'powerbuild-5',
      name: 'Powerbuilding',
      blurb: 'Strength days plus volume days.',
      tags: ['strength', 'hypertrophy'],
      days: [
        day('Squat', 'squat strength', [ex('Squat', 5, 3, 'squat', 0.82), ex('Paused Squat', 3, 5, 'squat', 0.65), ex('Romanian Deadlift', 3, 8, 'deadlift', 0.55), ex('Leg Press', 3, 10, 'squat', 0.75)]),
        day('Bench', 'bench strength', [ex('Bench Press', 5, 3, 'bench', 0.82), ex('Close-Grip Bench Press', 3, 6, 'bench', 0.62), ex('Barbell Row', 4, 8, 'bench', 0.55), ex('Triceps Pressdown', 3, 12, 'overhead', 0.32)]),
        day('Deadlift', 'deadlift strength', [ex('Deadlift', 5, 3, 'deadlift', 0.82), ex('Deficit Deadlift', 3, 5, 'deadlift', 0.65), ex('Front Squat', 3, 6, 'squat', 0.58), ex('Lat Pulldown', 3, 10, 'bench', 0.42)]),
        day('Upper Volume', 'upper hypertrophy', upper),
        day('Lower Volume', 'lower hypertrophy', legs),
      ],
    },
  ],
};
