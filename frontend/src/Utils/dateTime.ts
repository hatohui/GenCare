import {
	parse,
	format,
	setHours,
	setMinutes,
	setSeconds,
	setMilliseconds,
} from 'date-fns'
import { vi } from 'date-fns/locale'

/**
 * Converts a date and time string to ISO string
 * @param date - The selected date
 * @param timeString - Time string in format "HH:MM AM/PM" (e.g., "08:00 AM", "03:30 PM")
 * @returns ISO string
 */
export const convertToISOString = (date: Date, timeString: string): string => {
	// Parse the time string using date-fns (24h format)
	const timeFormat = 'HH:mm'
	let parsedTime: Date

	try {
		parsedTime = parse(timeString, timeFormat, new Date())
	} catch (error) {
		throw new Error('Invalid time format. Expected format: "HH:mm"')
	}

	// Get hours and minutes from parsed time
	const hours = parsedTime.getHours()
	const minutes = parsedTime.getMinutes()

	// Create a new date object with the selected date and time using date-fns
	const appointmentDate = setMilliseconds(
		setSeconds(setMinutes(setHours(date, hours), minutes), 0),
		0
	)

	// Return ISO string without timezone conversion to preserve local time
	return format(appointmentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
}

/**
 * Formats a date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date): string => {
	return format(date, 'EEEE, d MMMM yyyy', { locale: vi })
}

/**
 * Formats time for display
 * @param timeString - Time string in format "HH:MM AM/PM"
 * @returns Formatted time string
 */
export const formatTimeForDisplay = (timeString: string): string => {
	return timeString
}

/**
 * Formats a date and time for display
 * @param date - The date to format
 * @returns Formatted date and time string
 */
export const formatDateTimeForDisplay = (date: Date): string => {
	return format(date, 'EEEE, d MMMM yyyy HH:mm', { locale: vi })
}

/**
 * Formats time in 24-hour format
 * @param date - The date to format
 * @returns Formatted time string (HH:mm)
 */
export const formatTime24Hour = (date: Date): string => {
	return format(date, 'HH:mm')
}

/**
 * Formats time in 12-hour format with AM/PM
 * @param date - The date to format
 * @returns Formatted time string (hh:mm a)
 */
export const formatTime12Hour = (date: Date): string => {
	return format(date, 'hh:mm a', { locale: vi })
}

/**
 * Format time slot in 24h format (HH:mm)
 */
export const formatTimeSlot24h = (date: Date) => {
	return format(date, 'HH:mm')
}

/**
 * Format ISO date string theo UTC, kiểu dd/MM/yyyy (KHÔNG dùng date-fns-tz)
 */
export const formatDateForDisplayUTC = (isoString: string) => {
	const date = new Date(isoString)
	const day = String(date.getUTCDate()).padStart(2, '0')
	const month = String(date.getUTCMonth() + 1).padStart(2, '0')
	const year = date.getUTCFullYear()
	return `${day}/${month}/${year}`
}
