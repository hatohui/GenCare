/**
 * Converts a date and time string to ISO string
 * @param date - The selected date
 * @param timeString - Time string in format "HH:MM AM/PM" (e.g., "08:00 AM", "03:30 PM")
 * @returns ISO string
 */
export const convertToISOString = (date: Date, timeString: string): string => {
	// Parse the time string (e.g., "08:00 AM" or "03:30 PM")
	const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)

	if (!timeMatch) {
		throw new Error('Invalid time format. Expected format: "HH:MM AM/PM"')
	}

	let hours = parseInt(timeMatch[1], 10)
	const minutes = parseInt(timeMatch[2], 10)
	const period = timeMatch[3].toUpperCase()

	// Convert 12-hour format to 24-hour format
	if (period === 'PM' && hours !== 12) {
		hours += 12
	} else if (period === 'AM' && hours === 12) {
		hours = 0
	}

	// Create a new date object with the selected date and time
	const appointmentDate = new Date(date)
	appointmentDate.setHours(hours, minutes, 0, 0)

	// Return ISO string
	return appointmentDate.toISOString()
}

/**
 * Formats a date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date): string => {
	return date.toLocaleDateString('vi-VN', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

/**
 * Formats time for display
 * @param timeString - Time string in format "HH:MM AM/PM"
 * @returns Formatted time string
 */
export const formatTimeForDisplay = (timeString: string): string => {
	return timeString
}
