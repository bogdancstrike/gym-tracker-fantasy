export function Segmented({ options, value, onChange, format = (s) => s.toUpperCase().slice(0, 4) }) {
  return (
    <div className="seg">
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? format(o) : o.label;
        return (
          <button key={v} className={value === v ? 'active' : ''} onClick={() => onChange(v)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
