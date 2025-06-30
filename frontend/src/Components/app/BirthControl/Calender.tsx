import React, { useMemo } from 'react'
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	format,
	isWithinInterval,
	parseISO,
	differenceInDays,
	addDays as addToDate,
	isValid,
} from 'date-fns'
import { motion } from 'framer-motion'
import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'

interface CalendarProps {
	cycle: BirthControlDates | null
	year: number
	month: number // từ 0–11
}

export default function Calendar({ year, month, cycle }: CalendarProps) {
	const parseWithShift = (isoStr: string) => {
		try {
			const parsed = parseISO(isoStr)
			return isValid(parsed) ? addDays(parsed, 1) : null
		} catch {
			return null
		}
	}

	const ovulationDay = useMemo(() => {
		if (!cycle?.startUnsafeDate || !cycle?.endUnsafeDate) return null

		const start = parseWithShift(cycle.startUnsafeDate)
		const end = parseWithShift(cycle.endUnsafeDate)

		if (!start || !end) return null

		const diff = differenceInDays(end, start)
		return addToDate(start, Math.floor(diff / 2))
	}, [cycle])

	// Don't render if no valid cycle data
	if (!cycle || !ovulationDay) {
		return (
			<div className='flex items-center justify-center py-12'>
				<div className='text-center'>
					<div className='text-gray-400 text-4xl mb-4'>📅</div>
					<p className='text-gray-600 mb-2'>Chưa có dữ liệu chu kỳ</p>
					<p className='text-sm text-gray-500'>
						Vui lòng chọn ngày bắt đầu chu kỳ để xem lịch
					</p>
				</div>
			</div>
		)
	}

	const {
		menstrualStartDate,
		menstrualEndDate,
		startUnsafeDate,
		endUnsafeDate,
		startSafeDate,
		endSafeDate,
		secondSafeStart,
		secondSafeEnd,
	} = cycle

	const monthStart = startOfMonth(new Date(year, month))
	const monthEnd = endOfMonth(monthStart)
	const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 0 })
	const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 0 })

	// Function to check if a day is within the interval with error handling
	const inInterval = (date: Date, start: string, end: string) => {
		try {
			const startDate = parseWithShift(start)
			const endDate = parseWithShift(end)

			if (!startDate || !endDate) return false

			return isWithinInterval(date, {
				start: startDate,
				end: endDate,
			})
		} catch {
			return false
		}
	}

	const rows: React.ReactNode[] = []
	let currentDay = startDateGrid

	// Build the grid for the calendar
	while (currentDay <= endDateGrid) {
		const week: React.ReactNode[] = []

		for (let i = 0; i < 7; i++) {
			const day = currentDay
			const isCurrentMonth = day.getMonth() === month
			const label = format(day, 'd')

			// Default background and title for the day
			let bgClass = 'bg-white'
			let title = ''
			let ovulationIcon = ''

			// Check for ovulation day
			if (format(day, 'yyyy-MM-dd') === format(ovulationDay, 'yyyy-MM-dd')) {
				bgClass = 'bg-yellow-400'
				title = 'Ngày rụng trứng – Khả năng thụ thai cao nhất 🌸'
				ovulationIcon = '🌸'
			} else if (inInterval(day, menstrualStartDate, menstrualEndDate)) {
				bgClass = 'bg-red-200'
				title = 'Pha hành kinh – Ngày có kinh nguyệt'
			} else if (inInterval(day, startUnsafeDate, endUnsafeDate)) {
				bgClass = 'bg-yellow-300'
				title = 'Pha không an toàn – Khả năng thụ thai cao'
			} else if (
				inInterval(day, startSafeDate, endSafeDate) ||
				inInterval(day, secondSafeStart, secondSafeEnd)
			) {
				bgClass = 'bg-blue-200'
				title = 'Pha an toàn – Khả năng thụ thai thấp'
			}

			week.push(
				<motion.div
					key={i}
					title={title}
					aria-label={title}
					className={`p-2 h-16 flex flex-col items-center justify-start text-sm rounded-md
						${isCurrentMonth ? bgClass : 'bg-gray-100 text-gray-400'}
						border border-gray-200 hover:shadow-sm transition-shadow`}
					whileHover={{ scale: 1.02 }}
				>
					<span className='font-medium text-gray-800'>
						{label} {ovulationIcon}
					</span>
				</motion.div>
			)

			// Move to the next day
			currentDay = addDays(currentDay, 1)
		}

		rows.push(
			<motion.div
				key={currentDay.toString()}
				className='grid grid-cols-7'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				{week}
			</motion.div>
		)
	}

	// Weekdays for the calendar
	const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

	return (
		<div className='space-y-4'>
			{/* Weekday headers */}
			<div className='grid grid-cols-7 text-center font-semibold text-sm text-gray-600'>
				{weekdays.map(day => (
					<div key={day} className='py-2'>
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className='space-y-1'>{rows}</div>

			{/* Legend */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-6 text-gray-700'>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded bg-red-200 border border-gray-300' />
					<span>Pha kinh nguyệt</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded bg-yellow-300 border border-gray-300' />
					<span>Không an toàn</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded bg-yellow-400 border border-gray-300' />
					<span>Rụng trứng 🌸</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded bg-blue-200 border border-gray-300' />
					<span>An toàn</span>
				</div>
			</div>

			{/* Note for users */}
			<div className='mt-4 p-3 bg-blue-50 rounded-[15px] text-xs text-blue-700'>
				<p className='font-medium mb-1'>Lưu ý quan trọng:</p>
				<p>
					Các pha được tính toán tương đối để tham khảo. Ngày rụng trứng (🌸)
					thường rơi vào giữa khoảng không an toàn. Phương pháp này không đảm
					bảo 100% hiệu quả tránh thai.
				</p>
			</div>
		</div>
	)
}
