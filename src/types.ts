export type GearCategory = "witcher" | "other";
export type CollectionStatus = "all" | "missing" | "owned";
export type Progress = Record<string, boolean>;
export type ChangeProgress = (ids: string[], checked: boolean) => void;
export interface GearTier {
  id: string;
  name: string;
  level?: number;
  expansion: string;
  guide: string;
  items: string[];
  note?: string;
}
export interface ExtraGear {
  id: string;
  name: string;
  level: number;
  guide: string;
}
export interface GearSet {
  id: string;
  name: string;
  school: string;
  weight: string;
  category: GearCategory;
  note: string;
  tiers: GearTier[];
  extras?: ExtraGear[];
}
export interface VisibleTier extends GearTier {
  visibleItems: { id: string; name: string }[];
}
export interface VisibleSet extends GearSet {
  visibleTiers: VisibleTier[];
  visibleExtras: ExtraGear[];
}
