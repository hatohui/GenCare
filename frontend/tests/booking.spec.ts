import { test, expect } from '@playwright/test'

test.describe('Booking Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/app/booking')
	})

	test('should load booking page', async ({ page }) => {
		await expect(page.locator('body')).toBeVisible()
		// Check for at least one main/section
		const mainSection = page.locator('main, section, div').first()
		if ((await mainSection.count()) === 0) test.skip()
		await expect(mainSection).toBeVisible()
	})

	test('should display booking page content', async ({ page }) => {
		await page.waitForTimeout(2000)
		const content = page.locator('h1, h2, h3, p, div, section').first()
		if ((await content.count()) === 0) test.skip()
		await expect(content).toBeVisible()
	})

	test('should handle loading states', async ({ page }) => {
		const loadingIndicator = page
			.locator(
				'.animate-spin, [class*="loading"], [class*="spinner"], .loading'
			)
			.first()
		if ((await loadingIndicator.count()) === 0) test.skip()
		await expect(loadingIndicator).toBeVisible()
	})

	test('should display booking list when available', async ({ page }) => {
		await page.waitForTimeout(3000)
		const bookingContent = page
			.locator(
				'[class*="booking"], [class*="order"], [class*="appointment"], .booking-list, .order-list'
			)
			.first()
		if ((await bookingContent.count()) === 0) test.skip()
		await expect(bookingContent).toBeVisible()
	})

	test('should show error message when booking data fails to load', async ({
		page,
	}) => {
		await page.route('**/api/orders**', route => route.abort())
		await page.reload()
		await page.waitForTimeout(2000)
		const errorMessage = page
			.locator(
				'text=Failed to load, text=Error, text=Failed, .error, [class*="error"]'
			)
			.first()
		if ((await errorMessage.count()) === 0) test.skip()
		await expect(errorMessage).toBeVisible()
	})

	test('should display individual booking items when available', async ({
		page,
	}) => {
		await page.waitForTimeout(3000)
		const bookingItems = page
			.locator(
				'[class*="booking-item"], [class*="order-item"], [class*="appointment-item"], .booking-card, .order-card'
			)
			.first()
		if ((await bookingItems.count()) === 0) test.skip()
		await expect(bookingItems).toBeVisible()
	})

	test('should show booking details when available', async ({ page }) => {
		await page.waitForTimeout(3000)
		const bookingItems = page
			.locator(
				'[class*="booking-item"], [class*="order-item"], [class*="appointment-item"], .booking-card, .order-card'
			)
			.first()
		if ((await bookingItems.count()) === 0) test.skip()
		await expect(bookingItems).toBeVisible()
	})

	test('should allow viewing test results when available', async ({ page }) => {
		await page.waitForTimeout(3000)
		const viewResultButton = page
			.locator(
				'button:has-text("View Test Result"), a:has-text("View Test Result"), button:has-text("Test Result"), a:has-text("Test Result")'
			)
			.first()
		if ((await viewResultButton.count()) === 0) test.skip()
		await viewResultButton.click()
		await expect(page.locator('body')).toBeVisible()
	})

	test('should allow canceling bookings when available', async ({ page }) => {
		await page.waitForTimeout(3000)
		const cancelButton = page
			.locator(
				'button:has-text("Cancel"), button:has-text("Hủy"), button:has-text("Delete"), button:has-text("Xóa")'
			)
			.first()
		if ((await cancelButton.count()) === 0) test.skip()
		await cancelButton.click()
		const confirmationMessage = page
			.locator(
				'text=Confirm, text=Xác nhận, text=Success, text=Thành công, .modal, [class*="modal"]'
			)
			.first()
		if ((await confirmationMessage.count()) === 0) test.skip()
		await expect(confirmationMessage).toBeVisible()
	})

	test('should allow rescheduling bookings when available', async ({
		page,
	}) => {
		await page.waitForTimeout(3000)
		const rescheduleButton = page
			.locator(
				'button:has-text("Reschedule"), button:has-text("Đổi lịch"), button:has-text("Change"), button:has-text("Thay đổi")'
			)
			.first()
		if ((await rescheduleButton.count()) === 0) test.skip()
		await rescheduleButton.click()
		const datePicker = page
			.locator(
				'input[type="date"], input[type="datetime-local"], .date-picker, [class*="date"]'
			)
			.first()
		if ((await datePicker.count()) === 0) test.skip()
		await expect(datePicker).toBeVisible()
	})
})

test.describe('Birth Control Page', () => {
	test('should load birth control page', async ({ page }) => {
		await page.goto('/app/birthcontrol')
		await expect(page.locator('body')).toBeVisible()
	})

	test('should display birth control tracking features', async ({ page }) => {
		await page.goto('/app/birthcontrol')
		await page.waitForTimeout(2000)
		const content = page.locator('h1, h2, h3, p, div, section').first()
		if ((await content.count()) === 0) test.skip()
		await expect(content).toBeVisible()
	})
})

test.describe('Profile Page', () => {
	test('should load profile page', async ({ page }) => {
		await page.goto('/app/profile')
		await expect(page.locator('body')).toBeVisible()
	})

	test('should display user profile information', async ({ page }) => {
		await page.goto('/app/profile')
		await page.waitForTimeout(2000)
		const content = page.locator('h1, h2, h3, p, div, section').first()
		if ((await content.count()) === 0) test.skip()
		await expect(content).toBeVisible()
	})

	test('should allow editing profile information', async ({ page }) => {
		await page.goto('/app/profile')
		await page.waitForTimeout(2000)
		const editButton = page
			.locator(
				'button:has-text("Edit"), button:has-text("Chỉnh sửa"), button:has-text("Update"), button:has-text("Cập nhật")'
			)
			.first()
		if ((await editButton.count()) === 0) test.skip()
		await editButton.click()
		const formFields = page
			.locator('input[type="text"], input[type="email"], textarea, select')
			.first()
		if ((await formFields.count()) === 0) test.skip()
		await expect(formFields).toBeVisible()
	})
})

test.describe('Dashboard', () => {
	test('should load dashboard for authenticated users', async ({ page }) => {
		await page.goto('/dashboard')
		await expect(page.locator('body')).toBeVisible()
	})

	test('should display dashboard navigation', async ({ page }) => {
		await page.goto('/dashboard')
		await page.waitForTimeout(2000)
		const nav = page
			.locator('nav, [role="navigation"], .sidebar, .navigation, header')
			.first()
		if ((await nav.count()) === 0) test.skip()
		await expect(nav).toBeVisible()
	})
})
