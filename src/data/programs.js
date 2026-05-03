export const PROGRAMS = {
  3: [
    { id: 'full-body-3',   name: 'Full Body',                blurb: 'Classic 3-day. Every muscle, every session.', days: ['Full A · Squat-focus', 'Full B · Bench-focus', 'Full C · Deadlift-focus'], tags: ['balanced', 'beginner'] },
    { id: 'ppl-3',         name: 'Push · Pull · Legs',       blurb: 'One cycle per week. Minimalist PPL.',         days: ['Push', 'Pull', 'Legs'],                                                  tags: ['intermediate']        },
    { id: 'arnold-3',      name: 'The Golden Split',         blurb: 'Chest+Back, Shoulders+Arms, Legs.',           days: ['Chest & Back', 'Shoulders & Arms', 'Legs'],                              tags: ['classic', 'aesthetic']},
    { id: 'upper-lower-3', name: 'Upper / Lower / Full',     blurb: 'Hybrid for strength & volume.',               days: ['Upper', 'Lower', 'Full Body'],                                            tags: ['strength']            },
  ],
  4: [
    { id: 'upper-lower-4', name: 'Upper / Lower',            blurb: 'Twice each. Simple, effective.',              days: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],                              tags: ['balanced', 'strength']},
    { id: 'bro-split-4',   name: 'The Bro Split',            blurb: 'Chest, Back, Legs, Arms+Shoulders.',          days: ['Chest', 'Back', 'Legs', 'Arms & Shoulders'],                             tags: ['hypertrophy']         },
    { id: 'ppl-push-4',    name: 'PPL + Upper',              blurb: 'PPL with an extra upper focus.',              days: ['Push', 'Pull', 'Legs', 'Upper'],                                          tags: ['hybrid']              },
    { id: 'athletic-4',    name: 'Athletic Protocol',        blurb: 'Strength, speed, hypertrophy, conditioning.', days: ['Strength', 'Speed', 'Hypertrophy', 'Conditioning'],                       tags: ['advanced', 'athlete'] },
  ],
  5: [
    { id: 'ppl-5',         name: 'Push · Pull · Legs ×',     blurb: 'PPL with a repeat; pick your weak link.',     days: ['Push', 'Pull', 'Legs', 'Upper', 'Lower'],                                tags: ['intermediate']        },
    { id: 'bro-split-5',   name: 'Classic Bro Split',        blurb: 'One muscle per day. Old-school.',             days: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs'],                            tags: ['hypertrophy', 'classic']},
    { id: 'arnold-5',      name: 'Golden Split ×5',          blurb: 'Expanded Arnold. Two pushes, two pulls, legs.', days: ['Chest & Back', 'Shoulders', 'Arms', 'Legs', 'Chest & Back'],          tags: ['aesthetic', 'advanced']},
    { id: 'powerbuild-5',  name: 'Powerbuilding',            blurb: 'Strength days + volume days.',                days: ['Squat', 'Bench', 'Deadlift', 'Upper Volume', 'Lower Volume'],            tags: ['strength', 'hypertrophy']},
  ],
};
