import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('theme toggle button is visible in navbar', async ({ page }) => {
    await expect(page.locator('.theme-btn')).toBeVisible();
  });

  test('clicking theme button opens theme menu', async ({ page }) => {
    await page.locator('.theme-btn').click();
    await expect(page.locator('.theme-dropdown-menu, mat-menu, .mat-mdc-menu-panel')).toBeVisible();
  });

  test('dark theme can be applied', async ({ page }) => {
    await page.locator('.theme-btn').click();
    await page.waitForTimeout(300);

    const darkOption = page.getByRole('menuitem', { name: /dark/i });
    if (await darkOption.isVisible()) {
      await darkOption.click();
      await page.waitForTimeout(300);
      // Body should have dark-theme class
      const bodyClass = await page.locator('body').getAttribute('class');
      expect(bodyClass).toContain('dark');
    }
  });

  test('theme persists on page navigation', async ({ page }) => {
    // Apply dark theme
    await page.locator('.theme-btn').click();
    await page.waitForTimeout(300);
    const darkOption = page.getByRole('menuitem', { name: /dark/i });
    if (await darkOption.isVisible()) {
      await darkOption.click();
      await page.waitForTimeout(300);
    }

    // Navigate to quiz
    await page.goto('/quiz');
    await page.waitForTimeout(500);
    const bodyClass = await page.locator('body').getAttribute('class');
    // Dark theme should persist via localStorage
    expect(bodyClass).toContain('dark');
  });
});
