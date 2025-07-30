import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'

/**
 * Safely parse UTC time string and convert to local Date object
 * The backend returns timestamps without 'Z' suffix but they are stored as UTC
 */
export const parseUTCToLocal = (utcTimeString: string): Date => {
	// If the string doesn't end with 'Z', it's a UTC time from our backend
	// that needs to be marked as UTC for proper conversion
	if (!utcTimeString.endsWith('Z') && !utcTimeString.includes('+')) {
		return new Date(utcTimeString + 'Z')
	}
	// If it already has timezone info, parse normally
	return new Date(utcTimeString)
}

/**
 * Convert local Date to UTC ISO string for API requests
 */
export const localDateToUTC = (localDate: Date): string => {
	return localDate.toISOString()
}

/**
 * Format date for local display (in user's timezone)
 */
export const formatDateForDisplay = (date: Date): string => {
	return date.toLocaleDateString('vi-VN', {
		weekday: 'short',
		day: '2-digit',
		month: '2-digit',
	})
}

/**
 * Get the start and end of a week (Monday to Sunday)
 */
export const getWeekRange = (date: Date) => {
	// Đảm bảo date là local time
	const localDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	)
	const day = localDate.getDay()
	// day: 0=CN, 1=Thứ 2, ..., 6=Thứ 7
	// Nếu là CN (0) thì lùi về thứ 2 tuần trước
	const diff = localDate.getDate() - (day === 0 ? 6 : day - 1)
	localDate.setDate(diff)
	localDate.setHours(0, 0, 0, 0)

	const startOfWeek = new Date(localDate)
	const endOfWeek = new Date(startOfWeek)
	endOfWeek.setDate(startOfWeek.getDate() + 6)
	endOfWeek.setHours(23, 59, 59, 999)

	return { startOfWeek, endOfWeek }
}

/**
 * Get the week days array (Monday to Sunday)
 */
export const getWeekDays = (startOfWeek: Date) => {
	const days = []
	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek)
		day.setDate(startOfWeek.getDate() + i)
		days.push(day)
	}
	return days
}

/**
 * Generate all time slots from 00:00 to 23:00 (every 1 hour)
 */
export const generateAllTimeSlots = () => {
	const timeSlots = []

	for (let hour = 0; hour < 24; hour++) {
		const hourStr = hour.toString().padStart(2, '0')
		timeSlots.push(`${hourStr}:00`)
	}

	return timeSlots
}

/**
 * Generate business hours time slots from 08:00 to 22:00 (every 1 hour)
 */
export const generateBusinessTimeSlots = () => {
	const timeSlots = []

	for (let hour = 8; hour <= 22; hour++) {
		const hourStr = hour.toString().padStart(2, '0')
		timeSlots.push(`${hourStr}:00`)
	}

	return timeSlots
}

/**
 * Generate time slots from the appointments data (now uses business hours)
 */
export const generateTimeSlots = () => {
	return generateBusinessTimeSlots()
}

/**
 * Group appointments by date and hour (properly handling UTC times)
 */
export const groupAppointmentsByDateTime = (appointments: Appointment[]) => {
	const grouped: Record<string, Record<string, Appointment[]>> = {}

	appointments.forEach(appointment => {
		// Parse the UTC time and convert to local time for display
		const date = parseUTCToLocal(appointment.scheduleAt)

		// Use local time for grouping to display appointments in user's timezone
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const dateKey = `${year}-${month}-${day}` // YYYY-MM-DD (local)
		const hours = date.getHours().toString().padStart(2, '0')
		const timeKey = `${hours}:00` // local time, HH:00

		if (!grouped[dateKey]) {
			grouped[dateKey] = {}
		}
		if (!grouped[dateKey][timeKey]) {
			grouped[dateKey][timeKey] = []
		}
		grouped[dateKey][timeKey].push(appointment)
	})

	return grouped
}

/**
 * Filter appointments for the current week (properly handling UTC times)
 */
export const filterAppointmentsForWeek = (
	appointments: Appointment[],
	startOfWeek: Date,
	endOfWeek: Date
) => {
	return appointments.filter(appointment => {
		// Parse the UTC time and compare with local week boundaries
		const appointmentDate = parseUTCToLocal(appointment.scheduleAt)
		return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
	})
}

/**
 * Format week range for display
 */
export const formatWeekRange = (startOfWeek: Date, endOfWeek: Date) => {
	const start = startOfWeek.toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	const end = endOfWeek.toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	return `${start} - ${end}`
}
