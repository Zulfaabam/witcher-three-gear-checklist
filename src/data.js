export const SOURCE = 'https://vulkk.com/2023/11/04/the-witcher-3-gear-sets-catalog/';
const url = path => `https://vulkk.com/${path}/`;
export const slots = ['Armor', 'Gauntlets', 'Trousers', 'Boots', 'Steel sword', 'Silver sword'];
const tiers = ['Standard', 'Enhanced', 'Superior', 'Mastercrafted', 'Grandmaster'];
const tiered = (id, name, school, weight, levels, guide, note, crossbow = false) => ({
  id, name, school, weight, category: 'witcher', note,
  tiers: tiers.map((name, i) => ({ id: name.toLowerCase(), name, level: levels[i], expansion: i === 4 ? 'Blood and Wine' : 'Base game', guide, items: [...slots] })),
  ...(crossbow ? { extras: [{ id: 'crossbow', name: `${name} crossbow`, level: 29, guide }] } : {}),
});
export const sets = [
  tiered('wolven', 'Wolven', 'School of the Wolf', 'Medium armor', [14,21,29,34,40], url('2022/12/15/how-to-get-the-wolf-school-gear-in-the-witcher-3'), 'Kaer Morhen’s school. Armor and swords for a versatile build.'),
  tiered('griffin', 'Griffin', 'School of the Griffin', 'Medium armor', [11,18,26,34,40], url('2022/12/17/how-to-get-the-griffin-school-gear-in-the-witcher-3'), 'A set built around signs and their intensity.'),
  tiered('feline', 'Feline', 'School of the Cat', 'Light armor', [17,23,29,34,40], url('2022/12/20/how-to-get-the-cat-school-gear-in-the-witcher-3'), 'Light armor for an agile, sword-focused build.', true),
  tiered('ursine', 'Ursine', 'School of the Bear', 'Heavy armor', [20,25,30,34,40], url('2022/12/18/how-to-get-the-bear-school-gear-in-the-witcher-3'), 'Heavy protection with a focus on adrenaline.', true),
  { id: 'viper', name: 'Viper', school: 'School of the Viper', weight: 'Medium armor', category: 'witcher', note: 'Early swords in White Orchard; the full set in Hearts of Stone.', tiers: [
    { id: 'standard', name: 'Standard swords', expansion: 'Base game', guide: url('2022/01/19/how-to-get-viper-school-gear-in-witcher-3'), items: ['Steel sword','Silver sword'] },
    { id: 'venomous', name: 'Armor & venomous swords', level: 39, expansion: 'Hearts of Stone', guide: url('2022/01/19/how-to-get-viper-school-gear-in-witcher-3'), items: ['Armor','Gauntlets','Trousers','Boots','Venomous steel sword','Venomous silver sword'], note: 'Missable during Open Sesame! and Whatsoever a Man Soweth…' },
  ]},
  { id: 'manticore', name: 'Manticore', school: 'School of the Manticore', weight: 'Medium armor', category: 'witcher', note: 'Toussaint gear for an alchemy-focused build.', tiers: [{ id:'grandmaster', name:'Grandmaster', level:40, expansion:'Blood and Wine', guide:url('2023/02/16/how-to-get-the-grandmaster-manticore-gear-in-the-witcher-3'), items:[...slots] }] },
  { id: 'forgotten-wolven', name: 'Forgotten Wolven', school: 'School of the Wolf', weight:'Medium armor', category:'witcher', note:'Find the diagrams through In the Eternal Fire’s Shadow in Velen.', tiers:[['Standard',20],['Mastercrafted',34],['Grandmaster',40]].map(([name,level])=>({id:name.toLowerCase(),name,level,expansion:name==='Grandmaster'?'Blood and Wine':'Next-gen update',guide:url('2022/12/15/how-to-get-the-forgotten-witcher-gear-set-in-the-witcher-3-netflix-dlc'),items:[...slots]})) },
];
const armor = ['Armor','Gauntlets','Trousers','Boots'];
const other = (id,name,weight,expansion,note,items=armor,guide=SOURCE) => ({id,name,school:'Other gear',weight,category:'other',note,tiers:[{id:'standard',name:'Full set',expansion,guide,items:[...items]}]});
sets.push(
  other('scarlet-crest','Scarlet Crest','Medium armor','Remastered edition','Vizima Palace treasure chest. Listed in the current VULKK catalog.'),
  other('thousand-flowers','Thousand Flowers','Medium armor','Next-gen update','Vizima Palace rewards. Armor and the paired swords.',[...armor,'Sword of a Thousand Flowers','White Widow of the Valley of Flowers']),
  other('white-tiger','White Tiger of the West','Medium armor','Next-gen update','Vizima Palace rewards. Includes the Nine-Tailed Vixen swords.',[...armor,'Nine-Tailed Vixen steel sword','Nine-Tailed Vixen silver sword']),
  other('temerian','Temerian','Light armor','Free DLC','Purchase from the merchant by Woesong Bridge in White Orchard.'),
  other('ofieri','Ofieri','Light armor','Hearts of Stone','From Ofier’s Distant Shores and the merchant at the Upper Mill. Includes Roach’s gear.', ['Scale armor','Gauntlets','Sharovary','Boots','Saber','Decorated saber','Crossbow (Master)','Crossbow (Relic)','Stock saddle','Saddlebags','Blinders'],url('2023/03/15/how-to-get-the-full-ofieri-set-in-the-witcher-3')),
  other('nilfgaardian','Nilfgaardian','Medium armor','Free DLC','Purchase from the quartermaster at Crow’s Perch.'),
  other('tesham-mutna','Tesham Mutna','Heavy armor','Blood and Wine','Explore the ruins with Regis during La Cage au Fou.', [...armor,'Mask','Steel sword']),
  other('hen-gaidth','Hen Gaidth','Heavy armor','Blood and Wine','Missable: the Unseen Elder route during What Lies Unseen.', [...armor,'Mask','Steel sword']),
  other('undvik','Undvik','Heavy armor','Free DLC','Purchase at Kaer Trolde in Skellige. Includes Roach’s gear.',[...armor,'Saddle','Saddlebags','Blinders']),
);

// Stable IDs are independent of visible names and list ordering.
export const itemId = (set, tier, index) => `${set.id}:${tier.id}:${index}`;
export const idsForSet = set => [...set.tiers.flatMap(tier => tier.items.map((_, i) => itemId(set,tier,i))), ...(set.extras ?? []).map(item => `${set.id}:${item.id}`)];
export const allIds = sets.flatMap(idsForSet);
export const STORAGE_KEY = 'witcher-gear-checklist:v1';
export function parseProgress(raw) {
  if (!raw) return {};
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid saved checklist');
  return Object.fromEntries(allIds.filter(id => parsed[id] === true).map(id => [id,true]));
}
