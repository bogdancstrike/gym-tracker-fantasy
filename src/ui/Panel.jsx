export function Panel({ children, ticks = false, glass = false, className = '', style, ...rest }) {
  const cls = [
    'panel',
    glass ? 'glass-fantasy' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cls} style={style} {...rest}>
      {ticks && <div className="ticks" aria-hidden />}
      {children}
    </div>
  );
}

export function Corners({ children, style = {} }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {children}
      <span style={{ position: 'absolute', top: 0,    left: 0,  width: 8, height: 8, borderTop:    '1px solid var(--cyan)', borderLeft:  '1px solid var(--cyan)' }} />
      <span style={{ position: 'absolute', top: 0,    right: 0, width: 8, height: 8, borderTop:    '1px solid var(--cyan)', borderRight: '1px solid var(--cyan)' }} />
      <span style={{ position: 'absolute', bottom: 0, left: 0,  width: 8, height: 8, borderBottom: '1px solid var(--cyan)', borderLeft:  '1px solid var(--cyan)' }} />
      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderBottom: '1px solid var(--cyan)', borderRight: '1px solid var(--cyan)' }} />
    </div>
  );
}
