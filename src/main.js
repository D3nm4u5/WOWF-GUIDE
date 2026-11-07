import './style.css';
import { classes, getTrees, dataBuild, referenceSources } from './data.js';
import { total, budget, treeTotal, canAdd, valid, loadBuild, serialize, levelingBuild } from './planner.js';
import { specGuides, restorationRoute, restorationSections, healingMacros, levelingReasons } from './guides.js';

const app = document.querySelector('#app');
const image = icon => `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let selected = 'shaman', page = 'guides', filter = 'All classes', search = '', spec = 2;
let ranks = {}, level = 60, inspected = null, guideLevel = 20, undo = [], library = [], warning = '', talentSearch = '';
const current = () => classes.find(c => c.id === selected);
const currentTrees = () => getTrees(selected);
const draftKey = id => `forever-draft-v2-${id}`;

function readStorage(key) { try { return localStorage.getItem(key); } catch { warning = 'Local saving is unavailable. Export or share your builds to keep them.'; return null; } }
function writeStorage(key, value) { try { localStorage.setItem(key, value); return true; } catch { warning = 'Local saving is unavailable. Export or share your builds to keep them.'; toast(warning); return false; } }
function toast(text) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.role = 'status'; el.textContent = text;
  document.body.append(el); setTimeout(() => el.remove(), 5000);
}
function persist() {
  writeStorage(draftKey(selected), serialize(ranks, level, selected));
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}
function remember() { undo.push({ ranks: { ...ranks }, level }); if (undo.length > 50) undo.shift(); }
function switchClass(id) {
  if (!classes.some(c => c.id === id)) return;
  selected = id; spec = id === 'shaman' ? 2 : 0; inspected = null; undo = []; talentSearch = '';
  const stored = loadBuild(readStorage(draftKey(id)) || '');
  const draft = stored?.classId === id ? stored : null;
  ranks = draft?.ranks || {}; level = draft?.level || 60;
}
function openBuild(build) {
  selected = build.classId; ranks = { ...build.ranks }; level = build.level;
  spec = selected === 'shaman' ? 2 : 0; inspected = null; undo = []; talentSearch = ''; page = 'planner';
}
try {
  const saved = JSON.parse(readStorage('forever-library-v2') || '[]');
  if (Array.isArray(saved)) library = saved.filter(item => typeof item.id === 'string' && typeof item.name === 'string' && loadBuild(item.build)).slice(0, 50);
} catch { warning = 'The saved-build library could not be read. Existing storage has not been changed.'; }
switchClass('shaman');
const shared = new URLSearchParams(location.hash.slice(1)).get('build');
if (shared) {
  const build = loadBuild(shared);
  if (build) openBuild(build);
  else warning = 'This build link is invalid or belongs to the old Mage prototype. Old allocations are not silently converted to different talent data.';
}
if (readStorage('forever-mage')) warning ||= 'An old Mage prototype draft is still stored on this device. It has been preserved, but cannot be automatically converted to the new talent snapshot.';

function render() {
  const c = current();
  app.innerHTML = `
    <a class="skip-link" href="#content">Skip to guide</a>
    <header class="header"><a class="brand" href="/" aria-label="Forever home"><span class="brand-mark">F<span>✦</span></span><span>FOREVER<small>THE ADVENTURER’S FIELD GUIDE</small></span></a>
      <nav aria-label="Main navigation">${[['guides', 'Class guides'], ['planner', 'Talent planner'], ['saved', 'Saved builds']].map(([id, label]) => `<button data-page="${id}" class="${page === id ? 'active' : ''}" aria-current="${page === id ? 'page' : 'false'}">${label}${id === 'saved' ? ` <span class="nav-count">${library.length}</span>` : ''}</button>`).join('')}</nav>
      <span class="version"><i></i> SNAPSHOT <b>1.60.1</b></span></header>
    <main><section class="hero ${page !== 'guides' ? 'hero-compact' : ''}"><div class="hero-art" aria-hidden="true"></div><div class="hero-inner"><div class="eyebrow"><span></span> TROLL · SHAMAN · RESTORATION</div>
      <h1>Answer the call.<br>Keep them <em>standing.</em></h1><p>Your healing journey, one level at a time.<br>Explore every class. Build your own path.</p>
      <button class="primary" data-action="leveling">Plan your leveling talents <span>↓</span></button><div class="hero-meta"><span>9 classes · 27 trees</span><b>✦</b><span>Featured: Troll Restoration</span></div></div><div class="hero-caption"><span>✦</span> THE JOURNEY IS THE REWARD</div></section>
      <div class="content" id="content" tabindex="-1">${warning ? `<aside class="status-warning" role="status">${escape(warning)}</aside>` : ''}
      <div class="section-heading"><div><div class="eyebrow">THE FIELD GUIDE <span class="short-line"></span></div><h2>${page === 'planner' ? 'Make every point count.' : page === 'saved' ? 'Your builds. Your adventures.' : 'Choose your calling.'}</h2></div><p>${page === 'planner' ? `${escape(c.name)} · Level ${level} · ${total(ranks)} points` : page === 'saved' ? 'Named snapshots, saved on this device.' : 'Start with your class. Grow into your role.'}</p></div>
      ${page === 'guides' ? guides(c) : page === 'planner' ? planner() : savedView()}
      <section class="bottom-note"><span class="note-icon">✧</span><div><h3>Know the build behind your build.</h3><p>Talent data: beta ${dataBuild}. Community client snapshot, not independently verified against the current live client. No Legacy bonus points or in-game import codes.</p></div><button class="secondary" data-action="sources">Read sources ↗</button></section>
      <details class="sources" id="sources"><summary>Sources, snapshot limitations & privacy</summary><p>Game names, rank text, positions, and dependency metadata are from the public MMO Herald / wago.tools beta snapshot. Blizzard owns the game text and icons. Guides and the leveling route here are editorial starting advice, not simulated optimal builds or tested endgame rankings. Later hotfixes may change spells, racials, ranks, and prerequisites. The October developer deep dive differs from some snapshot labels; the planner keeps the snapshot’s data rather than silently mixing versions. Some source dependencies are inconsistent (including a cyclic Druid dependency); affected talents remain locked under source rules. Check your game client before spending gold on a respec.</p><p>Drafts and named builds stay in your browser. Share links contain talent allocations, not account details. External icons and fonts contact their respective providers. No account or analytics is required.</p>${referenceSources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${escape(name)} ↗</a>`).join('')}</details>
      </div></main><footer><span class="footer-brand">FOREVER <small>AN INDEPENDENT FIELD GUIDE</small></span><p>Made for the journey. Not affiliated with Blizzard Entertainment.<br>Warcraft and World of Warcraft are trademarks of Blizzard Entertainment.</p><span>SNAPSHOT ${dataBuild} <i>✦</i></span></footer>`;
  bind();
}

