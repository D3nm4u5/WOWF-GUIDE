import { test, expect } from '@playwright/test';

test('class browsing, search, roles and responsive layout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.class-card')).toHaveCount(9);
  await page.getByRole('button', { name: '✧ Healer', exact: true }).click();
  await expect(page.locator('.class-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'All classes', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search classes' }).fill('rogue');
  await expect(page.locator('.class-card')).toHaveCount(1);
  await page.locator('.class-card').click();
  await expect(page.locator('.spotlight-title h2')).toHaveText('Rogue');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
});

test('planner enforces rules and retains a draft after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Talent planner', exact: true }).click();
  await page.locator('[data-talent="2:6"]').click();
  await expect(page.locator('.toast')).toContainText('Requires 10 points');
  await expect(page.locator('.point-counter b')).toHaveText('51');
  for (let i = 0; i < 5; i++) await page.locator('[data-talent="2:0"]').click();
  for (let i = 0; i < 5; i++) await page.locator('[data-talent="2:3"]').click();
  await page.locator('[data-talent="2:6"]').click();
  await expect(page.locator('.point-counter b')).toHaveText('40');
  await page.getByRole('button', { name: 'Refund one rank' }).click();
  await expect(page.locator('.point-counter b')).toHaveText('41');
  await page.reload();
  await page.getByRole('button', { name: 'Talent planner', exact: true }).click();
  await expect(page.locator('.point-counter b')).toHaveText('41');
  await page.locator('#level').fill('10');
  await page.locator('#level').blur();
  await expect(page.locator('#level')).toHaveValue('60');
  await expect(page.locator('.toast')).toContainText('Refund points');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('versioned shared links load and invalid links are rejected', async ({ page }) => {
  const build = JSON.stringify({ version: '1.60.1-draft-1', level: 10, ranks: { 'Improved Frostbolt': 1 } });
  await page.goto('/#' + new URLSearchParams({build}));
  await expect(page.locator('.point-counter b')).toHaveText('0');
  await expect(page.locator('#level')).toHaveValue('10');
  await page.goto('/#build=invalid');
  await expect(page.locator('.toast')).toContainText('invalid');
});
