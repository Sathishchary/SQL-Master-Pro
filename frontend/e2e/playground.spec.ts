import { test, expect } from '@playwright/test';

test.describe('Playground', () => {
  test('playground page loads or redirects to login', async ({ page }) => {
    await page.goto('/playground');
    await page.waitForTimeout(1500);
    const url = page.url();
    expect(url).toMatch(/\/playground|\/auth\/login/);
  });

  test('playground shows SQL editor when accessible', async ({ page }) => {
    await page.goto('/playground');
    await page.waitForTimeout(2000);

    if (page.url().includes('/playground')) {
      // Monaco editor or SQL textarea should be present
      const editor = page.locator('.monaco-editor, [class*="editor"], [class*="sql"], textarea').first();
      await expect(editor).toBeVisible();
    }
  });

  test('playground run button is present when accessible', async ({ page }) => {
    await page.goto('/playground');
    await page.waitForTimeout(2000);

    if (page.url().includes('/playground')) {
      const runBtn = page.getByRole('button', { name: /run|execute|play/i });
      await expect(runBtn).toBeVisible();
    }
  });

  test('navbar is visible on playground page', async ({ page }) => {
    await page.goto('/playground');
    await page.waitForTimeout(1500);
    await expect(page.locator('.navbar')).toBeVisible();
  });
});
