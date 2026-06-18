import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title contains SQL Master Pro', async ({ page }) => {
    await expect(page).toHaveTitle(/SQL Master Pro/i);
  });

  test('navbar shows brand name', async ({ page }) => {
    await expect(page.locator('.brand-name').first()).toBeVisible();
    await expect(page.locator('.brand-name').first()).toContainText('SQL Master Pro');
  });

  test('navbar contains all main links', async ({ page }) => {
    const nav = page.locator('.nav-links');
    await expect(nav.getByRole('link', { name: /^Learn$/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Playground$/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Quiz$/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Challenges$/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Blog$/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Pricing$/ })).toBeVisible();
  });

  test('navbar is sticky — remains at top after scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(300);
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    const box = await navbar.boundingBox();
    expect(box?.y).toBeLessThanOrEqual(5);
  });

  test('footer is visible', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page.locator('app-footer')).toBeVisible();
  });
});
