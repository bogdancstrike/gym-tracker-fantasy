export function Checkbox({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      aria-label={ariaLabel}
      onClick={() => onChange?.(!checked)}
      className={`chk ${checked ? 'checked' : ''}`}
      style={{ border: checked ? 'none' : undefined }}
    />
  );
}
