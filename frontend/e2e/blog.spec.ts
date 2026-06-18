import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await page.waitForTimeout(1200);
  });

  test('blog list page loads at /blog', async ({ page }) => {
    await expect(page).toHaveURL(/\/blog/);
  });

  test('blog page renders content', async ({ page }) => {
    const content = page.locator('[class*="blog"], mat-card, h1, h2, article').first();
    await expect(content).toBeVisible();
  });

  test('navbar is visible on blog page', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('footer is visible on blog page', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page.locator('app-footer')).toBeVisible();
  });
});

test.describe('Blog Detail', () => {
  test('blog detail page loads when navigating to /blog/1', async ({ page }) => {
    await page.goto('/blog/1');
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/blog\/1/);
  });

  test('blog detail renders some content', async ({ page }) => {
    await page.goto('/blog/1');
    await page.waitForTimeout(1500);
    const content = page.locator('[class*="blog"], article, h1, h2').first();
    await expect(content).toBeVisible();
  });
});