function guides(c) {
  const visible = classes.filter(c => (filter === 'All classes' || c.roles.includes(filter)) && `${c.name} ${c.specs.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  const guide = specGuides[c.id][spec];
  return `<div class="library-tools"><div class="filters" aria-label="Filter by role">${['All classes', 'Tank', 'Healer', 'Damage'].map(role => `<button class="${filter === role ? 'chosen' : ''}" data-filter="${role}" aria-pressed="${filter === role}">${role}</button>`).join('')}</div><label class="search"><span>⌕</span><input id="search" type="search" placeholder="Find your class..." aria-label="Search classes" value="${escape(search)}"/><kbd>/</kbd></label></div>
    <div class="class-grid">${visible.map(cls => `<button class="class-card ${selected === cls.id ? 'selected' : ''}" style="--class-color:${cls.color}" data-class="${cls.id}" aria-pressed="${selected === cls.id}"><img src="${image(cls.icon)}" alt="" loading="lazy"/><div><h3>${cls.name}</h3><span>${cls.roles.join(' · ')}</span></div><span class="class-arrow">${selected === cls.id ? '✓' : '↗'}</span></button>`).join('') || '<p class="empty">No classes found. Try another name or role.</p>'}</div>
    <section class="class-detail" style="--class-color:${c.color}"><aside class="class-intro"><div class="eyebrow">CLASS SPOTLIGHT <span>0${classes.indexOf(c) + 1} / 09</span></div><div class="spotlight-title"><img src="${image(c.icon)}" alt=""/><h2>${c.name}</h2></div><h3>${c.line}</h3><p>${c.description}</p><div class="class-facts"><div><span>RESOURCE</span>${c.resource}</div><div><span>ARMOR</span>${c.armor}</div><div><span>PLAYSTYLE</span>${c.style}</div></div></aside>
    <div class="guide-body"><div class="guide-heading"><span>FIND YOUR SPECIALIZATION</span><span class="draft">${selected === 'shaman' && spec === 2 ? 'TROLL · FEATURED GUIDE' : 'STARTER GUIDE'}</span></div><div class="spec-tabs" role="tablist" aria-label="Specialization">${c.specs.map((name, i) => `<button role="tab" id="spec-${i}" aria-controls="spec-panel" aria-selected="${i === spec}" tabindex="${i === spec ? 0 : -1}" data-spec="${i}" class="${i === spec ? 'current' : ''}">${name}</button>`).join('')}</div>
    <div role="tabpanel" id="spec-panel" aria-labelledby="spec-${spec}" class="spec-copy"><div class="eyebrow">${c.specs[spec].toUpperCase()} · START HERE</div><h3>${escape(guide[0])}</h3><p>${escape(guide[1])}</p><h4>In practice</h4><p>${escape(guide[2])}</p><h4>Equipment approach</h4><p>${escape(guide[3])}</p><ul class="tips">${c.tips.map(tip => `<li><span>✦</span>${escape(tip)}</li>`).join('')}</ul></div><div class="guide-actions"><button class="primary" data-action="open-planner">Open ${c.name} talent planner <span>↗</span></button><span>3 trees · saved locally</span></div></div></section>
    ${selected === 'shaman' && spec === 2 ? restorationGuide() : '<p class="editorial-note">Starter principles, not a tested rotation or an optimized talent allocation. Read the exact talent descriptions in the planner and verify them in game.</p>'}`;
}

function restorationGuide() {
  const build = levelingBuild(guideLevel), trees = getTrees('shaman');
  const next = restorationRoute[budget(guideLevel)];
  const groups = [];
  restorationRoute.forEach((name, index) => {
    const previous = groups.at(-1);
    if (previous?.name === name) previous.end = index + 10;
    else groups.push({ name, start: index + 10, end: index + 10 });
  });
  const steps = restorationRoute.slice(0, budget(guideLevel));
  const currentTalent = trees.flatMap(tree => tree.talents).find(talent => talent.name === steps.at(-1));
  return `<section class="resto-feature" id="leveling-guide"><div class="feature-heading"><div><div class="eyebrow">YOUR FEATURED PATH · HEALING-FIRST</div><h2>Troll Restoration Shaman</h2><p>From your first talent point to a full level-60 healing build.</p></div><span class="feature-seal">✧<small>RESTORATION</small></span></div>
    <div class="status-warning">This is a proposed dungeon-healing leveling route, not a proven fastest solo build. It uses beta ${dataBuild}; check your live-client tooltips. Your race does not change the point budget.</div>
    <div class="leveling-layout"><div class="leveling-summary"><label for="guide-level">Your character level <strong>${guideLevel}</strong></label><input id="guide-level" aria-label="Leveling guide level" type="range" min="10" max="60" value="${guideLevel}"/><div class="range-labels"><span>10 · first point</span><span>60 · 51 points</span></div><div class="level-allocation">${trees.map(tree => `<div><b>${treeTotal(build.ranks, tree)}</b><span>${tree.name}</span></div>`).join('')}</div><h3>At level ${guideLevel}</h3><p><strong>${steps.at(-1)}</strong> → rank <strong>${build.ranks[currentTalent.id]} / ${currentTalent.max}</strong>.</p><p>${escape(levelingReasons[currentTalent.name])}</p><p>${next ? `Next at level ${guideLevel + 1}: <strong>${escape(next)}</strong>.` : 'All 51 points allocated. Adapt utility choices to your group.'}</p><button class="primary" data-action="apply-leveling">Load level ${guideLevel} talents ↗</button><p class="microcopy">Replaces your Shaman draft after confirmation. Named saves stay unchanged.</p><div class="milestones"><h3>Healing milestones</h3>${[[20, 'Water Shield'], [25, 'Mana Tide Totem'], [30, 'Nature’s Swiftness'], [40, 'Riptide']].map(([at, name]) => `<button data-guide-level="${at}" class="${guideLevel >= at ? 'reached' : ''}"><b>${at}</b> ${name}<span>${guideLevel >= at ? '✓' : '→'}</span></button>`).join('')}</div></div>
    <div class="leveling-table-wrap"><table class="leveling-table"><caption>Where every leveling talent point goes</caption><thead><tr><th scope="col">Level</th><th scope="col">Spend points in</th><th scope="col">Points</th></tr></thead><tbody>${groups.map(group => `<tr class="${guideLevel >= group.end ? 'complete' : guideLevel >= group.start ? 'in-progress' : ''}"><th scope="row">${group.start}${group.end !== group.start ? `–${group.end}` : ''}</th><td><details class="talent-reason"><summary>${escape(group.name)}</summary><p>${escape(levelingReasons[group.name])}</p></details>${guideLevel >= group.start && guideLevel <= group.end ? '<span class="current-step">YOU ARE HERE</span>' : ''}</td><td>${group.end - group.start + 1}</td></tr>`).join('')}</tbody></table><p class="microcopy">Tap a talent name to see why it is chosen. Levels 10–40 reach Riptide; 41–50 add healing utility. Levels 51–60 add Enhancement-side Intellect and critical chance. This is one transparent route, not a mandatory respec schedule.</p></div></div>
    <div class="resto-sections">${restorationSections.map(([heading, tips], index) => `<details ${index === 0 ? 'open' : ''}><summary>${heading}</summary><ul>${tips.map(tip => `<li>${escape(tip)}</li>`).join('')}</ul></details>`).join('')}<details><summary>Mouseover healing macros</summary><p>English-client spell names. Test outside combat after learning each spell. These select a friendly living mouseover, then a friendly target, otherwise yourself. They do not automatically choose heal ranks or play for you.</p>${healingMacros.map(([name, code], index) => `<div class="macro"><h3>${name}</h3><pre><code>${escape(code)}</code></pre><button class="secondary" data-copy-macro="${index}">Copy macro</button></div>`).join('')}</details></div></section>`;
}

function planner() {
  const c = current(), trees = currentTrees();
  return `<div class="planner-banner"><div><span class="draft">${c.name.toUpperCase()} · TALENT PLANNER</span><p>Beta snapshot ${dataBuild} · 51 base points at level 60 · no Legacy bonuses</p></div><button class="secondary" data-action="sources">Data notes ↗</button></div>
    <div class="planner-class-picker"><label for="planner-class">Class</label><select id="planner-class">${classes.map(cls => `<option value="${cls.id}" ${selected === cls.id ? 'selected' : ''}>${cls.name}</option>`).join('')}</select><label class="talent-search" for="talent-search">Find talent <input id="talent-search" type="search" value="${escape(talentSearch)}" placeholder="Name or effect..."/></label>${selected === 'shaman' ? '<button class="secondary" data-action="leveling">Restoration leveling path ↗</button>' : ''}</div>
    ${selected === 'druid' ? '<aside class="status-warning">Source warning: Nature’s Majesty and Nature’s Splendor list each other as prerequisites. Neither can be learned under these source rules. Verify this dependency in game; the snapshot is not presented as fully verified.</aside>' : ''}
    <div class="planner-toolbar"><div class="level-control"><label for="level">Character level</label><input id="level" type="number" min="10" max="60" value="${level}"/></div><div class="point-counter"><b>${budget(level) - total(ranks)}</b> points left <span>/ ${budget(level)}</span></div><div class="planner-actions"><button class="secondary" data-action="undo" ${!undo.length ? 'disabled' : ''}>Undo</button><button class="secondary" data-action="reset">Reset</button><button class="secondary" data-action="save">Save as…</button><button class="primary" data-action="share">Share build ↗</button></div></div>
    <p class="planner-help">Click to add a rank. Shift-click or right-click to refund. Focus a talent to read its current and next rank; use the + / − controls below on touch screens.</p>
    <div class="trees">${trees.map((tree, ti) => `<section class="tree" style="--tree-color:${tree.color}"><header><img src="${image(tree.icon)}" alt=""/><h3>${tree.name}</h3><b>${treeTotal(ranks, tree)}</b></header><button class="tree-reset" data-reset-tree="${ti}">Reset ${tree.name}</button><div class="talent-rows">${Array.from({ length: Math.max(7, ...tree.talents.map(t => t.row + 1)) }, (_, row) => `<div class="talent-row"><span class="row-label">${row * 5}</span>${tree.talents.filter(t => t.row === row).map(t => {
      const rank = ranks[t.id] || 0, error = canAdd(ranks, t, tree, level);
      const match = !talentSearch || `${t.name} ${t.descriptions.join(' ')}`.toLowerCase().includes(talentSearch.toLowerCase());
      return `<button data-talent="${t.id}" style="grid-column:${t.col + 1}" class="talent ${rank ? 'learned' : ''} ${error && !rank ? 'locked' : ''} ${rank === t.max ? 'maxed' : ''} ${inspected === t.id ? 'inspected' : ''} ${!match ? 'search-dimmed' : ''}" aria-label="${escape(t.name)}, ${rank} of ${t.max} ranks" title="${escape(t.name)} — ${rank}/${t.max}"><img src="${image(t.icon)}" alt="" loading="lazy"/><span>${rank}/${t.max}</span><small>${escape(t.name)}</small>${t.prerequisites.length ? '<i class="dependency-mark" aria-label="Has prerequisite">↳</i>' : ''}</button>`;
    }).join('')}</div>`).join('')}</div></section>`).join('')}</div>
    <div class="talent-info" aria-live="polite">${talentInfo()}</div>
    <div class="build-transfer"><button class="secondary" data-action="export">Export build file</button><label class="file-button secondary">Import build file<input id="import-file" type="file" accept=".json,application/json"/></label><button class="secondary" data-action="import">Paste build / share link</button><span>App-specific snapshots, not in-game codes.</span></div>`;
}

function findTalent(id) { for (const tree of currentTrees()) { const talent = tree.talents.find(t => t.id === id); if (talent) return { tree, talent }; } return null; }
function talentInfo() {
  const found = findTalent(inspected);
  if (!found) return '<span class="note-icon">◇</span><div><h3>Your build, one point at a time.</h3><p>Select or focus a talent to read its exact snapshot rank text.</p></div>';
  const { tree, talent: t } = found, rank = ranks[t.id] || 0;
  const error = canAdd(ranks, t, tree, level);
  return `<img src="${image(t.icon)}" alt=""/><div><h3>${escape(t.name)} <span>${rank} / ${t.max}</span></h3>${rank ? `<p><strong>Current rank:</strong> ${escape(t.descriptions[rank - 1])}</p>` : ''}${rank < t.max ? `<p><strong>Next rank:</strong> ${escape(t.descriptions[rank])}</p>` : ''}<small>${escape(error || 'Available to learn.')}${t.prerequisites.length ? ` Prerequisite: ${t.prerequisites.map(id => escape(tree.talents.find(other => other.id === id)?.name || 'missing source talent')).join(', ')}.` : ''} ${t.gaps ? 'Source contains unresolved values; verify in game.' : 'Snapshot values may differ from current hotfixes.'}</small></div><div class="rank-controls"><button class="secondary" data-action="refund" aria-label="Refund one rank" ${!rank ? 'disabled' : ''}>−</button><button class="primary" data-action="learn" aria-label="Learn one rank" ${error ? 'disabled' : ''}>+</button></div>`;
}
function savedView() {
  return `<section class="saved-card"><img src="${image(current().icon)}" alt=""/><div><span class="draft">AUTOSAVED DRAFT · ${current().name.toUpperCase()}</span><h3>Your ${current().name} draft</h3><p>Level ${level} · ${currentTrees().map(tree => `${treeTotal(ranks, tree)} ${tree.name}`).join(' / ')}</p><p>Each class has its own draft. Save a named snapshot to keep multiple variants.</p></div><button class="primary" data-page="planner">Continue building ↗</button></section><div class="saved-heading"><h3>Named builds <span>(${library.length}/50)</span></h3><button class="secondary" data-action="import">Import a build</button></div><div class="saved-grid">${library.map(item => {
    const build = loadBuild(item.build), c = classes.find(c => c.id === build.classId);
    return `<article class="named-build"><img src="${image(c.icon)}" alt=""/><div><h3>${escape(item.name)}</h3><p>${c.name} · Level ${build.level} · ${total(build.ranks)} points</p></div><div class="named-actions"><button class="primary" data-load="${escape(item.id)}">Load</button><button class="secondary" data-delete="${escape(item.id)}">Delete</button></div></article>`;
  }).join('') || '<div class="empty-library"><span>✧</span><h3>A new adventure awaits.</h3><p>Use “Save as…” in the planner to keep your first named build. No account needed.</p></div>'}</div><p class="microcopy">These builds are stored only in this browser. Export files or keep share links before clearing browser data.</p>`;
}

function changeRank(refund = false) {
  const found = findTalent(inspected); if (!found) return;
  const { tree, talent } = found;
  if (refund) {
    if (!ranks[talent.id]) return;
    const next = { ...ranks, [talent.id]: ranks[talent.id] - 1 };
    if (!valid(next, level, selected)) return toast('Refund dependent talents or higher rows first.');
    remember(); ranks = next;
  } else {
    const error = canAdd(ranks, talent, tree, level);
    if (error) { render(); return toast(error); }
    remember(); ranks = { ...ranks, [talent.id]: (ranks[talent.id] || 0) + 1 };
  }
  persist(); render(); document.querySelector(`[data-talent="${talent.id}"]`)?.focus({ preventScroll: true });
}
function focusContent() { document.querySelector('#content').scrollIntoView({ behavior: 'smooth' }); }
function openLeveling() { switchClass('shaman'); spec = 2; page = 'guides'; render(); document.querySelector('#leveling-guide').scrollIntoView({ behavior: 'smooth' }); }
function parseImport(value) {
  let text = value.trim();
  if (/^https?:/i.test(text)) { try { text = new URLSearchParams(new URL(text).hash.slice(1)).get('build') || ''; } catch { return null; } }
  return loadBuild(text);
}
function importBuild(text) {
  const build = parseImport(text); if (!build) return toast('Invalid build or incompatible snapshot. No changes were made.');
  const old = loadBuild(readStorage(draftKey(build.classId)) || '');
  if (old && total(old.ranks) && !confirm(`Replace your ${build.classId} draft with this imported build? Named saves are unchanged.`)) return;
  openBuild(build); persist(); render(); focusContent(); toast('Build imported.');
}
async function copyText(text, message) { try { await navigator.clipboard.writeText(text); toast(message); } catch { prompt('Copy this text:', text); } }
function bind() {
  document.querySelectorAll('[data-page]').forEach(el => el.onclick = () => { page = el.dataset.page; render(); focusContent(); });
  document.querySelectorAll('[data-class]').forEach(el => el.onclick = () => { switchClass(el.dataset.class); render(); });
  document.querySelectorAll('[data-filter]').forEach(el => el.onclick = () => { filter = el.dataset.filter; render(); });
  document.querySelectorAll('[data-spec]').forEach(el => {
    el.onclick = () => { spec = Number(el.dataset.spec); render(); document.querySelector(`#spec-${spec}`)?.focus({ preventScroll: true }); };
    el.onkeydown = event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); spec = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (spec + (event.key === 'ArrowRight' ? 1 : 2)) % 3; render(); document.querySelector(`#spec-${spec}`).focus({ preventScroll: true }); } };
  });
  for (const [id, setter] of [['search', value => search = value], ['talent-search', value => talentSearch = value]]) document.querySelector(`#${id}`)?.addEventListener('input', event => {
    setter(event.target.value); const position = event.target.selectionStart; render(); const input = document.querySelector(`#${id}`); input.focus({ preventScroll: true }); input.setSelectionRange(position, position);
  });
  document.querySelector('#planner-class')?.addEventListener('change', event => { switchClass(event.target.value); render(); });
  document.querySelector('#guide-level')?.addEventListener('input', event => { guideLevel = Number(event.target.value); document.querySelector('label[for="guide-level"] strong').textContent = guideLevel; });
  document.querySelector('#guide-level')?.addEventListener('change', () => { render(); document.querySelector('#guide-level').focus({ preventScroll: true }); });
  document.querySelectorAll('[data-guide-level]').forEach(el => el.onclick = () => { guideLevel = Number(el.dataset.guideLevel); render(); });
  document.querySelector('#level')?.addEventListener('change', event => {
    const next = Number(event.target.value);
    if (!Number.isInteger(next) || next < 10 || next > 60) { event.target.value = level; return toast('Choose a whole level between 10 and 60.'); }
    if (!valid(ranks, next, selected)) { event.target.value = level; return toast('Refund points before lowering your level.'); }
    remember(); level = next; persist(); render();
  });
  document.querySelectorAll('[data-talent]').forEach(el => {
    el.onclick = event => { inspected = Number(el.dataset.talent); changeRank(event.shiftKey); };
    el.oncontextmenu = event => { event.preventDefault(); inspected = Number(el.dataset.talent); changeRank(true); };
    el.onfocus = () => { inspected = Number(el.dataset.talent); document.querySelector('.talent-info').innerHTML = talentInfo(); bindRankControls(); };
  });
  document.querySelectorAll('[data-reset-tree]').forEach(el => el.onclick = () => {
    const tree = currentTrees()[Number(el.dataset.resetTree)]; if (!treeTotal(ranks, tree) || !confirm(`Reset all points in ${tree.name}?`)) return;
    remember(); ranks = Object.fromEntries(Object.entries(ranks).filter(([id]) => !tree.talents.some(t => String(t.id) === id))); persist(); render();
  });
  document.querySelectorAll('[data-copy-macro]').forEach(el => el.onclick = () => copyText(healingMacros[Number(el.dataset.copyMacro)][1], 'Macro copied.'));
  document.querySelectorAll('[data-load]').forEach(el => el.onclick = () => importBuild(library.find(item => item.id === el.dataset.load).build));
  document.querySelectorAll('[data-delete]').forEach(el => el.onclick = () => {
    const item = library.find(item => item.id === el.dataset.delete); if (!confirm(`Delete “${item.name}”? Your active draft is unchanged.`)) return;
    const next = library.filter(other => other.id !== item.id); if (!writeStorage('forever-library-v2', JSON.stringify(next))) return; library = next; render();
  });
  document.querySelector('#import-file')?.addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    if (file.size > 30000) return toast('This file is too large to be a build snapshot.');
    try { importBuild(await file.text()); } catch { toast('Could not read that file.'); }
  });
  document.querySelectorAll('[data-action]').forEach(el => el.onclick = () => action(el.dataset.action));
}
function bindRankControls() { document.querySelectorAll('.rank-controls [data-action]').forEach(el => el.onclick = () => changeRank(el.dataset.action === 'refund')); }
async function action(name) {
  switch (name) {
    case 'leveling': openLeveling(); break;
    case 'open-planner': page = 'planner'; render(); focusContent(); break;
    case 'sources': { const details = document.querySelector('#sources'); details.open = true; details.scrollIntoView({ behavior: 'smooth' }); break; }
    case 'learn': changeRank(); break;
    case 'refund': changeRank(true); break;
    case 'undo': { const previous = undo.pop(); if (previous) { ranks = previous.ranks; level = previous.level; persist(); render(); } break; }
    case 'reset': if (total(ranks) && confirm(`Clear all points in your ${current().name} draft?`)) { remember(); ranks = {}; persist(); render(); } break;
    case 'apply-leveling': {
      const previous = loadBuild(readStorage(draftKey('shaman')) || '');
      if (previous && total(previous.ranks) && !confirm('Replace your Shaman draft with this healing-first leveling build? Named saves stay unchanged.')) break;
      openBuild(levelingBuild(guideLevel)); persist(); render(); focusContent(); toast(`Level ${guideLevel} Restoration leveling talents loaded.`); break;
    }
    case 'save': {
      if (library.length >= 50) return toast('The library is full. Export or delete an old build first.');
      const name = prompt('Name this build:', `${current().name} · Level ${level}`)?.trim().slice(0, 80); if (!name) break;
      const next = [...library, { id: crypto.randomUUID(), name, build: serialize(ranks, level, selected) }];
      if (!writeStorage('forever-library-v2', JSON.stringify(next))) break; library = next; render(); toast('Named build saved on this device.'); break;
    }
    case 'share': { const url = new URL(location.href); url.hash = new URLSearchParams({ build: serialize(ranks, level, selected) }).toString(); await copyText(url.href, 'Build link copied.'); break; }
    case 'export': {
      const url = URL.createObjectURL(new Blob([serialize(ranks, level, selected)], { type: 'application/json' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `forever-${selected}-level-${level}.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); break;
    }
    case 'import': { const text = prompt('Paste an app build JSON or a shared build URL:'); if (text) importBuild(text); break; }
  }
}
document.addEventListener('keydown', event => { if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { const input = document.querySelector('#search') || document.querySelector('#talent-search'); if (input) { event.preventDefault(); input.focus(); } } });
window.addEventListener('hashchange', () => { const value = new URLSearchParams(location.hash.slice(1)).get('build'); if (value) importBuild(value); });
render();
