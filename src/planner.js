import { trees } from './data.js';
export const total = ranks => Object.values(ranks).reduce((sum, rank) => sum + rank, 0);
export const budget = level => Math.max(0, Math.min(60, level) - 9);
export const treeTotal = (ranks, tree) => tree.talents.reduce((sum, t) => sum + (ranks[t.name] || 0), 0);
export function canAdd(ranks, talent, tree, level) {
  if ((ranks[talent.name] || 0) >= talent.max) return 'Maximum rank reached.';
  if (total(ranks) >= budget(level)) return 'No talent points remaining at this level.';
  const earlier = tree.talents.filter(t => t.row < talent.row).reduce((sum, t) => sum + (ranks[t.name] || 0), 0);
  if (earlier < talent.row * 5) return `Requires ${talent.row * 5} points in earlier ${tree.name} rows.`;
  if (talent.prerequisite) {
    const prereq = tree.talents.find(t => t.name === talent.prerequisite);
    if ((ranks[prereq.name] || 0) < prereq.max) return `Requires full ranks in ${prereq.name}.`;
  }
  return '';
}
export function valid(ranks, level) {
  if (!Number.isInteger(level) || level < 10 || level > 60 || total(ranks) > budget(level)) return false;
  const known = trees.flatMap(tree => tree.talents);
  if (Object.keys(ranks).some(name => !known.some(t => t.name === name))) return false;
  for (const tree of trees) for (const talent of tree.talents) {
    const rank = ranks[talent.name] || 0;
    if (!Number.isInteger(rank) || rank < 0 || rank > talent.max) return false;
    if (rank) {
      const copy = { ...ranks, [talent.name]: rank - 1 };
      if (canAdd(copy, talent, tree, level)) return false;
    }
  }
  return true;
}
export function loadBuild(value) {
  try {
    const data = JSON.parse(value);
    if (data.version !== '1.60.1-draft-1' || !data.ranks || typeof data.ranks !== 'object' || Array.isArray(data.ranks) || !valid(data.ranks, data.level)) return null;
    return data;
  } catch { return null; }
}
export const serialize = (ranks, level) => JSON.stringify({ version: '1.60.1-draft-1', level, ranks });
