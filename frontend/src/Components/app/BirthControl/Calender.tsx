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
	differenceInDays,
	addDays as addToDate,
} from 'date-fns'
import { motion } from 'framer-motion'
import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'

interface CalendarProps {
	cycle: BirthControlDates | null
	year: number
	month: number // từ 0–11
}

export default function Calendar({ year, month, cycle }: CalendarProps) {
	if (!cycle) return null

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

	// Tính ngày rụng trứng ước lượng: giữa khoảng không an toàn
	const ovulationDay = (() => {
		const start = parseISO(startUnsafeDate)
		const end = parseISO(endUnsafeDate)
		const diff = differenceInDays(end, start)
		return addToDate(start, Math.floor(diff / 2))
	})()

	const rows: React.ReactNode[] = []
	let currentDay = startDateGrid

	while (currentDay <= endDateGrid) {
		const week: React.ReactNode[] = []

		for (let i = 0; i < 7; i++) {
			const day = currentDay
			const isCurrentMonth = day.getMonth() === month
			const label = format(day, 'd')

			const inInterval = (start: string, end: string) =>
				isWithinInterval(day, {
					start: parseISO(start),
					end: parseISO(end),
				})

			let bgClass = 'bg-white'
			let title = ''
			let ovulationIcon = ''

			if (format(day, 'yyyy-MM-dd') === format(ovulationDay, 'yyyy-MM-dd')) {
				bgClass = 'bg-yellow-400'
				title = 'Ngày rụng trứng – Khả năng thụ thai cao nhất 🌸'
				ovulationIcon = '🌸'
			} else if (inInterval(menstrualStartDate, menstrualEndDate)) {
				bgClass = 'bg-red-200'
				title = 'Pha hành kinh – Ngày có kinh nguyệt'
			} else if (inInterval(startUnsafeDate, endUnsafeDate)) {
				bgClass = 'bg-yellow-300'
				title = 'Pha không an toàn – Khả năng thụ thai cao'
			} else if (
				inInterval(startSafeDate, endSafeDate) ||
				inInterval(secondSafeStart, secondSafeEnd)
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
						border border-gray-200`}
					whileHover={{ scale: 1.05 }}
				>
					<span className='font-medium text-gray-800'>
						{label} {ovulationIcon}
					</span>
				</motion.div>
			)

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

	const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

	return (
		<div className='space-y-3'>
			{/* Tên ngày trong tuần */}
			<div className='grid grid-cols-7 text-center font-semibold text-sm text-gray-600'>
				{weekdays.map(day => (
					<div key={day}>{day}</div>
				))}
			</div>

			{/* Lưới lịch */}
			{rows}

			{/* Chú thích */}
			<div className='grid grid-cols-4 gap-2 text-xs mt-4 text-gray-700'>
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

			{/* Ghi chú hỗ trợ người dùng mới */}
			<div className='mt-2 text-xs text-gray-500'>
				Các pha được tính toán tương đối để tham khảo. Ngày rụng trứng (🌸)
				thường rơi vào giữa khoảng không an toàn.
			</div>
		</div>
	)
}
