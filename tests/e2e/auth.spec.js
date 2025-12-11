/**
 * Authentication E2E Tests
 * 
 * End-to-end tests for authentication flows.
 * Run with: npm run test:e2e
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    // Should show login form
    await expect(page.locator('[data-test="login-email"]')).toBeVisible();
    await expect(page.locator('[data-test="login-password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-submit"]')).toBeVisible();
    await expect(page.locator('[data-test="login-demo"]')).toBeVisible();
  });

  test('should login with demo account', async ({ page }) => {
    await page.goto('/login');
    
    // Click demo login button
    await page.locator('[data-test="login-demo"]').click();
    
    // Should redirect to home
    await expect(page).toHaveURL(/.*home|.*\/$/, { timeout: 5000 });
    
    // Should show home page content
    await expect(page.locator('[data-test="home-page"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    
    // Click submit without filling fields
    await page.locator('[data-test="login-submit"]').click();
    
    // Should show error
    await expect(page.locator('[data-test="login-error"]')).toBeVisible();
  });

  test('should navigate to account setup', async ({ page }) => {
    await page.goto('/login');
    
    // Click create account link
    await page.locator('[data-test="login-create-account"]').click();
    
    // Should navigate to account setup
    await expect(page).toHaveURL(/.*account-setup/);
    await expect(page.locator('[data-test="setup-fullname"]')).toBeVisible();
  });

  test('should create new account and auto-login', async ({ page }) => {
    await page.goto('/account-setup');
    
    // Fill form
    await page.locator('[data-test="setup-fullname"] input').fill('Test User');
    await page.locator('[data-test="setup-phone"] input').fill('+27 12 345 6789');
    await page.locator('[data-test="setup-email"] input').fill('test@example.com');
    await page.locator('[data-test="setup-password"] input').fill('test123');
    await page.locator('[data-test="setup-confirm-password"] input').fill('test123');
    
    // Submit
    await page.locator('[data-test="setup-submit"]').click();
    
    // Should redirect to home
    await expect(page).toHaveURL(/.*home|.*\/$/, { timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.locator('[data-test="login-demo"]').click();
    await expect(page).toHaveURL(/.*home|.*\/$/, { timeout: 5000 });
    
    // Logout
    await page.locator('[data-test="link-logout"]').click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Single Screen Visibility', () => {
  test('should only show one page at a time', async ({ page }) => {
    await page.goto('/login');
    
    // Count visible q-page elements
    const pages = await page.locator('.q-page:visible').count();
    expect(pages).toBe(1);
    
    // Login and check home
    await page.locator('[data-test="login-demo"]').click();
    await expect(page).toHaveURL(/.*home|.*\/$/, { timeout: 5000 });
    
    const homePages = await page.locator('.q-page:visible').count();
    expect(homePages).toBe(1);
  });
});

test.describe('Visual Regression', () => {
  test('login page visual', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('home page visual', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-test="login-demo"]').click();
    await expect(page).toHaveURL(/.*home|.*\/$/, { timeout: 5000 });
    
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});


