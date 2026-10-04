import { ArrowUpRight, Shield, Swords } from "lucide-react";
import { allIds, idsForSet, SOURCE } from "../data";
import type { GearCategory, GearSet } from "../types";
import { ProgressBar } from "./ProgressBar";
interface CollectionSidebarProps {
  owned: number;
  category: GearCategory;
  school: string;
  family: GearSet[];
  count: (ids: string[]) => number;
  onCategoryChange: (category: GearCategory) => void;
  onSchoolChange: (school: string) => void;
}
export function CollectionSidebar({
  owned,
  category,
  school,
  family,
  count,
  onCategoryChange: chooseCategory,
  onSchoolChange: setSchool,
}: CollectionSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="aside-top">
        <span className="eyebrow">YOUR COLLECTION</span>
        <div className="collection-number">
          {owned}
          <span> / {allIds.length}</span>
        </div>
        <ProgressBar
          value={owned}
          total={allIds.length}
          label="Overall collection"
        />
        <div className="progress-caption">
          <span>pieces collected</span>
          <span>{Math.round((owned / allIds.length) * 100)}%</span>
        </div>
      </div>
      <nav aria-label="Gear categories">
        <div className="nav-label">CATALOG</div>
        <button
          className={`category-button ${category === "witcher" ? "selected" : ""}`}
          onClick={() => chooseCategory("witcher")}
        >
          <Swords size={17} />
          Witcher gear<span>7</span>
        </button>
        <button
          className={`category-button ${category === "other" ? "selected" : ""}`}
          onClick={() => chooseCategory("other")}
        >
          <Shield size={17} />
          Other gear<span>9</span>
        </button>
        <div className="nav-divider" />
        <div className="nav-label">
          {category === "witcher" ? "SCHOOLS & SETS" : "ARMOR SETS"}
        </div>
        <button
          className={`school-button ${school === "all" ? "active" : ""}`}
          onClick={() => setSchool("all")}
        >
          <span>All {category === "witcher" ? "schools" : "sets"}</span>
          <span>{family.length}</span>
        </button>
        {family.map((s) => (
          <button
            key={s.id}
            className={`school-button ${school === s.id ? "active" : ""}`}
            onClick={() => setSchool(s.id)}
          >
            <span>{s.name}</span>
            <span>
              {count(idsForSet(s))}
              <span className="denominator">/{idsForSet(s).length}</span>
            </span>
          </button>
        ))}
      </nav>
      <div className="aside-footer">
        <a href={SOURCE} target="_blank" rel="noreferrer">
          Catalog by VULKK <ArrowUpRight size={14} />
        </a>
      </div>
    </aside>
  );
}
