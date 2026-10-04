import { ChevronDown } from "lucide-react";
import { idsForSet } from "../data";
import type { ChangeProgress, Progress, VisibleSet } from "../types";
import { GearCheckbox } from "./GearCheckbox";
import { GearTier } from "./GearTier";
import { ProgressBar } from "./ProgressBar";

interface GearSetCardProps {
  set: VisibleSet;
  number: number;
  checked: Progress;
  collapsed: boolean;
  onToggle: () => void;
  onChange: ChangeProgress;
}

export function GearSetCard({
  set,
  number,
  checked,
  collapsed,
  onToggle,
  onChange,
}: GearSetCardProps) {
  const ids = idsForSet(set);
  const owned = ids.filter((id) => checked[id]).length;
  return (
    <section
      className={`gear-set ${owned === ids.length ? "complete" : ""}`}
      aria-labelledby={`${set.id}-title`}
    >
      <button
        className="set-heading"
        aria-expanded={!collapsed}
        aria-controls={`${set.id}-content`}
        onClick={onToggle}
      >
        <span className="set-index">{String(number).padStart(2, "0")}</span>
        <span className="set-title">
          <span className="school-label">{set.school}</span>
          <h2 id={`${set.id}-title`}>{set.name}</h2>
        </span>
        <span className="armor-weight">{set.weight}</span>
        <span className="set-progress">
          <span>
            {owned}
            <span className="muted"> / {ids.length}</span>
          </span>
          <ProgressBar
            value={owned}
            total={ids.length}
            label={`${set.name} collection`}
          />
        </span>
        <ChevronDown className={collapsed ? "rotated" : ""} size={18} />
      </button>
      {!collapsed && (
        <div id={`${set.id}-content`} className="set-content">
          <p className="set-note">{set.note}</p>
          {set.visibleTiers.map((tier) => (
            <GearTier
              key={tier.id}
              set={set}
              tier={tier}
              checked={checked}
              onChange={onChange}
            />
          ))}
          {set.visibleExtras.length > 0 && (
            <div className="extras">
              <span className="extra-label">ADDITIONAL GEAR</span>
              {set.visibleExtras.map((item) => (
                <GearCheckbox
                  key={item.id}
                  label={item.name}
                  accessibleLabel={item.name}
                  checked={!!checked[`${set.id}:${item.id}`]}
                  onChange={(value) =>
                    onChange([`${set.id}:${item.id}`], value)
                  }
                  level={item.level}
                />
              ))}
              <small>One tier · no upgrades</small>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
