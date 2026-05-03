import { MysticRunes } from './MysticRunes.jsx';

// Theme-aware ambient background. Reads tokens from CSS variables.
export function AppBackground() {
  return (
    <>
      <div className="app-bg" aria-hidden />
      <MysticRunes />
    </>
  );
}

export function Scanlines() {
  return <div className="scanlines" aria-hidden />;
}
