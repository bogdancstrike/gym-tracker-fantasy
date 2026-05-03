import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 900px)';

/** @returns {{ desktop: boolean }} */
export function useBreakpoint() {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handler = (e) => setDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { desktop };
}
