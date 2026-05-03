// Stroke icon factory + named icons. Pure SVG; no deps.
const sloIcon = (children, props = {}) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20}
       fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export const Icon = {
  home:      (p) => sloIcon(<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>, p),
  scroll:    (p) => sloIcon(<><path d="M4 5h14a2 2 0 012 2v0a2 2 0 01-2 2H6" /><path d="M4 5v14a2 2 0 002 2h12" /><path d="M8 10h8M8 14h8M8 18h5" /></>, p),
  sword:     (p) => sloIcon(<><path d="M14.5 3L21 3v6.5L9.5 21 3 14.5 14.5 3z" /><path d="M6 15l3 3" /><path d="M13 4l7 7" /></>, p),
  gate:      (p) => sloIcon(<><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /><path d="M5 5l14 14M19 5L5 19" /></>, p),
  chest:     (p) => sloIcon(<><rect x="3" y="8" width="18" height="12" rx="1" /><path d="M3 12h18" /><path d="M3 8a4 4 0 014-4h10a4 4 0 014 4" /><rect x="11" y="11" width="2" height="4" /></>, p),
  flame:     (p) => sloIcon(<path d="M12 3s4 4 4 8a4 4 0 01-8 0c0-2 1-3 2-4-1 3 2 4 2 4s2-2 0-8z" />, p),
  play:      (p) => sloIcon(<polygon points="6 4 20 12 6 20" />, p),
  pause:     (p) => sloIcon(<><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></>, p),
  plus:      (p) => sloIcon(<path d="M12 5v14M5 12h14" />, p),
  minus:     (p) => sloIcon(<path d="M5 12h14" />, p),
  check:     (p) => sloIcon(<polyline points="20 6 9 17 4 12" />, p),
  lock:      (p) => sloIcon(<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>, p),
  lightning: (p) => sloIcon(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, p),
  star:      (p) => sloIcon(<polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9" />, p),
  timer:     (p) => sloIcon(<><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M9 2h6M12 2v4" /></>, p),
  shield:    (p) => sloIcon(<path d="M12 2l8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5l8-3z" />, p),
  x:         (p) => sloIcon(<path d="M5 5l14 14M19 5L5 19" />, p),
  heart:     (p) => sloIcon(<path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z" />, p),
  book:      (p) => sloIcon(<path d="M4 4h10a4 4 0 014 4v12a3 3 0 00-3-3H4V4z" />, p),
  users:     (p) => sloIcon(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="8" r="2.5" /><path d="M15 15c3 0 6 2 6 5" /></>, p),
  swap:      (p) => sloIcon(<><path d="M7 4l-4 4 4 4" /><path d="M3 8h14" /><path d="M17 20l4-4-4-4" /><path d="M21 16H7" /></>, p),
  chevron:   (p) => sloIcon(<polyline points="9 6 15 12 9 18" />, p),
  settings:  (p) => sloIcon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>, p),
};

export default Icon;
