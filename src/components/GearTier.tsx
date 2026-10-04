import { Check, CheckCheck, ExternalLink } from "lucide-react";
import { itemId, SOURCE } from "../data";
import type { ChangeProgress, GearSet, Progress, VisibleTier } from "../types";
import { GearCheckbox } from "./GearCheckbox";

interface GearTierProps {
  set: GearSet;
  tier: VisibleTier;
  checked: Progress;
  onChange: ChangeProgress;
}

export function GearTier({ set, tier, checked, onChange }: GearTierProps) {
  // A tier action always addresses the whole tier, even when search hides pieces.
  const ids = tier.items.map((_, index) => itemId(set, tier, index));
  const allChecked = ids.every((id) => checked[id]);
  const guide =
    tier.id === "standard" ||
    set.tiers.length === 1 ||
    ["viper", "forgotten-wolven"].includes(set.id)
      ? tier.guide
      : SOURCE;

  return (
    <div className="tier">
      <div className="tier-heading">
        <h3>{tier.name}</h3>
        {tier.level && <span className="level">LVL {tier.level}</span>}
        <span className="expansion">{tier.expansion}</span>
        <a
          href={guide}
          target="_blank"
          rel="noreferrer"
          aria-label={`${set.name} ${tier.name} guide on VULKK`}
        >
          Guide <ExternalLink size={12} />
        </a>
        <button
          className="check-tier"
          onClick={() => onChange(ids, !allChecked)}
          aria-label={`${allChecked ? "Uncheck" : "Collect"} all ${set.name} ${tier.name} pieces`}
        >
          {allChecked ? <CheckCheck size={14} /> : <Check size={14} />}
          <span>{allChecked ? "Collected" : "Collect tier"}</span>
        </button>
      </div>
      <div className="items-grid">
        {tier.visibleItems.map((item) => (
          <GearCheckbox
            key={item.id}
            label={item.name}
            accessibleLabel={`${set.name} ${tier.name} ${item.name}`}
            checked={!!checked[item.id]}
            onChange={(value) => onChange([item.id], value)}
          />
        ))}
      </div>
      {tier.note && <p className="tier-note">{tier.note}</p>}
    </div>
  );
}
