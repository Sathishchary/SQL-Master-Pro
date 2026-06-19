const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));

  await page.goto('http://localhost:4200/');
  await page.evaluate(() => {
    window.history.pushState({}, '', '/auth/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForSelector('input[formcontrolname="emailOrUsername"]', { timeout: 15000 });
  await page.locator('input[formcontrolname="emailOrUsername"]').fill('admin@sqlmasterpro.com');
  await page.locator('input[formcontrolname="password"]').fill('admin123');
  await page.getByRole('button', { name: /Sign In to Dashboard/i }).click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'verify-login-result.png' });
  console.log('URL after login:', page.url());

  // navigate to users list inside admin panel
  await page.evaluate(() => {
    window.history.pushState({}, '', '/admin/users');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-admin-users.png' });
  console.log('URL on users page:', page.url());

  await browser.close();
})();
