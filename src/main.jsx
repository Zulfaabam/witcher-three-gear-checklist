import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, ChevronDown, ExternalLink, Shield, Swords, Search, X, CheckCheck, Circle, HardDrive, ArrowUpRight } from 'lucide-react';
import { sets, SOURCE, itemId, idsForSet, allIds, STORAGE_KEY, parseProgress } from './data';
import './styles.css';

function loadProgress() {
  try { return { checked: parseProgress(localStorage.getItem(STORAGE_KEY)), error: '' }; }
  catch { return { checked: {}, error: 'Saved progress could not be read. Changes will stay in this session until you enable saving.' }; }
}
function App() {
  const [initial] = useState(loadProgress);
  const [checked, setChecked] = useState(initial.checked);
  const [storageError, setStorageError] = useState(initial.error);
  const [category, setCategory] = useState('witcher');
  const [school, setSchool] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState({});
  const dirty = useRef(false);
  useEffect(() => {
    if (!dirty.current || initial.error) return;
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(checked)); setStorageError(''); }
    catch { setStorageError('Browser storage is unavailable. Your checks will only last for this session.'); }
  },[checked,initial]);
  useEffect(() => {
    const sync = e => { if (e.key === STORAGE_KEY || e.key === null) { try { setChecked(parseProgress(e.newValue)); } catch { setStorageError('Could not read the checklist update from another tab.'); } } };
    window.addEventListener('storage',sync); return () => window.removeEventListener('storage',sync);
  },[]);
  const change = (ids, value) => { dirty.current = true; setChecked(prev => { const next = {...prev}; ids.forEach(id => { if(value) next[id] = true; else delete next[id]; }); return next; }); };
  const count = ids => ids.filter(id => checked[id]).length;
  const owned = count(allIds);
  const family = sets.filter(s => s.category === category);
  const familyIds = family.flatMap(idsForSet);
  const familyOwned = count(familyIds);
  const completed = sets.filter(s => count(idsForSet(s)) === idsForSet(s).length).length;
  const matches = (set, tier, name, id) => `${set.name} ${set.school} ${tier.name} ${name}`.toLowerCase().includes(query.toLowerCase().trim()) && (status === 'all' || (status === 'owned' ? checked[id] : !checked[id]));
  const visible = family.filter(s => school === 'all' || school === s.id).map(set => ({
    ...set, visibleTiers: set.tiers.map(tier => ({...tier, visibleItems: tier.items.map((name,index)=>({name,id:itemId(set,tier,index)})).filter(item=>matches(set,tier,item.name,item.id))})).filter(tier=>tier.visibleItems.length),
    visibleExtras: (set.extras??[]).filter(item=>matches(set,{name:'Crossbow'},item.name,`${set.id}:${item.id}`)),
  })).filter(set=>set.visibleTiers.length || set.visibleExtras.length);
  const visibleCount = visible.reduce((n,s)=>n+s.visibleTiers.reduce((m,t)=>m+t.visibleItems.length,0)+s.visibleExtras.length,0);
  const chooseCategory = value => { setCategory(value); setSchool('all'); };
  return <>
    <header className="topbar"><a className="brand" href="#main"><Swords size={25} strokeWidth={1.3}/><span>WITCHER <b>GEAR</b></span></a><span className="game-title">THE WITCHER 3 <span> / </span> WILD HUNT</span><span className="save-status"><HardDrive size={14}/>{storageError ? 'Session only' : 'Saved on this device'}</span></header>
    <div className="workspace">
      <aside className="sidebar"><div className="aside-top"><span className="eyebrow">YOUR COLLECTION</span><div className="collection-number">{owned}<span> / {allIds.length}</span></div><div className="progress-track"><div style={{width:`${owned/allIds.length*100}%`}}/></div><div className="progress-caption"><span>pieces collected</span><span>{Math.round(owned/allIds.length*100)}%</span></div></div>
        <nav aria-label="Gear categories"><div className="nav-label">CATALOG</div><button className={`category-button ${category==='witcher'?'selected':''}`} onClick={()=>chooseCategory('witcher')}><Swords size={17}/>Witcher gear<span>7</span></button><button className={`category-button ${category==='other'?'selected':''}`} onClick={()=>chooseCategory('other')}><Shield size={17}/>Other gear<span>9</span></button><div className="nav-divider"/><div className="nav-label">{category==='witcher'?'SCHOOLS & SETS':'ARMOR SETS'}</div><button className={`school-button ${school==='all'?'active':''}`} onClick={()=>setSchool('all')}><span>All {category==='witcher'?'schools':'sets'}</span><span>{family.length}</span></button>{family.map(s=><button key={s.id} className={`school-button ${school===s.id?'active':''}`} onClick={()=>setSchool(s.id)}><span>{s.name}</span><span>{count(idsForSet(s))}<span className="denominator">/{idsForSet(s).length}</span></span></button>)}</nav>
        <div className="aside-footer"><span className="mini-diamond">◇</span><p>Every piece.<br/>One collection.</p><a href={SOURCE} target="_blank" rel="noreferrer">Catalog by VULKK <ArrowUpRight size={14}/></a></div>
      </aside>
      <main id="main"><div className="page-heading"><div><div className="eyebrow red">THE CONTINENT’S ARMORY</div><h1>Gear checklist<span>.</span></h1><p>Keep track of what you’ve found. See what’s still out there.</p></div><div className="set-total"><CheckCheck size={19}/><div><strong>{completed}<span> / {sets.length}</span></strong><small>sets complete</small></div></div></div>
        {storageError && <div className="storage-warning" role="status">{storageError}{initial.error && <button onClick={()=>{initial.error='';dirty.current=true;setChecked({...checked});}}>Enable saving</button>}</div>}
        <div className="collection-tabs"><button className={category==='witcher'?'current':''} onClick={()=>chooseCategory('witcher')}>Witcher gear <span>7</span></button><button className={category==='other'?'current':''} onClick={()=>chooseCategory('other')}>Other gear <span>9</span></button><div className="section-progress">{familyOwned} / {familyIds.length} collected</div></div>
        <div className="toolbar"><label className="search"><Search size={17}/><input aria-label="Search gear" placeholder="Search gear, school, or tier…" value={query} onChange={e=>setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={()=>setQuery('')}><X size={16}/></button>}</label><div className="status-filter" aria-label="Collection status">{[['all','All gear'],['missing','Missing'],['owned','Collected']].map(([id,label])=><button aria-pressed={status===id} className={status===id?'active':''} onClick={()=>setStatus(id)} key={id}>{label}</button>)}</div></div>
        <div className="results-line"><span>{school==='all'?(category==='witcher'?'All schools':'All other sets'):family.find(s=>s.id===school)?.name} <span className="muted">/ {visibleCount} pieces</span></span><span>Check off gear you’ve obtained</span></div>
        <div className="gear-list">{visible.map((set,index)=>{
          const ids=idsForSet(set), total=count(ids), isClosed=closed[set.id];
          return <section className={`gear-set ${total===ids.length?'complete':''}`} key={set.id} aria-labelledby={`${set.id}-title`}>
            <button className="set-heading" aria-expanded={!isClosed} aria-controls={`${set.id}-content`} onClick={()=>setClosed(prev=>({...prev,[set.id]:!prev[set.id]}))}>
              <span className="set-index">{String(sets.findIndex(s=>s.id===set.id)+1).padStart(2,'0')}</span><span className="set-title"><span className="school-label">{set.school}</span><h2 id={`${set.id}-title`}>{set.name}</h2></span><span className="armor-weight">{set.weight}</span><span className="set-progress"><span>{total}<span className="muted"> / {ids.length}</span></span><span className="progress-track"><span style={{width:`${total/ids.length*100}%`}}/></span></span><ChevronDown className={isClosed?'rotated':''} size={18}/>
            </button>
            {!isClosed && <div id={`${set.id}-content`} className="set-content"><p className="set-note">{set.note}</p>{set.visibleTiers.map(tier=>{
              const tierIds=tier.items.map((_,i)=>itemId(set,tier,i)), tierOwned=count(tierIds), allChecked=tierOwned===tierIds.length;
              return <div className="tier" key={tier.id}><div className="tier-heading"><h3>{tier.name}</h3>{tier.level && <span className="level">LVL {tier.level}</span>}<span className="expansion">{tier.expansion}</span><a href={tier.id==='standard'||set.tiers.length===1||['viper','forgotten-wolven'].includes(set.id)?tier.guide:SOURCE} target="_blank" rel="noreferrer" aria-label={`${set.name} ${tier.name} guide on VULKK`}>Guide <ExternalLink size={12}/></a><button className="check-tier" onClick={()=>change(tierIds,!allChecked)} aria-label={`${allChecked?'Uncheck':'Collect'} all ${set.name} ${tier.name} pieces`}>{allChecked?<CheckCheck size={14}/>:<Check size={14}/>}<span>{allChecked?'Collected':'Collect tier'}</span></button></div>
                <div className="items-grid">{tier.visibleItems.map(item=><label className={`gear-item ${checked[item.id]?'owned':''}`} key={item.id}><input type="checkbox" checked={!!checked[item.id]} onChange={e=>change([item.id],e.target.checked)} aria-label={`${set.name} ${tier.name} ${item.name}`}/><span className="custom-check"><Check size={13} strokeWidth={2.5}/></span><span>{item.name}</span></label>)}</div>{tier.note && <p className="tier-note">{tier.note}</p>}
              </div>;
            })}{set.visibleExtras.length>0 && <div className="extras"><span className="extra-label">ADDITIONAL GEAR</span>{set.visibleExtras.map(item=><label className={`gear-item ${checked[`${set.id}:${item.id}`]?'owned':''}`} key={item.id}><input type="checkbox" checked={!!checked[`${set.id}:${item.id}`]} onChange={e=>change([`${set.id}:${item.id}`],e.target.checked)} aria-label={item.name}/><span className="custom-check"><Check size={13}/></span><span>{item.name}</span><span className="level">LVL {item.level}</span></label>)}<small>One tier · no upgrades</small></div>}</div>}
          </section>;
        })}</div>
        {!visible.length && <div className="empty-state"><Circle size={32} strokeWidth={1}/><h2>{status==='missing'&&!query?'Nothing missing here.':'No gear matches.'}</h2><p>{status==='missing'&&!query?'You’ve collected every piece in this selection.':'Try another search or collection filter.'}</p><button onClick={()=>{setQuery('');setStatus('all');setSchool('all');}}>Show all gear</button></div>}
        <footer><span>Progress is saved in this browser. Clearing site data clears your checklist.</span><a href={SOURCE} target="_blank" rel="noreferrer">Gear data: VULKK <ExternalLink size={12}/></a><span className="scope-note">Standard playthrough · upgrades tracked separately · legendary NG+ variants not included</span></footer>
      </main>
    </div>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
