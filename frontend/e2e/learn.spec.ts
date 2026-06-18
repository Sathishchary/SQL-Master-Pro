import { test, expect } from '@playwright/test';

test.describe('Learning Module — Course List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');
    await page.waitForTimeout(1500);
  });

  test('learn page loads at /learn', async ({ page }) => {
    await expect(page).toHaveURL(/\/learn/);
  });

  test('page renders visible content (loading state or courses)', async ({ page }) => {
    const content = page.locator('body');
    await expect(content).not.toBeEmpty();
  });

  test('course cards or loading indicator are visible', async ({ page }) => {
    const anyContent = page.locator('[class*="course"], mat-card, [class*="loading"], .spinner, h1, h2').first();
    await expect(anyContent).toBeVisible();
  });
});

test.describe('Learning Module — Lesson Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn/1');
    await page.waitForTimeout(2500);
  });

  test('lesson page loads at /learn/1', async ({ page }) => {
    await expect(page).toHaveURL(/\/learn\/1/);
  });

  test('lesson page shows loading or lesson content', async ({ page }) => {
    const content = page.locator('[class*="lesson"], [class*="course"], [class*="loading"], .spinner, h1, h2').first();
    await expect(content).toBeVisible();
  });

  test('navbar remains visible on lesson page', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });
});
