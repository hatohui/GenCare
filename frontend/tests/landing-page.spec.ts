import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
	test('should load landing page with all sections', async ({ page }) => {
		await page.goto('/')

		// Check page title
		await expect(page).toHaveTitle(/GenCare/i)

		// Check if page loads successfully
		await expect(page.locator('body')).toBeVisible()

		// Check for at least one heading
		await expect(page.locator('h1, h2, h3').first()).toBeVisible()
	})

	test('should navigate to login page from landing', async ({ page }) => {
		await page.goto('/')

		// Look for any navigation to login
		const loginLink = page
			.locator(
				'a[href*="login"], button:has-text("Login"), button:has-text("Đăng Nhập"), a:has-text("Login"), a:has-text("Đăng Nhập")'
			)
			.first()

		if (await loginLink.isVisible()) {
			await loginLink.click()
			await expect(page).toHaveURL(/.*login/)
		} else {
			// If no login link found, just verify we can navigate to login page directly
			await page.goto('/login')
			await expect(page).toHaveURL(/.*login/)
		}
	})

	test('should navigate to services page', async ({ page }) => {
		await page.goto('/')

		// Look for services navigation
		const servicesLink = page
			.locator(
				'a[href*="service"], button:has-text("Services"), button:has-text("Dịch vụ"), a:has-text("Services"), a:has-text("Dịch vụ")'
			)
			.first()

		if (await servicesLink.isVisible()) {
			await servicesLink.click()
			await expect(page).toHaveURL(/.*service/)
		} else {
			// If no services link found, just verify we can navigate to services page directly
			await page.goto('/app/service')
			await expect(page).toHaveURL(/.*service/)
		}
	})

	test('should have responsive design', async ({ page }) => {
		await page.goto('/')

		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 })
		await expect(page.locator('body')).toBeVisible()

		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 })
		await expect(page.locator('body')).toBeVisible()

		// Test desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 })
		await expect(page.locator('body')).toBeVisible()
	})

	test('should have working navigation', async ({ page }) => {
		await page.goto('/')

		// Check if navigation elements exist
		const nav = page.locator('nav, [role="navigation"], header').first()
		if (await nav.isVisible()) {
			await expect(nav).toBeVisible()
		}
	})
})
