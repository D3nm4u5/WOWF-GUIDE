import test from 'node:test';
import assert from 'node:assert/strict';
import { trees } from '../src/data.js';
import { budget, canAdd, valid, loadBuild, serialize, total } from '../src/planner.js';
const frost = trees[2];
test('levels have the correct base point budgets', () => {
  assert.equal(budget(10), 1); assert.equal(budget(20), 11); assert.equal(budget(60), 51);
});
test('later rows require earlier row investment', () => {
  const lance = frost.talents.find(t => t.name === 'Ice Lance');
  assert.match(canAdd({}, lance, frost, 60), /10 points/);
  assert.equal(canAdd({'Improved Frostbolt':5, 'Ice Shards':5}, lance, frost, 60), '');
});
test('maximum ranks and point budgets are enforced', () => {
  assert.match(canAdd({'Improved Frostbolt':5}, frost.talents[0], frost,60), /Maximum/);
  assert.match(canAdd({'Improved Frostbolt':1}, frost.talents[0], frost,10), /No talent/);
});
test('valid builds round-trip, including empty builds', () => {
  const ranks = {'Improved Frostbolt':5, 'Permafrost':3, 'Improved Frost Nova':2, 'Ice Lance':1};
  assert.equal(valid(ranks,20), true); assert.deepEqual(loadBuild(serialize(ranks,20)).ranks,ranks);
  assert.equal(total(ranks),11); assert.equal(valid({},10),true);
});
test('rejects broken allocations, unknown talents, bad levels and corrupt imports', () => {
  assert.equal(valid({'Ice Lance':1},60),false);
  assert.equal(valid({'Improved Frostbolt':6},60),false);
  assert.equal(valid({'Improved Frostbolt':-1},60),false);
  assert.equal(valid({'Unknown':1},60),false);
  assert.equal(valid({'Improved Frostbolt':2},10),false);
  assert.equal(valid({},61),false); assert.equal(valid({},10.5),false);
  assert.equal(loadBuild('bad json'),null);
  assert.equal(loadBuild('{"version":"old","level":60,"ranks":{}}'),null);
});
test('prerequisites must be fully ranked', () => {
  const ranks = {'Improved Frostbolt':5,'Ice Shards':5,'Permafrost':3,'Improved Frost Nova':2,'Frost Channeling':3,'Shatter':3};
  const fingers = frost.talents.find(t => t.name === 'Fingers of Frost');
  assert.match(canAdd(ranks,fingers,frost,60), /Ice Lance/);
  assert.equal(canAdd({...ranks,'Ice Lance':1},fingers,frost,60),'');
});
