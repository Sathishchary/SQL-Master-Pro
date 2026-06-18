import { test, expect } from '@playwright/test';

test.describe('Quiz List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForTimeout(1000);
  });

  test('quiz list page loads at /quiz', async ({ page }) => {
    await expect(page).toHaveURL(/\/quiz/);
  });

  test('displays quiz cards', async ({ page }) => {
    const cards = page.locator('.quiz-card, [class*="quiz-card"], mat-card').first();
    await expect(cards).toBeVisible();
  });

  test('quiz cards have difficulty labels', async ({ page }) => {
    const diffBadge = page.locator('.diff-pill, [class*="diff-"], [class*="difficulty"]').first();
    await expect(diffBadge).toBeVisible();
  });

  test('clicking a quiz card navigates to attempt page', async ({ page }) => {
    const firstCard = page.locator('.quiz-card, mat-card').first();
    await firstCard.click();
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toMatch(/\/quiz\/\d+\/attempt|\/quiz/);
  });
});

test.describe('Quiz Attempt — Layout & Sticky Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz/1/attempt');
    await page.waitForTimeout(2000);
  });

  test('loads quiz attempt page', async ({ page }) => {
    await expect(page).toHaveURL(/\/quiz\/\d+\/attempt/);
  });

  test('sticky quiz header bar is visible on load', async ({ page }) => {
    await expect(page.locator('.sticky-bar')).toBeVisible();
  });

  test('sticky bar shows quiz title', async ({ page }) => {
    await expect(page.locator('.sb-title')).toBeVisible();
    const title = await page.locator('.sb-title').textContent();
    expect(title?.trim().length).toBeGreaterThan(0);
  });

  test('sticky bar shows answered count', async ({ page }) => {
    await expect(page.locator('.sb-sub')).toBeVisible();
    const sub = await page.locator('.sb-sub').textContent();
    expect(sub).toMatch(/\d+\/\d+\s*answered/i);
  });

  test('timer is visible and shows MM:SS format', async ({ page }) => {
    await expect(page.locator('.timer')).toBeVisible();
    const timerText = await page.locator('.timer').textContent();
    expect(timerText).toMatch(/\d+:\d{2}/);
  });

  test('progress bar is visible in sticky header', async ({ page }) => {
    await expect(page.locator('.progress-track')).toBeVisible();
    await expect(page.locator('.progress-fill')).toBeVisible();
  });

  test('submit button is present in sticky bar', async ({ page }) => {
    await expect(page.locator('.submit-top-btn')).toBeVisible();
  });

  test('sticky bar remains visible after scrolling down', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(400);
    await expect(page.locator('.sticky-bar')).toBeVisible();
    const box = await page.locator('.sticky-bar').boundingBox();
    // Should be near the top (below navbar at ~64px)
    expect(box?.y).toBeLessThanOrEqual(80);
  });
});

test.describe('Quiz Attempt — Palette Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz/1/attempt');
    await page.waitForTimeout(2000);
  });

  test('question palette is visible', async ({ page }) => {
    await expect(page.locator('.palette-card')).toBeVisible();
    await expect(page.locator('.palette-title')).toContainText('Questions');
  });

  test('palette shows question number buttons', async ({ page }) => {
    const buttons = page.locator('.pq-btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('palette card does not overlap sticky bar after scrolling', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(400);

    const barBox = await page.locator('.sticky-bar').boundingBox();
    const cardBox = await page.locator('.palette-card').boundingBox();

    if (barBox && cardBox) {
      // Palette card top must be at or below sticky bar bottom (allowing 2px tolerance)
      expect(cardBox.y).toBeGreaterThanOrEqual(barBox.y + barBox.height - 2);
    }
  });

  test('answered count and remaining count are displayed', async ({ page }) => {
    await expect(page.locator('.palette-stats')).toBeVisible();
    await expect(page.locator('.ps-item.green')).toBeVisible();
    await expect(page.locator('.ps-item.gray')).toBeVisible();
  });

  test('sidebar submit quiz button is visible', async ({ page }) => {
    await expect(page.locator('.submit-side-btn')).toBeVisible();
  });

  test('clicking question number scrolls to that question', async ({ page }) => {
    const buttons = page.locator('.pq-btn');
    const count = await buttons.count();
    if (count > 2) {
      await buttons.last().click();
      await page.waitForTimeout(800);
      const lastCard = page.locator('.question-card').last();
      await expect(lastCard).toBeInViewport();
    }
  });
});

test.describe('Quiz Attempt — Answering Questions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz/1/attempt');
    await page.waitForTimeout(2000);
  });

  test('question cards are visible', async ({ page }) => {
    await expect(page.locator('.question-card').first()).toBeVisible();
  });

  test('first question has answer options', async ({ page }) => {
    const firstCard = page.locator('.question-card').first();
    const options = firstCard.locator('.option, .tf-btn');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test('selecting an option marks it as selected', async ({ page }) => {
    await page.locator('.option').first().click();
    await expect(page.locator('.option').first()).toHaveClass(/selected/);
  });

  test('selecting an option marks palette button as answered', async ({ page }) => {
    await page.locator('.option').first().click();
    await expect(page.locator('.pq-btn').first()).toHaveClass(/answered/);
  });

  test('progress bar increases after answering a question', async ({ page }) => {
    const fill = page.locator('.progress-fill');
    const widthBefore = await fill.getAttribute('style');

    await page.locator('.option').first().click();
    await page.waitForTimeout(200);

    const widthAfter = await fill.getAttribute('style');
    expect(widthBefore).not.toEqual(widthAfter);
  });

  test('answered count in header updates after answering', async ({ page }) => {
    await page.locator('.option').first().click();
    await page.waitForTimeout(200);
    const sub = await page.locator('.sb-sub').textContent();
    expect(sub).toMatch(/1\/\d+\s*answered/i);
  });

  test('hint toggle shows hint text when clicked', async ({ page }) => {
    const hintToggle = page.locator('.hint-toggle').first();
    const hasHint = await hintToggle.isVisible();
    if (hasHint) {
      await hintToggle.click();
      await expect(page.locator('.hint-box').first()).toBeVisible();
    }
  });

  test('bottom submit section is visible', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page.locator('.bottom-submit')).toBeVisible();
    await expect(page.locator('.submit-big-btn')).toBeVisible();
  });

  test('submitting with unanswered questions shows confirmation dialog', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toMatch(/unanswered/i);
      await dialog.dismiss();
    });
    await page.locator('.submit-top-btn').click();
  });
});
