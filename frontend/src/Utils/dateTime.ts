import {
	format,
	parseISO,
	isValid,
	differenceInYears,
	isBefore,
	setHours,
	setMinutes,
	setSeconds,
	setMilliseconds,
	getMonth,
	getYear,
	getDate,
	isSameDay,
} from 'date-fns'
import { vi } from 'date-fns/locale'

/**
 * Converts a date and time string to ISO string using date-fns
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

	// Create a new date object with the selected date and time using date-fns
	let appointmentDate = setHours(date, hours)
	appointmentDate = setMinutes(appointmentDate, minutes)
	appointmentDate = setSeconds(appointmentDate, 0)
	appointmentDate = setMilliseconds(appointmentDate, 0)

	// Return ISO string using toISOString (keep this as it's standard)
	return appointmentDate.toISOString()
}

/**
 * Formats a date for display using date-fns
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date): string => {
	return format(date, 'EEEE, MMMM d, yyyy', { locale: undefined })
}

/**
 * Formats a date for Vietnamese locale using date-fns
 * @param date - The date to format
 * @returns Formatted date string in Vietnamese format
 */
export const formatDateVietnamese = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? parseISO(date) : date
	if (!isValid(dateObj)) return 'N/A'
	return format(dateObj, 'dd/MM/yyyy')
}

/**
 * Formats a date with time for Vietnamese locale using date-fns
 * @param date - The date to format
 * @returns Formatted date string with time in Vietnamese format
 */
export const formatDateTimeVietnamese = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? parseISO(date) : date
	if (!isValid(dateObj)) return 'N/A'
	return format(dateObj, 'dd/MM/yyyy HH:mm')
}

/**
 * Formats time for display using date-fns
 * @param timeString - ISO time string or Date object
 * @returns Formatted time string
 */
export const formatTimeForDisplay = (timeString: string | Date): string => {
	try {
		const date =
			typeof timeString === 'string' ? parseISO(timeString) : timeString
		if (!isValid(date)) return timeString.toString()
		return format(date, 'HH:mm')
	} catch {
		return timeString.toString()
	}
}

/**
 * Converts date string to date input format using date-fns
 * @param dateString - ISO date string
 * @returns Date string in YYYY-MM-DD format for date inputs
 */
export const formatDateForInput = (dateString: string): string => {
	try {
		const date = parseISO(dateString)
		if (!isValid(date)) return ''
		return format(date, 'yyyy-MM-dd')
	} catch {
		return ''
	}
}

/**
 * Calculates age from date of birth using date-fns
 * @param dateOfBirth - Date of birth (Date object or ISO string)
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: Date | string): number => {
	try {
		const birthDate =
			typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth
		if (!isValid(birthDate)) return 0
		return differenceInYears(new Date(), birthDate)
	} catch {
		return 0
	}
}

/**
 * Validates if a date is in the past using date-fns
 * @param date - Date to validate
 * @returns True if date is in the past
 */
export const isDateInPast = (date: Date | string): boolean => {
	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date
		if (!isValid(dateObj)) return false
		return isBefore(dateObj, new Date())
	} catch {
		return false
	}
}

/**
 * Formats time for display
 * @param timeString - Time string in format "HH:MM AM/PM"
 * @returns Formatted time string
 */
export const formatTimeForDisplayLegacy = (timeString: string): string => {
	return timeString
}

/**
 * Gets current month number (0-11) using date-fns
 * @param date - Date object (defaults to current date)
 * @returns Month number (0-11)
 */
export const getCurrentMonth = (date: Date = new Date()): number => {
	return getMonth(date)
}

/**
 * Gets current year using date-fns
 * @param date - Date object (defaults to current date)
 * @returns Year number
 */
export const getCurrentYear = (date: Date = new Date()): number => {
	return getYear(date)
}

/**
 * Gets day of month using date-fns
 * @param date - Date object
 * @returns Day of month (1-31)
 */
export const getDayOfMonth = (date: Date): number => {
	return getDate(date)
}

/**
 * Compares two dates for equality using date-fns
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 */
export const areDatesEqual = (date1: Date, date2: Date): boolean => {
	return isSameDay(date1, date2)
}

/**
 * Formats date for Vietnamese locale display
 * @param date - Date to format
 * @param includeTime - Whether to include time in format
 * @returns Formatted date string
 */
export const formatDateVietnameseDisplay = (
	date: Date | string,
	includeTime: boolean = false
): string => {
	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date
		if (!isValid(dateObj)) return 'N/A'

		const formatString = includeTime
			? 'EEEE, dd MMMM yyyy HH:mm'
			: 'EEEE, dd MMMM yyyy'
		return format(dateObj, formatString, { locale: vi })
	} catch {
		return 'N/A'
	}
}
