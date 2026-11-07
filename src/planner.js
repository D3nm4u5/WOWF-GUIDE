import { getTrees } from './data.js';
import { restorationRoute } from './guides.js';

export const buildVersion = 'forever-69913-v2';
export const total = ranks => Object.values(ranks).reduce((sum, rank) => sum + rank, 0);
export const budget = level => Math.max(0, Math.min(60, level) - 9);
export const treeTotal = (ranks, tree) => tree.talents.reduce((sum, talent) => sum + (ranks[talent.id] || 0), 0);
export function canAdd(ranks, talent, tree, level) {
  if ((ranks[talent.id] || 0) >= talent.max) return 'Maximum rank reached.';
  if (total(ranks) >= budget(level)) return 'No talent points remaining at this level.';
  const eligible = tree.talents.filter(other => Array.isArray(talent.counts)
    ? talent.counts.includes(other.id)
    : talent.counts === 'above' ? other.row < talent.row : other.id !== talent.id);
  const invested = eligible.reduce((sum, other) => sum + (ranks[other.id] || 0), 0);
  if (invested < talent.requires) return `Requires ${talent.requires} points ${talent.counts === 'above' ? 'in earlier rows of' : 'in the eligible talents of'} ${tree.name}.`;
  for (const id of talent.prerequisites) {
    const prerequisite = tree.talents.find(other => other.id === id);
    if (!prerequisite) return 'This prerequisite is missing from the source snapshot.';
    if ((ranks[id] || 0) < prerequisite.max) return `Requires full ranks in ${prerequisite.name}.`;
  }
  return '';
}
export function valid(ranks, level, classId = 'mage') {
  const trees = getTrees(classId);
  if (!trees.length || !ranks || typeof ranks !== 'object' || Array.isArray(ranks)) return false;
  if (!Number.isInteger(level) || level < 10 || level > 60) return false;
  const known = trees.flatMap(tree => tree.talents);
  if (Object.entries(ranks).some(([id, rank]) => !known.some(talent => String(talent.id) === id) || !Number.isInteger(rank) || rank < 0)) return false;
  if (total(ranks) > budget(level)) return false;
  for (const tree of trees) for (const talent of tree.talents) {
    const rank = ranks[talent.id] || 0;
    if (rank > talent.max) return false;
    if (rank && canAdd({ ...ranks, [talent.id]: rank - 1 }, talent, tree, level)) return false;
  }
  // An allocation must also be possible to learn in sequence, not merely mutually supported.
  const learned = {};
  let remaining = total(ranks);
  while (remaining) {
    let progress = false;
    for (const tree of trees) for (const talent of tree.talents) {
      if ((learned[talent.id] || 0) < (ranks[talent.id] || 0) && !canAdd(learned, talent, tree, level)) {
        learned[talent.id] = (learned[talent.id] || 0) + 1;
        remaining--; progress = true;
      }
    }
    if (!progress) return false;
  }
  return true;
}
export function loadBuild(value) {
  try {
    if (typeof value !== 'string' || value.length > 30000) return null;
    const data = JSON.parse(value);
    if (!data || data.version !== buildVersion || typeof data.classId !== 'string' || !valid(data.ranks, data.level, data.classId)) return null;
    return { classId: data.classId, level: data.level, ranks: data.ranks, version: buildVersion };
  } catch { return null; }
}
export const serialize = (ranks, level, classId = 'mage') => JSON.stringify({ version: buildVersion, classId, level, ranks });
export function levelingBuild(level) {
  if (!Number.isInteger(level) || level < 10 || level > 60) throw new Error('Choose a whole level between 10 and 60.');
  const trees = getTrees('shaman'), ranks = {};
  for (const name of restorationRoute.slice(0, budget(level))) {
    const tree = trees.find(tree => tree.talents.some(talent => talent.name === name));
    const talent = tree?.talents.find(talent => talent.name === name);
    if (!talent || canAdd(ranks, talent, tree, level)) throw new Error(`Invalid leveling step: ${name}`);
    ranks[talent.id] = (ranks[talent.id] || 0) + 1;
  }
  return { classId: 'shaman', level, ranks };
}
