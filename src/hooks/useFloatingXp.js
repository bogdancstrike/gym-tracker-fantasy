import { useCallback, useState } from 'react';

let _id = 0;

export function useFloatingXp() {
  const [ticks, setTicks] = useState([]);

  const spawn = useCallback((amount, x, y, label = '') => {
    const id = ++_id;
    setTicks(t => [...t, { id, amount, x, y, label }]);
    setTimeout(() => setTicks(t => t.filter(it => it.id !== id)), 1200);
  }, []);

  return { ticks, spawn };
}
