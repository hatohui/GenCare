import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'

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
 * Generate time slots from the appointments data (legacy - kept for compatibility)
 */
export const generateTimeSlots = (appointments: Appointment[]) => {
	return generateAllTimeSlots()
}

/**
 * Group appointments by date and hour (simplified)
 */
export const groupAppointmentsByDateTime = (appointments: Appointment[]) => {
	const grouped: Record<string, Record<string, Appointment[]>> = {}

	appointments.forEach(appointment => {
		const date = new Date(appointment.scheduleAt)
		// Sử dụng local date key thay vì UTC để tránh lệch ngày
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
 * Filter appointments for the current week
 */
export const filterAppointmentsForWeek = (
	appointments: Appointment[],
	startOfWeek: Date,
	endOfWeek: Date
) => {
	return appointments.filter(appointment => {
		const appointmentDate = new Date(appointment.scheduleAt)
		return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
	})
}

/**
 * Format date for display
 */
export const formatDate = (date: Date) => {
	return date.toLocaleDateString('vi-VN', {
		weekday: 'short',
		day: '2-digit',
		month: '2-digit',
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
