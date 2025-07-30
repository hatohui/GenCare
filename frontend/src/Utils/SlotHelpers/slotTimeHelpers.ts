import { addDays, format, startOfWeek } from 'date-fns'

/**
 * Working hours constants based on requirements
 * From 8am to 10pm, every 2 hours is a working slot
 */
export const WORKING_SLOTS = [
	{
		no: 1,
		startTime: '08:00',
		endTime: '10:00',
		label: 'Slot 1: 8:00 AM - 10:00 AM',
	},
	{
		no: 2,
		startTime: '10:00',
		endTime: '12:00',
		label: 'Slot 2: 10:00 AM - 12:00 PM',
	},
	{
		no: 3,
		startTime: '12:00',
		endTime: '14:00',
		label: 'Slot 3: 12:00 PM - 2:00 PM',
	},
	{
		no: 4,
		startTime: '14:00',
		endTime: '16:00',
		label: 'Slot 4: 2:00 PM - 4:00 PM',
	},
	{
		no: 5,
		startTime: '16:00',
		endTime: '18:00',
		label: 'Slot 5: 4:00 PM - 6:00 PM',
	},
	{
		no: 6,
		startTime: '18:00',
		endTime: '20:00',
		label: 'Slot 6: 6:00 PM - 8:00 PM',
	},
	{
		no: 7,
		startTime: '20:00',
		endTime: '22:00',
		label: 'Slot 7: 8:00 PM - 10:00 PM',
	},
]

/**
 * Get week range starting from Monday
 */
export const getSlotWeekRange = (date: Date) => {
	const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 }) // Monday
	const endOfWeekDate = addDays(startOfWeekDate, 6) // Sunday
	return { startOfWeek: startOfWeekDate, endOfWeek: endOfWeekDate }
}

/**
 * Get week days array (Monday to Sunday)
 */
export const getSlotWeekDays = (startOfWeek: Date) => {
	const days = []
	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek)
		day.setDate(startOfWeek.getDate() + i)
		days.push(day)
	}
	return days
}

/**
 * Format time for display (HH:mm)
 */
export const formatSlotTime = (timeString: string) => {
	try {
		const date = new Date(`2000-01-01T${timeString}:00`)
		return format(date, 'HH:mm')
	} catch {
		return timeString
	}
}

/**
 * Format time range for display
 */
export const formatSlotTimeRange = (startTime: string, endTime: string) => {
	return `${formatSlotTime(startTime)} - ${formatSlotTime(endTime)}`
}

/**
 * Check if a slot time is in working hours (8am-10pm)
 */
export const isWorkingHour = (timeString: string): boolean => {
	const hour = parseInt(timeString.split(':')[0])
	return hour >= 8 && hour <= 22
}

/**
 * Generate a date-time string for a slot on a specific day
 */
export const generateSlotDateTime = (
	day: Date,
	slotStartTime: string
): string => {
	const year = day.getFullYear()
	const month = (day.getMonth() + 1).toString().padStart(2, '0')
	const dayStr = day.getDate().toString().padStart(2, '0')
	return `${year}-${month}-${dayStr}T${slotStartTime}:00`
}

/**
 * Check if a slot is in the past
 */
export const isSlotInPast = (day: Date, slotStartTime: string): boolean => {
	const slotDateTime = new Date(generateSlotDateTime(day, slotStartTime))
	return slotDateTime < new Date()
}

/**
 * Format week range for display
 */
export const formatSlotWeekRange = (startOfWeek: Date, endOfWeek: Date) => {
	const start = format(startOfWeek, 'MMM d')
	const end = format(endOfWeek, 'MMM d, yyyy')
	return `${start} - ${end}`
}

/**
 * Get slot by number
 */
export const getSlotByNumber = (slotNo: number) => {
	return WORKING_SLOTS.find(slot => slot.no === slotNo)
}

/**
 * Parse slot time from backend datetime string
 */
export const parseSlotTime = (dateTimeString: string): string => {
	try {
		const date = new Date(dateTimeString)
		return format(date, 'HH:mm')
	} catch {
		return '00:00'
	}
}
