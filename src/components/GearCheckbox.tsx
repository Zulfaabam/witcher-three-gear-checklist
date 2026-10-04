import { Check } from "lucide-react";
interface GearCheckboxProps {
  label: string;
  accessibleLabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  level?: number;
}
export function GearCheckbox({
  label,
  accessibleLabel,
  checked,
  onChange,
  level,
}: GearCheckboxProps) {
  return (
    <label className={`gear-item ${checked ? "owned" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={accessibleLabel}
      />
      <span className="custom-check">
        <Check size={13} strokeWidth={2.5} />
      </span>
      <span>{label}</span>
      {level !== undefined && <span className="level">LVL {level}</span>}
    </label>
  );
}
