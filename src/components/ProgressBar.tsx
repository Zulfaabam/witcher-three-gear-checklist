interface ProgressBarProps {
  value: number;
  total: number;
  label: string;
}

export function ProgressBar({ value, total, label }: ProgressBarProps) {
  const percent =
    total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;
  return (
    <span
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.max(total, 1)}
      aria-valuenow={Math.min(Math.max(value, 0), Math.max(total, 1))}
    >
      <span style={{ width: `${percent}%` }} />
    </span>
  );
}
