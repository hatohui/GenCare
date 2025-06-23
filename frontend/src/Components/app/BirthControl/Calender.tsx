import React from 'react'
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	format,
	isWithinInterval,
	parseISO,
} from 'date-fns'
import { useGetBirthControl } from '@/Services/birthControl-service'
import { motion } from 'framer-motion'

interface CalendarProps {
	year: number
	month: number // 0-indexed
}

export default function Calendar({
	year,
	month,
	id,
}: CalendarProps & { id: string }) {
	const { data: birthControl, isLoading } = useGetBirthControl(id)

	if (!birthControl) return null

	if (isLoading) return <div>Loading...</div>

	const {
		startDate,
		endDate,
		menstrualStartDate,
		menstrualEndDate,
		startUnsafeDate,
		endUnsafeDate,
		startSafeDate,
		endSafeDate,
		secondSafeStart,
		secondSafeEnd,
	} = birthControl

	const monthStart = startOfMonth(new Date(year, month))
	const monthEnd = endOfMonth(monthStart)
	const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 0 })
	const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 0 })

	const rows: React.ReactNode[] = []
	let days = startDateGrid

	while (days <= endDateGrid) {
		const week: React.ReactNode[] = []
		for (let i = 0; i < 7; i++) {
			const day = days
			const isCurrentMonth = day.getMonth() === month
			const labelDate = format(day, 'd')

			const inInterval = (start: string, end: string) =>
				isWithinInterval(day, { start: parseISO(start), end: parseISO(end) })

			let bgClass = 'bg-white'
			if (inInterval(menstrualStartDate, menstrualEndDate))
				bgClass = 'bg-pink-200'
			else if (inInterval(startUnsafeDate, endUnsafeDate))
				bgClass = 'bg-yellow-200'
			else if (
				inInterval(startSafeDate, endSafeDate) ||
				inInterval(secondSafeStart, secondSafeEnd)
			)
				bgClass = 'bg-green-200'

			week.push(
				<motion.div
					key={i}
					className={`p-2 h-16 flex flex-col items-center justify-start ${
						isCurrentMonth ? bgClass : 'bg-gray-100 text-gray-400'
					} border border-gray-200`}
					whileHover={{ scale: 1.05 }}
				>
					<span className='text-sm font-medium'>{labelDate}</span>
				</motion.div>
			)
			days = addDays(days, 1)
		}
		rows.push(
			<motion.div
				key={days.toString()}
				className='grid grid-cols-7'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				{week}
			</motion.div>
		)
	}

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	return (
		<div className='space-y-2'>
			<div className='grid grid-cols-7 text-center font-semibold'>
				{weekdays.map(d => (
					<div key={d} className='py-1'>
						{d}
					</div>
				))}
			</div>
			{rows}
		</div>
	)
}
