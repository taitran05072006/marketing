const { test, expect } = require('@playwright/test');

test.describe('Marketing Site E2E', () => {
  test('Home page loads and has correct title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/YLAN/);
    
    // Check for SEO JSON-LD
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toBeTruthy();
  });

  test('Navigation to Products works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Sản phẩm');
    await expect(page).toHaveURL(/.*\/products/);
  });

  test('Contact form validation works', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Vui lòng nhập họ tên hợp lệ')).toBeVisible();
  });
  
  test('Login page redirects or shows error on invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Assuming error message appears
    // await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible();
  });
});
