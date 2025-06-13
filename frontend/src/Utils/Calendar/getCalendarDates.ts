import { startOfWeek, startOfMonth, addDays } from 'date-fns'

export const getCalendarDates = (
	currentDate: Date,
	rows: number = 6
): Date[] => {
	const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
	return Array.from({ length: rows * 7 }, (_, i) => addDays(start, i))
}
