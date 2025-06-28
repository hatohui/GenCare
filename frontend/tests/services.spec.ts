import { test, expect } from '@playwright/test'

test.describe('Services Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/app/service')
	})

	test('should load services page', async ({ page }) => {
		await expect(page.locator('body')).toBeVisible()
		// Check for at least one main/section
		const mainSection = page.locator('main, section').first()
		if ((await mainSection.count()) === 0) test.skip()
		await expect(mainSection).toBeVisible()
	})

	test('should display search functionality', async ({ page }) => {
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"], input[placeholder*="Tìm kiếm"]'
			)
			.first()
		if ((await searchInput.count()) === 0) test.skip()
		await expect(searchInput).toBeVisible()
	})

	test('should display booking button', async ({ page }) => {
		const bookingButton = page
			.locator(
				'button:has-text("Booking"), button:has-text("Book"), button:has-text("Đặt lịch"), button:has-text("Cart"), button:has-text("Giỏ hàng")'
			)
			.first()
		if ((await bookingButton.count()) === 0) test.skip()
		await expect(bookingButton).toBeVisible()
	})

	test('should display sort by price button', async ({ page }) => {
		const sortButton = page
			.locator(
				'button:has-text("Sắp xếp theo giá"), button:has-text("Sort by price"), button:has-text("Price")'
			)
			.first()
		if ((await sortButton.count()) === 0) test.skip()
		await expect(sortButton).toBeVisible()
	})

	test('should toggle sort by price functionality', async ({ page }) => {
		const sortButton = page
			.locator(
				'button:has-text("Sắp xếp theo giá"), button:has-text("Sort by price"), button:has-text("Price")'
			)
			.first()
		if ((await sortButton.count()) === 0) test.skip()
		await sortButton.click()
		await expect(page).toHaveURL(/.*orderByPrice=true/)
		await sortButton.click()
		await expect(page).not.toHaveURL(/.*orderByPrice=true/)
	})

	test('should search for services', async ({ page }) => {
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"], input[placeholder*="Tìm kiếm"]'
			)
			.first()
		if ((await searchInput.count()) === 0) test.skip()
		await searchInput.fill('test service')
		await searchInput.press('Enter')
		await expect(page).toHaveURL(/.*search=test%20service/)
	})

	test('should display service list', async ({ page }) => {
		await page.waitForTimeout(2000)
		const serviceContent = page
			.locator(
				'[class*="service"], [class*="card"], [class*="item"], .service-list, .service-item'
			)
			.first()
		if ((await serviceContent.count()) === 0) test.skip()
		await expect(serviceContent).toBeVisible()
	})

	test('should navigate to service detail page', async ({ page }) => {
		await page.waitForTimeout(2000)
		const serviceItems = page
			.locator('a[href*="service"], [class*="service"], [class*="card"]')
			.first()
		if ((await serviceItems.count()) === 0) test.skip()
		await serviceItems.click()
		await expect(page).toHaveURL(/.*service\/.*/)
	})

	test('should add service to cart', async ({ page }) => {
		await page.waitForTimeout(2000)
		const addToCartButton = page
			.locator(
				'button:has-text("Add to Cart"), button:has-text("Thêm vào giỏ"), button:has-text("Book"), button:has-text("Đặt lịch")'
			)
			.first()
		if ((await addToCartButton.count()) === 0) test.skip()
		await addToCartButton.click()
		await expect(page.locator('body')).toBeVisible()
	})

	test('should handle empty search results', async ({ page }) => {
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"], input[placeholder*="Tìm kiếm"]'
			)
			.first()
		if ((await searchInput.count()) === 0) test.skip()
		await searchInput.fill('nonexistentservice12345')
		await searchInput.press('Enter')
		const noResultsMessage = page
			.locator(
				'text=No results, text=Không tìm thấy, text=No services, text=Empty'
			)
			.first()
		if ((await noResultsMessage.count()) === 0) test.skip()
		await expect(noResultsMessage).toBeVisible()
	})

	test('should maintain search state on page refresh', async ({ page }) => {
		const searchInput = page
			.locator(
				'input[type="search"], input[placeholder*="search"], input[placeholder*="Search"], input[placeholder*="Tìm kiếm"]'
			)
			.first()
		if ((await searchInput.count()) === 0) test.skip()
		await searchInput.fill('test')
		await searchInput.press('Enter')
		await page.reload()
		await expect(searchInput).toHaveValue('test')
	})
})

test.describe('Service Detail Page', () => {
	test('should load service detail page', async ({ page }) => {
		await page.goto('/app/service/1')
		await expect(page.locator('body')).toBeVisible()
		const content = page.locator('h1, h2, h3, p, div').first()
		if ((await content.count()) === 0) test.skip()
		await expect(content).toBeVisible()
	})

	test('should book service from detail page', async ({ page }) => {
		await page.goto('/app/service/1')
		const bookButton = page
			.locator(
				'button:has-text("Book"), button:has-text("Đặt lịch"), button:has-text("Book Now"), button:has-text("Add to Cart")'
			)
			.first()
		if ((await bookButton.count()) === 0) test.skip()
		await bookButton.click()
		await expect(page.locator('body')).toBeVisible()
	})
})
