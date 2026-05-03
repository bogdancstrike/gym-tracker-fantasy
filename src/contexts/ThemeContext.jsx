import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { lex as lexFn } from '../data/themeCopy.js';

export const THEMES = {
  'cyber-arcane': {
    cyan:   'oklch(0.82 0.14 210)',
    violet: 'oklch(0.65 0.22 290)',
    gold:   'oklch(0.82 0.16 80)',
    danger: 'oklch(0.65 0.25 25)',
    label: 'Solo Leveling',
    sub: 'Cyber-arcane · violet glow',
    mode: 'cyber',
  },
  'verdant-grove': {
    cyan:   'oklch(0.78 0.14 145)',
    violet: 'oklch(0.7 0.14 90)',
    gold:   'oklch(0.86 0.14 85)',
    danger: 'oklch(0.6 0.2 30)',
    label: 'Fantasy',
    sub: 'Forest grove · serif & motes',
    mode: 'fantasy',
  },
};

function applyTheme(themeKey) {
  const t = THEMES[themeKey] || THEMES['cyber-arcane'];
  const r = document.documentElement.style;
  r.setProperty('--cyan', t.cyan);
  r.setProperty('--violet', t.violet);
  r.setProperty('--gold', t.gold);
  r.setProperty('--danger', t.danger);
  document.documentElement.setAttribute('data-theme', t.mode);
}

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'ascend_theme_v1';

export function ThemeProvider({ children, initial = 'verdant-grove' }) {
  const [themeKey, setThemeKeyState] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || initial);

  useEffect(() => {
    applyTheme(themeKey);
    localStorage.setItem(THEME_STORAGE_KEY, themeKey);
  }, [themeKey]);

  const setThemeKey = useCallback((key) => {
    setThemeKeyState(THEMES[key] ? key : initial);
  }, [initial]);

  const value = useMemo(() => {
    const theme = THEMES[themeKey];
    const fantasy = theme?.mode === 'fantasy';
    return {
      themeKey, setThemeKey,
      theme, fantasy,
      lex: (text) => lexFn(text, fantasy),
    };
  }, [themeKey]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export { applyTheme };
