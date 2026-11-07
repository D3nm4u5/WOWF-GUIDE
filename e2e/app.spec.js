import { test, expect } from '@playwright/test';
import { getTrees } from '../src/data.js';
import { levelingBuild, serialize } from '../src/planner.js';

const talent = name => getTrees('shaman').flatMap(tree => tree.talents).find(t => t.name === name);
const point = (page, name) => page.locator(`[data-talent="${talent(name).id}"]`);
const noOverflow = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
test('featured Troll Restoration guide, class search, role filters, and spec tabs', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.class-card')).toHaveCount(9);
  await expect(page.locator('.spotlight-title h2')).toHaveText('Shaman');
  await expect(page.locator('#leveling-guide h2')).toHaveText('Troll Restoration Shaman');
  await page.getByRole('button', { name: 'Healer', exact: true }).click();
  await expect(page.locator('.class-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'All classes', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search classes' }).fill('rogue');
  await expect(page.locator('.class-card')).toHaveCount(1); await page.locator('.class-card').click();
  await expect(page.locator('.spotlight-title h2')).toHaveText('Rogue');
  await page.getByRole('tab', { name: 'Combat', exact: true }).click();
  await expect(page.locator('#spec-panel h3')).toHaveText('Stay in the fight.');
  await page.getByRole('tab', { name: 'Combat', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Subtlety', exact: true })).toHaveAttribute('aria-selected', 'true');
  await noOverflow(page); expect(errors).toEqual([]);
});
test('leveling milestones apply the correct talent allocation and survive reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-guide-level="40"]').click();
  await expect(page.locator('.level-allocation b').nth(2)).toHaveText('31');
  await page.getByRole('button', { name: 'Load level 40 talents' }).click();
  await expect(page.locator('#level')).toHaveValue('40');
  await expect(page.locator('.point-counter b')).toHaveText('0');
  await expect(point(page, 'Riptide')).toHaveAttribute('aria-label', 'Riptide, 1 of 1 ranks');
  await page.reload(); await page.getByRole('button', { name: 'Talent planner', exact: true }).click();
  await expect(page.locator('#level')).toHaveValue('40'); await expect(page.locator('.point-counter b')).toHaveText('0');
  await page.locator('#level').fill('39'); await page.locator('#level').blur();
  await expect(page.locator('#level')).toHaveValue('40'); await expect(page.locator('.toast')).toContainText('Refund points');
  await noOverflow(page);
});
test('level selector explains the exact rank and handles both ends of the leveling route', async ({ page }) => {
  await page.goto('/');
  await page.locator('#guide-level').fill('10'); await page.locator('#guide-level').dispatchEvent('change');
  await expect(page.locator('.leveling-summary')).toContainText('Improved Healing Wave → rank 1 / 5');
  await page.locator('#guide-level').fill('60'); await page.locator('#guide-level').dispatchEvent('change');
  await expect(page.locator('.leveling-summary')).toContainText('Thundering Strikes → rank 5 / 5');
  await expect(page.locator('.level-allocation b').nth(1)).toHaveText('10');
  await expect(page.locator('.level-allocation b').nth(2)).toHaveText('41');
  await page.getByRole('button', { name: 'Load level 60 talents' }).click();
  await expect(page.locator('.point-counter b')).toHaveText('0'); await noOverflow(page);
});
test('planner enforces dependencies, supports refunds, undo, and independent class drafts', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Talent planner', exact: true }).click();
  await point(page, 'Water Shield').click(); await expect(page.locator('.toast')).toContainText('Requires 10 points');
  for (let i = 0; i < 5; i++) await point(page, 'Improved Healing Wave').click();
  for (let i = 0; i < 5; i++) await point(page, 'Tidal Focus').click();
  await point(page, 'Water Shield').click(); await expect(page.locator('.point-counter b')).toHaveText('40');
  await page.getByRole('button', { name: 'Refund one rank' }).click(); await expect(page.locator('.point-counter b')).toHaveText('41');
  await page.getByRole('button', { name: 'Undo', exact: true }).click(); await expect(page.locator('.point-counter b')).toHaveText('40');
  await page.locator('#planner-class').selectOption('mage'); await expect(page.locator('.point-counter b')).toHaveText('51');
  await page.locator('#planner-class').selectOption('shaman'); await expect(page.locator('.point-counter b')).toHaveText('40');
  await page.locator('#talent-search').fill('water shield'); await expect(page.locator('.talent:not(.search-dimmed)')).toHaveCount(1);
  await noOverflow(page);
});
test('all nine planners render three trees without browser errors or overflow', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await page.getByRole('button', { name: 'Talent planner', exact: true }).click();
  for (const id of ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'druid']) {
    await page.locator('#planner-class').selectOption(id); await expect(page.locator('.tree')).toHaveCount(3);
    await expect(page.locator('.talent')).toHaveCount(getTrees(id).reduce((sum, tree) => sum + tree.talents.length, 0));
    await noOverflow(page);
  }
  expect(errors).toEqual([]);
});
test('named builds save, load, delete, and escape user-provided names', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Load level 20 talents' }).click();
  page.once('dialog', dialog => dialog.accept('<img src=x onerror=alert(1)>'));
  await page.getByRole('button', { name: 'Save as…', exact: true }).click();
  await page.getByRole('button', { name: /Saved builds/ }).click();
  await expect(page.locator('.named-build h3')).toHaveText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.named-build img')).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept()); await page.getByRole('button', { name: 'Load', exact: true }).click();
  await expect(page.locator('#level')).toHaveValue('20');
  await page.getByRole('button', { name: /Saved builds/ }).click();
  page.once('dialog', dialog => dialog.accept()); await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.named-build')).toHaveCount(0); await noOverflow(page);
});
test('shared links load, invalid imports preserve draft, and file export round-trips', async ({ page }) => {
  const build = levelingBuild(30), encoded = serialize(build.ranks, build.level, build.classId);
  await page.goto('/#' + new URLSearchParams({ build: encoded }));
  await expect(page.locator('#level')).toHaveValue('30'); await expect(page.locator('.point-counter b')).toHaveText('0');
  page.once('dialog', dialog => dialog.accept('invalid')); await page.getByRole('button', { name: 'Paste build / share link' }).click();
  await expect(page.locator('.toast')).toContainText('Invalid build'); await expect(page.locator('#level')).toHaveValue('30');
  const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export build file' }).click();
  const download = await downloadPromise; expect(download.suggestedFilename()).toBe('forever-shaman-level-30.json');
  await page.reload(); await expect(page.locator('#level')).toHaveValue('30');
  await noOverflow(page);
});
test('imports JSON files and rejects oversized or foreign snapshots', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Talent planner', exact: true }).click();
  const build = levelingBuild(60);
  await page.locator('#import-file').setInputFiles({ name: 'build.json', mimeType: 'application/json', buffer: Buffer.from(serialize(build.ranks, 60, 'shaman')) });
  await expect(page.locator('.point-counter b')).toHaveText('0');
  await page.locator('#import-file').setInputFiles({ name: 'old.json', mimeType: 'application/json', buffer: Buffer.from('{"version":"old"}') });
  await expect(page.locator('.toast')).toContainText('Invalid build'); await expect(page.locator('.point-counter b')).toHaveText('0');
  await noOverflow(page);
});
