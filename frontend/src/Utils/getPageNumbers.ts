export const getPageNumbers = (
	totalPages: number,
	currentPage: number
): (number | string)[] => {
	const pages: (number | string)[] = []

	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	const left = Math.max(2, currentPage - 1)
	const right = Math.min(totalPages - 1, currentPage + 1)

	pages.push(1) // Always show first

	// Show ellipsis if left is more than 2 (meaning gap after first page)
	if (left > 2) {
		pages.push('...')
	}

	// Show middle pages
	for (let i = left; i <= right; i++) {
		pages.push(i)
	}

	// Show ellipsis if right is less than totalPages - 1 (meaning gap before last page)
	if (right < totalPages - 1) {
		pages.push('...')
	}

	pages.push(totalPages) // Always show last

	return pages
}
