import { test, expect } from '@playwright/test';

test.describe('Challenges', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForTimeout(1200);
  });

  test('challenges page loads at /challenges', async ({ page }) => {
    await expect(page).toHaveURL(/\/challenges/);
  });

  test('page renders visible content', async ({ page }) => {
    const content = page.locator('[class*="challenge"], mat-card, h1, h2').first();
    await expect(content).toBeVisible();
  });

  test('navbar is visible on challenges page', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });
});

test.describe('Challenge Detail', () => {
  test('challenge detail page loads at /challenges/1', async ({ page }) => {
    await page.goto('/challenges/1');
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/challenges\/1/);
  });

  test('challenge detail renders content', async ({ page }) => {
    await page.goto('/challenges/1');
    await page.waitForTimeout(1500);
    const content = page.locator('[class*="challenge"], h1, h2, pre, code').first();
    await expect(content).toBeVisible();
  });
});
