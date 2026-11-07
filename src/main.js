import './style.css';
import { classes, trees, sources } from './data.js';
import { total, budget, treeTotal, canAdd, valid, loadBuild, serialize } from './planner.js';

const image = icon => `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
const app = document.querySelector('#app');
let selected = 'mage', page = 'guides', filter = 'All classes', search = '', spec = 2;
let ranks = {}, level = 60, inspected = null, storageWarning = false;
try {
  const hash = new URLSearchParams(location.hash.slice(1));
  const shared = hash.get('build');
  const saved = loadBuild(shared || localStorage.getItem('forever-mage') || '');
  if (saved) { ranks = saved.ranks; level = saved.level; if (shared) page = 'planner'; }
  if (shared && !saved) setTimeout(() => toast('This build link is invalid or uses a different draft version.'), 0);
} catch { storageWarning = true; }

const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function persist() {
  try { localStorage.setItem('forever-mage', serialize(ranks, level)); } catch { toast('Local saving is unavailable. Use Share build to keep your work.'); }
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}
function toast(text) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.role = 'status'; el.textContent = text;
  document.body.append(el); setTimeout(() => el.remove(), 4500);
}
function render() {
  const c = classes.find(c => c.id === selected);
  app.innerHTML = `
    <header class="header"><a class="brand" href="/" aria-label="Forever home"><span class="brand-mark">F<span>✦</span></span><span>FOREVER<small>THE ADVENTURER’S FIELD GUIDE</small></span></a>
      <nav aria-label="Main navigation"><button data-page="guides" class="${page === 'guides' ? 'active' : ''}">Class guides</button><button data-page="planner" class="${page === 'planner' ? 'active' : ''}">Talent planner</button><button data-page="saved" class="${page === 'saved' ? 'active' : ''}">My build <span class="nav-count">${total(ranks) ? '1' : '0'}</span></button></nav>
      <span class="version"><i></i> FOREVER <b>1.60.1</b></span>
    </header>
    <main><section class="hero"><div class="hero-art" aria-hidden="true"></div><div class="hero-inner"><div class="eyebrow"><span></span> YOUR NEXT ADVENTURE STARTS HERE</div>
      <h1>Old world.<br>New <em>possibilities.</em></h1><p>Find your class. Forge your build.<br>Your companion for a new chapter in Azeroth.</p>
      <button class="primary" data-action="explore">Explore the classes <span>↓</span></button><div class="hero-meta"><span>9 iconic classes</span><b>✦</b><span>Built for Forever 1.60.1</span></div></div>
      <div class="hero-caption"><span>✦</span> THE JOURNEY IS THE REWARD</div></section>
    <div class="content" id="content"><div class="section-heading"><div><div class="eyebrow">THE FIELD GUIDE <span class="short-line"></span></div><h2>${page === 'planner' ? 'Make every point count.' : page === 'saved' ? 'Your next great adventure.' : 'Choose your calling.'}</h2></div><p>${page === 'planner' ? 'Experiment. Refine. Make it yours.' : page === 'saved' ? 'Your Mage draft, saved on this device.' : 'Nine classes. Countless ways to play.'}</p></div>
      ${page === 'guides' ? guides(c) : page === 'planner' ? planner() : savedView()}
      <section class="bottom-note"><span class="note-icon">✧</span><div><h3>A familiar world. A fresh perspective.</h3><p>Built for World of Warcraft: Forever, version 1.60.1. General class guidance is a starting point, not a tested endgame ranking.</p></div><a href="https://worldofwarcraft.blizzard.com/en-us/news/24307383" target="_blank" rel="noopener noreferrer">Discover Forever ↗</a></section>
      <details class="sources"><summary>Data sources & verification status</summary><p>This is an independent work-in-progress. The Mage calculator uses a manually curated, incomplete draft of talent names, ranks, and positions. It is not an authoritative 1.60.1 export, does not model Legacy perks, and cannot import or export in-game talent codes. Class overviews are general editorial guidance, not tested builds. Sources may predate subsequent hotfixes.</p>${sources.map(([name,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join('')}</details>
    </div></main><footer><span class="footer-brand">FOREVER <small>AN INDEPENDENT FIELD GUIDE</small></span><p>Made for the journey. Not affiliated with Blizzard Entertainment.<br>Warcraft and World of Warcraft are trademarks of Blizzard Entertainment.</p><span>VERSION 1.60.1 <i>✦</i></span></footer>`;
  bind();
}
function guides(c) {
  const visible = classes.filter(c => (filter === 'All classes' || c.roles.includes(filter)) && `${c.name} ${c.specs.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return `<div class="library-tools"><div class="filters" aria-label="Filter by role">${['All classes','Tank','Healer','Damage'].map(f => `<button class="${filter === f ? 'chosen' : ''}" data-filter="${f}" aria-pressed="${filter === f}">${f === 'All classes' ? 'All classes' : f === 'Damage' ? '⚔ Damage' : f === 'Tank' ? '◇ Tank' : '✧ Healer'}</button>`).join('')}</div><label class="search"><span>⌕</span><input id="search" placeholder="Find your class..." aria-label="Search classes" value="${escape(search)}"/><kbd>/</kbd></label></div>
  <div class="class-grid">${visible.map(cls => `<button class="class-card ${selected === cls.id ? 'selected' : ''}" style="--class-color:${cls.color}" data-class="${cls.id}" aria-pressed="${selected === cls.id}"><img src="${image(cls.icon)}" alt="" loading="lazy"/><div><h3>${cls.name}</h3><span>${cls.roles.join(' · ')}</span></div><span class="class-arrow">${selected === cls.id ? '✓' : '↗'}</span></button>`).join('') || '<p class="empty">No classes found. Try another name or role.</p>'}</div>
  <section class="class-detail" style="--class-color:${c.color}"><aside class="class-intro"><div class="eyebrow">CLASS SPOTLIGHT <span>0${classes.indexOf(c) + 1} / 09</span></div><div class="spotlight-title"><img src="${image(c.icon)}" alt=""/><h2>${c.name}</h2></div><h3>${c.line}</h3><p>${c.description}</p><div class="class-facts"><div><span>RESOURCE</span>${c.resource}</div><div><span>ARMOR</span>${c.armor}</div><div><span>PLAYSTYLE</span>${c.style}</div></div></aside>
  <div class="guide-body"><div class="guide-heading"><span>FIND YOUR SPECIALIZATION</span><span class="draft">STARTER OVERVIEW</span></div><div class="spec-tabs" role="tablist" aria-label="Specialization">${c.specs.map((s,i) => `<button role="tab" id="spec-${i}" aria-controls="spec-panel" aria-selected="${i === spec}" data-spec="${i}" class="${i === spec ? 'current' : ''}">${s}</button>`).join('')}</div>
  <div role="tabpanel" id="spec-panel" aria-labelledby="spec-${spec}" class="spec-copy"><div class="eyebrow">${c.specs[spec].toUpperCase()} · START HERE</div><h3>${specHeading(c)}</h3><p>${specDescription(c)}</p><ul class="tips">${c.tips.map(t => `<li><span>✦</span>${t}</li>`).join('')}</ul></div><div class="guide-actions"><button class="primary" data-action="open-planner">${c.id === 'mage' ? 'Open Mage talent planner' : 'Try the Mage demo planner'} <span>↗</span></button><span>${c.id === 'mage' ? 'Draft data · saved locally' : 'Other class planners coming next'}</span></div></div></section>`;
}
function specHeading(c) {
  if (c.id === 'mage') return ['Bend the rules of magic.', 'Turn a spark into an inferno.', 'Control the fight. Keep your distance.'][spec];
  return `Discover ${c.specs[spec]}.`;
}
function specDescription(c) {
  if (c.id === 'mage') return ['Arcane Blast sets up empowered follow-up spells. Explore the school’s Mana management and its interactions with your wider toolkit.', 'Fire rewards critical strikes and deliberate spell choices. Forever’s changes create new interactions between Fire and Frost magic.', 'Slows, roots, and careful positioning make Frost a control-focused starting point. Ice Lance and Fingers of Frost add new ways to capitalize on Frozen targets.'][spec];
  return `${c.specs[spec]} is one of ${c.name}’s three talent paths. These starting principles introduce the class; a version-verified talent allocation and specialization-specific rotation are not published yet.`;
}
function planner() {
  return `<div class="planner-banner"><div><span class="draft">MAGE · DRAFT CALCULATOR</span><p>Interactive prototype · incomplete talent subset · ranks and layout not verified against the 1.60.1 client.</p></div><a href="#sources" data-action="sources">About this data ↗</a></div>
  <div class="planner-toolbar"><div class="level-control"><label for="level">Character level</label><input id="level" type="number" min="10" max="60" value="${level}"/></div><div class="point-counter"><b>${budget(level) - total(ranks)}</b> points left <span>/ ${budget(level)}</span></div><div class="planner-actions"><button class="secondary" data-action="reset">Reset</button><button class="primary" data-action="share">Share build ↗</button></div></div>
  <p class="planner-help">Click a talent to add a rank. Shift-click or right-click to refund. Select a talent for details and touch-friendly controls.</p>
  <div class="trees">${trees.map((tree, ti) => `<section class="tree" style="--tree-color:${tree.color}"><header><img src="${image(tree.icon)}" alt=""/><h3>${tree.name}</h3><b>${treeTotal(ranks, tree)}</b></header><div class="talent-rows">${Array.from({length:7}, (_,row) => `<div class="talent-row"><span class="row-label">${row * 5}</span>${tree.talents.map((talent,index) => ({talent,index})).filter(({talent}) => talent.row === row).map(({talent:t,index}) => `<button data-talent="${ti}:${index}" class="talent ${(ranks[t.name] || 0) ? 'learned' : ''} ${canAdd(ranks,t,tree,level) && !ranks[t.name] ? 'locked' : ''}" aria-label="${escape(t.name)}, ${ranks[t.name] || 0} of ${t.max} ranks" title="${escape(t.name)} — ${ranks[t.name] || 0}/${t.max}"><img src="${image(t.icon)}" alt="" loading="lazy"/><span>${ranks[t.name] || 0}/${t.max}</span><small>${t.name}</small></button>`).join('')}</div>`).join('')}</div></section>`).join('')}</div>
  <div class="talent-info" aria-live="polite">${talentInfo()}</div>`;
}
function talentInfo() {
  if (!inspected) return '<span class="note-icon">◇</span><div><h3>Your build, one point at a time.</h3><p>Select a talent to view its description, requirements, and rank controls.</p></div>';
  const [ti, index] = inspected; const tree = trees[ti], t = tree.talents[index];
  return `<img src="${image(t.icon)}" alt=""/><div><h3>${t.name} <span>${ranks[t.name] || 0} / ${t.max}</span></h3><p>${t.description}</p><small>${canAdd(ranks,t,tree,level) || 'Available to learn.'} Draft description; exact values pending verification.</small></div><div class="rank-controls"><button class="secondary" data-action="refund" aria-label="Refund one rank">−</button><button class="primary" data-action="learn" aria-label="Learn one rank">+</button></div>`;
}
function savedView() {
  return `<section class="saved-card"><img src="${image('classicon_mage')}" alt=""/><div><span class="draft">LOCAL DRAFT · 1.60.1</span><h3>${total(ranks) ? 'Your Mage build' : 'A blank spellbook awaits.'}</h3><p>Level ${level} · ${trees.map(t => `${treeTotal(ranks,t)} ${t.name}`).join(' / ')}</p><p>Saved in this browser, without an account. Shared links contain a snapshot of your draft.</p></div><button class="primary" data-page="planner">${total(ranks) ? 'Continue building' : 'Create a build'} ↗</button></section>`;
}
function changeRank(refund = false) {
  const [ti,index] = inspected, tree = trees[ti], t = tree.talents[index];
  if (refund) {
    if (!ranks[t.name]) return;
    const next = {...ranks, [t.name]:ranks[t.name] - 1};
    if (!valid(next,level)) return toast('Refund dependent talents or higher rows first.');
    ranks = next;
  } else {
    const error = canAdd(ranks,t,tree,level); if (error) { render(); return toast(error); }
    ranks[t.name] = (ranks[t.name] || 0) + 1;
  }
  persist(); render();
  document.querySelector(`[data-talent="${ti}:${index}"]`)?.focus({preventScroll:true});
}
function bind() {
  document.querySelectorAll('[data-page]').forEach(el => el.onclick = () => { page = el.dataset.page; render(); document.querySelector('#content').scrollIntoView({behavior:'smooth'}); });
  document.querySelectorAll('[data-class]').forEach(el => el.onclick = () => { selected = el.dataset.class; spec = selected === 'mage' ? 2 : 0; render(); });
  document.querySelectorAll('[data-filter]').forEach(el => el.onclick = () => { filter = el.dataset.filter; render(); });
  document.querySelectorAll('[data-spec]').forEach(el => el.onclick = () => { spec = Number(el.dataset.spec); render(); document.querySelector(`#spec-${spec}`)?.focus({preventScroll:true}); });
  document.querySelector('#search')?.addEventListener('input', e => { search = e.target.value; const pos = e.target.selectionStart; render(); const input = document.querySelector('#search'); input.focus(); input.setSelectionRange(pos,pos); });
  document.querySelector('#level')?.addEventListener('change', e => {
    const next = Number(e.target.value);
    if (!Number.isInteger(next) || next < 10 || next > 60) { e.target.value = level; return toast('Choose a whole level between 10 and 60.'); }
    if (!valid(ranks,next)) { e.target.value = level; return toast('Refund points before lowering your level.'); }
    level = next; persist(); render();
  });
  document.querySelectorAll('[data-talent]').forEach(el => {
    el.onclick = e => { inspected = el.dataset.talent.split(':').map(Number); changeRank(e.shiftKey); };
    el.oncontextmenu = e => { e.preventDefault(); inspected = el.dataset.talent.split(':').map(Number); changeRank(true); };
  });
  document.querySelectorAll('[data-action]').forEach(el => el.onclick = async () => {
    switch(el.dataset.action) {
      case 'explore': document.querySelector('#content').scrollIntoView({behavior:'smooth'}); break;
      case 'open-planner': page = 'planner'; render(); document.querySelector('#content').scrollIntoView({behavior:'smooth'}); break;
      case 'sources': { const details = document.querySelector('.sources'); details.open = true; details.scrollIntoView({behavior:'smooth'}); break; }
      case 'reset': if (!total(ranks) || confirm('Clear all points in your Mage draft?')) { ranks = {}; persist(); render(); } break;
      case 'share': {
        const url = new URL(location.href); url.hash = new URLSearchParams({build:serialize(ranks,level)}).toString();
        try { await navigator.clipboard.writeText(url.href); toast('Build link copied. Share it with your party.'); }
        catch { prompt('Copy your build link:', url.href); } break;
      }
      case 'learn': changeRank(); break;
      case 'refund': changeRank(true); break;
    }
  });
}
document.addEventListener('keydown', e => { if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { const input = document.querySelector('#search'); if (input) { e.preventDefault(); input.focus(); } } });
window.addEventListener('hashchange', () => {
  const value = new URLSearchParams(location.hash.slice(1)).get('build');
  if (!value) return;
  const build = loadBuild(value);
  if (!build) return toast('This build link is invalid or uses a different draft version.');
  ranks = build.ranks; level = build.level; page = 'planner'; inspected = null; render();
});
render();
if (storageWarning) toast('Local storage is unavailable. Use shared links to keep your draft.');
