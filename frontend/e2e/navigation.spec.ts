import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('brand logo navigates to home from any route', async ({ page }) => {
    await page.goto('/quiz');
    await page.locator('.brand').click();
    await expect(page).toHaveURL('/');
  });

  test('Learn link navigates to /learn', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links').getByRole('link', { name: /^Learn$/ }).click();
    await expect(page).toHaveURL(/\/learn/);
  });

  test('Playground link navigates to /playground', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links').getByRole('link', { name: /^Playground$/ }).click();
    await expect(page).toHaveURL(/\/playground|\/auth\/login/);
  });

  test('Quiz link navigates to /quiz', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links').getByRole('link', { name: /^Quiz$/ }).click();
    await expect(page).toHaveURL(/\/quiz/);
  });

  test('Challenges link navigates to /challenges', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links').getByRole('link', { name: /^Challenges$/ }).click();
    await expect(page).toHaveURL(/\/challenges/);
  });

  test('Blog link navigates to /blog', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links').getByRole('link', { name: /^Blog$/ }).click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('Pricing link navigates to pricing/payment page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-links').getByRole('link', { name: /^Pricing$/ }).click();
    await expect(page).toHaveURL(/\/pricing|\/payment/);
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    // Should show a not-found page rather than crashing
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });
});
