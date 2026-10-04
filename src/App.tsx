import { useState } from "react";
import {
  CheckCheck,
  Circle,
  ExternalLink,
  HardDrive,
  Swords,
} from "lucide-react";
import { sets, SOURCE, itemId, idsForSet, allIds } from "./data";
import type {
  CollectionStatus,
  GearCategory,
  GearSet,
  GearTier,
} from "./types";
import { useChecklistProgress } from "./hooks/useChecklistProgress";
import { CollectionSidebar } from "./components/CollectionSidebar";
import { GearSetCard } from "./components/GearSetCard";
import { SearchField } from "./components/SearchField";

export default function App() {
  const { checked, storageError, savingBlocked, enableSaving, change } =
    useChecklistProgress();
  const [category, setCategory] = useState<GearCategory>("witcher");
  const [school, setSchool] = useState("all");
  const [status, setStatus] = useState<CollectionStatus>("all");
  const [query, setQuery] = useState("");
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const count = (ids: string[]) => ids.filter((id) => checked[id]).length;
  const owned = count(allIds);
  const family = sets.filter((s) => s.category === category);
  const familyIds = family.flatMap(idsForSet);
  const familyOwned = count(familyIds);
  const completed = sets.filter(
    (s) => count(idsForSet(s)) === idsForSet(s).length
  ).length;
  const matches = (
    set: GearSet,
    tier: Pick<GearTier, "name">,
    name: string,
    id: string
  ) =>
    `${set.name} ${set.school} ${tier.name} ${name}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()) &&
    (status === "all" || (status === "owned" ? checked[id] : !checked[id]));
  const visible = family
    .filter((s) => school === "all" || school === s.id)
    .map((set) => ({
      ...set,
      visibleTiers: set.tiers
        .map((tier) => ({
          ...tier,
          visibleItems: tier.items
            .map((name, index) => ({ name, id: itemId(set, tier, index) }))
            .filter((item) => matches(set, tier, item.name, item.id)),
        }))
        .filter((tier) => tier.visibleItems.length),
      visibleExtras: (set.extras ?? []).filter((item) =>
        matches(set, { name: "Crossbow" }, item.name, `${set.id}:${item.id}`)
      ),
    }))
    .filter((set) => set.visibleTiers.length || set.visibleExtras.length);
  const visibleCount = visible.reduce(
    (n, s) =>
      n +
      s.visibleTiers.reduce((m, t) => m + t.visibleItems.length, 0) +
      s.visibleExtras.length,
    0
  );
  const chooseCategory = (value: GearCategory) => {
    setCategory(value);
    setSchool("all");
  };
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#main">
          <Swords size={25} strokeWidth={1.3} />
          <span>
            WITCHER <b>GEAR</b>
          </span>
        </a>
        <span className="game-title">
          THE WITCHER 3 <span> / </span> WILD HUNT
        </span>
        <span className="save-status">
          <HardDrive size={14} />
          {storageError ? "Session only" : "Saved on this device"}
        </span>
      </header>
      <div className="workspace">
        <CollectionSidebar
          owned={owned}
          category={category}
          school={school}
          family={family}
          count={count}
          onCategoryChange={chooseCategory}
          onSchoolChange={setSchool}
        />
        <main id="main">
          <div className="page-heading">
            <div>
              <div className="eyebrow red">THE CONTINENT’S ARMORY</div>
              <h1>
                Gear checklist<span>.</span>
              </h1>
              <p>
                Keep track of what you’ve found. See what’s still out there.
              </p>
            </div>
            <div className="set-total">
              <CheckCheck size={19} />
              <div>
                <strong>
                  {completed}
                  <span> / {sets.length}</span>
                </strong>
                <small>sets complete</small>
              </div>
            </div>
          </div>
          {storageError && (
            <div className="storage-warning" role="status">
              {storageError}
              {savingBlocked && (
                <button onClick={enableSaving}>Enable saving</button>
              )}
            </div>
          )}
          <div className="collection-tabs">
            <button
              className={category === "witcher" ? "current" : ""}
              onClick={() => chooseCategory("witcher")}
            >
              Witcher gear <span>7</span>
            </button>
            <button
              className={category === "other" ? "current" : ""}
              onClick={() => chooseCategory("other")}
            >
              Other gear <span>9</span>
            </button>
            <div className="section-progress">
              {familyOwned} / {familyIds.length} collected
            </div>
          </div>
          <div className="toolbar">
            <SearchField
              value={query}
              onChange={setQuery}
              label="Search gear"
              placeholder="Search gear, school, or tier…"
            />
            <div className="status-filter" aria-label="Collection status">
              {(
                [
                  ["all", "All gear"],
                  ["missing", "Missing"],
                  ["owned", "Collected"],
                ] as const
              ).map(([id, label]) => (
                <button
                  aria-pressed={status === id}
                  className={status === id ? "active" : ""}
                  onClick={() => setStatus(id)}
                  key={id}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="results-line">
            <span>
              {school === "all"
                ? category === "witcher"
                  ? "All schools"
                  : "All other sets"
                : family.find((s) => s.id === school)?.name}{" "}
              <span className="muted">/ {visibleCount} pieces</span>
            </span>
            <span>Check off gear you’ve obtained</span>
          </div>
          <div className="gear-list">
            {visible.map((set) => (
              <GearSetCard
                key={set.id}
                set={set}
                number={sets.findIndex((s) => s.id === set.id) + 1}
                checked={checked}
                collapsed={!!closed[set.id]}
                onToggle={() =>
                  setClosed((prev) => ({ ...prev, [set.id]: !prev[set.id] }))
                }
                onChange={change}
              />
            ))}
          </div>
          {!visible.length && (
            <div className="empty-state">
              <Circle size={32} strokeWidth={1} />
              <h2>
                {status === "missing" && !query
                  ? "Nothing missing here."
                  : "No gear matches."}
              </h2>
              <p>
                {status === "missing" && !query
                  ? "You’ve collected every piece in this selection."
                  : "Try another search or collection filter."}
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setSchool("all");
                }}
              >
                Show all gear
              </button>
            </div>
          )}
          <footer>
            <span>
              Progress is saved in this browser. Clearing site data clears your
              checklist.
            </span>
            <a href={SOURCE} target="_blank" rel="noreferrer">
              Gear data: VULKK <ExternalLink size={12} />
            </a>
            <span className="scope-note">
              Standard playthrough · upgrades tracked separately · legendary NG+
              variants not included
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
