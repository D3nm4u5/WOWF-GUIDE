import test from 'node:test';
import assert from 'node:assert/strict';
import { classes, getTrees } from '../src/data.js';
import { specGuides, restorationRoute } from '../src/guides.js';
import { budget, canAdd, valid, loadBuild, serialize, total, levelingBuild } from '../src/planner.js';

test('nine classes have three complete snapshot trees and original specialization guidance', () => {
  assert.equal(classes.length, 9);
  let count = 0;
  for (const c of classes) {
    const trees = getTrees(c.id), ids = [];
    assert.equal(trees.length, 3); assert.equal(specGuides[c.id].length, 3);
    for (const tree of trees) {
      assert.ok(tree.talents.length >= 10);
      const positions = [];
      for (const t of tree.talents) {
        count++; ids.push(t.id); positions.push(`${t.row}:${t.col}`);
        assert.ok(Number.isInteger(t.id)); assert.ok(t.name); assert.ok(t.icon);
        assert.ok(t.row >= 0 && t.row <= 6); assert.ok(t.col >= 0 && t.col <= 3);
        assert.equal(t.descriptions.length, t.max);
        assert.ok(t.descriptions.every(description => typeof description === 'string' && description.length));
        assert.ok(t.prerequisites.every(id => tree.talents.some(other => other.id === id)));
      }
      assert.equal(new Set(positions).size, positions.length, `${c.id} ${tree.name} has overlapping positions`);
    }
    assert.equal(new Set(ids).size, ids.length);
  }
  assert.equal(count, 469);
});
test('levels have the correct base point budgets', () => {
  assert.equal(budget(10), 1); assert.equal(budget(20), 11); assert.equal(budget(60), 51);
});
test('every Restoration leveling step is legal, spends exactly its budget, and adds one point', () => {
  let previous = {};
  assert.equal(restorationRoute.length, 51);
  for (let level = 10; level <= 60; level++) {
    const build = levelingBuild(level);
    assert.equal(valid(build.ranks, level, 'shaman'), true, `Level ${level}`);
    assert.equal(total(build.ranks), budget(level));
    assert.equal(Object.keys(build.ranks).reduce((sum, id) => sum + build.ranks[id] - (previous[id] || 0), 0), 1);
    previous = build.ranks;
  }
});
test('Restoration route reaches healing milestones at the documented levels', () => {
  for (const [level, name] of [[20, 'Water Shield'], [25, 'Mana Tide Totem'], [30, "Nature's Swiftness"], [40, 'Riptide']]) {
    const talent = getTrees('shaman')[2].talents.find(t => t.name === name);
    assert.equal(levelingBuild(level).ranks[talent.id], 1);
    assert.equal(levelingBuild(level - 1).ranks[talent.id] || 0, 0);
  }
});
test('maximum ranks, point budgets, and source row requirements are enforced', () => {
  const tree = getTrees('shaman')[2], first = tree.talents[0], shield = tree.talents.find(t => t.name === 'Water Shield');
  assert.match(canAdd({ [first.id]: first.max }, first, tree, 60), /Maximum/);
  assert.match(canAdd({ [first.id]: 1 }, first, tree, 10), /No talent/);
  assert.match(canAdd({}, shield, tree, 60), /10 points/);
  assert.equal(canAdd(levelingBuild(19).ranks, shield, tree, 20), '');
});
test('prerequisites must be fully ranked, including when refunding', () => {
  const tree = getTrees('shaman')[2], riptide = tree.talents.find(t => t.name === 'Riptide'), way = tree.talents.find(t => t.name === 'Healing Way');
  const ranks = { ...levelingBuild(39).ranks, [way.id]: 2, [tree.talents.find(t => t.name === 'Totemic Focus').id]: 2 };
  assert.match(canAdd(ranks, riptide, tree, 60), /Healing Way/);
  const built = levelingBuild(40);
  assert.equal(valid({ ...built.ranks, [way.id]: 2 }, 40, 'shaman'), false);
});
test('valid builds round-trip for all classes, including empty and named-id allocations', () => {
  for (const c of classes) {
    const first = getTrees(c.id)[0].talents.find(t => !t.requires && !t.prerequisites.length);
    const ranks = { [first.id]: 1 };
    assert.equal(valid(ranks, 10, c.id), true);
    assert.deepEqual(loadBuild(serialize(ranks, 10, c.id)).ranks, ranks);
    assert.equal(valid({}, 10, c.id), true);
  }
  assert.deepEqual(loadBuild(serialize(levelingBuild(60).ranks, 60, 'shaman')).ranks, levelingBuild(60).ranks);
});
test('rejects broken allocations, foreign classes, corrupt imports, and invalid ranks', () => {
  const first = getTrees('shaman')[2].talents[0];
  for (const rank of [-1, 6, 0.5, '1', null, false]) assert.equal(valid({ [first.id]: rank }, 60, 'shaman'), false);
  assert.equal(valid({ [first.id]: 2 }, 10, 'shaman'), false);
  assert.equal(valid({ unknown: 1 }, 60, 'shaman'), false);
  assert.equal(valid({ [first.id]: 1 }, 60, 'mage'), false);
  assert.equal(valid({}, 61, 'shaman'), false); assert.equal(valid({}, 10.5, 'shaman'), false);
  assert.equal(valid({}, 10, 'unknown'), false); assert.equal(valid([], 10), false);
  for (const value of ['bad json', 'null', '{}', '{"version":"old","level":60,"ranks":{}}', '{"version":"forever-69913-v2","level":60,"ranks":{}}', 'x'.repeat(30001)]) assert.equal(loadBuild(value), null);
  for (const level of [9, 61, 10.5, NaN]) assert.throws(() => levelingBuild(level));
});
test('source dependency cycles cannot validate themselves as learnable allocations', () => {
  const tree = getTrees('druid')[0], majesty = tree.talents.find(t => t.name === "Nature's Majesty"), splendor = tree.talents.find(t => t.name === "Nature's Splendor");
  assert.match(canAdd({ [tree.talents[0].id]: 5 }, majesty, tree, 60), /Nature's Splendor/);
  assert.equal(valid({ [majesty.id]: majesty.max, [splendor.id]: 1 }, 60, 'druid'), false);
});
