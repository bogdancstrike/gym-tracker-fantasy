export function Button({ variant = 'default', children, className = '', ...rest }) {
  const cls = `btn ${variant === 'primary' ? 'btn-primary' : variant === 'ghost' ? 'btn-ghost' : variant === 'danger' ? 'btn-danger' : ''} ${className}`;
  return <button className={cls.trim()} {...rest}>{children}</button>;
}
