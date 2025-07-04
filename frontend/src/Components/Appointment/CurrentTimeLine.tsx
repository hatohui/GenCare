'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'motion/react'

interface CurrentTimeLineProps {
	timeSlots: string[]
	weekDays: Date[]
	onTimeSlotStatusChange?: (
		day: Date,
		timeSlot: string,
		isPast: boolean
	) => void
}

export const CurrentTimeLine = ({
	timeSlots,
	weekDays,
	onTimeSlotStatusChange,
}: CurrentTimeLineProps) => {
	const [currentTime, setCurrentTime] = useState(new Date())
	const [tableDimensions, setTableDimensions] = useState<{
		timeColumnWidth: number
		columnWidth: number
		cellHeight: number
		headerHeight: number
	} | null>(null)

	// Memoize the timeSlots and weekDays to prevent unnecessary re-renders
	const memoizedTimeSlots = useMemo(() => timeSlots, [timeSlots.join(',')])
	const memoizedWeekDays = useMemo(
		() => weekDays,
		[weekDays.map(d => d.toISOString()).join(',')]
	)

	// Measure actual table dimensions from DOM
	const measureTableDimensions = useCallback(() => {
		if (typeof window === 'undefined') return null

		// Find the table elements
		const table = document.querySelector('.appointment-timetable table')
		const timeHeader = document.querySelector('.sticky-time-col')
		const dayHeader = document.querySelector('th:not(.sticky-time-col)')
		const firstRow = document.querySelector('tbody tr:first-child')
		const headerRow = document.querySelector('thead tr')

		if (!table || !timeHeader || !dayHeader || !firstRow || !headerRow) {
			return null
		}

		const timeRect = timeHeader.getBoundingClientRect()
		const dayRect = dayHeader.getBoundingClientRect()
		const rowRect = firstRow.getBoundingClientRect()
		const headerRect = headerRow.getBoundingClientRect()

		return {
			timeColumnWidth: timeRect.width,
			columnWidth: dayRect.width,
			cellHeight: rowRect.height,
			headerHeight: headerRect.height,
		}
	}, [])

	useEffect(() => {
		const updateTime = () => {
			setCurrentTime(new Date())
		}

		// Update every 10 seconds for smoother movement
		const interval = setInterval(updateTime, 10000)
		updateTime() // Initial update

		return () => clearInterval(interval)
	}, [])

	// Measure table dimensions on mount and resize - only run once on mount
	useEffect(() => {
		const updateDimensions = () => {
			const dimensions = measureTableDimensions()
			if (dimensions) {
				setTableDimensions(dimensions)
			}
		}

		// Single measurement attempt with a small delay to ensure table is rendered
		const timeoutId = setTimeout(updateDimensions, 100)

		// Update on resize
		const handleResize = () => {
			setTimeout(updateDimensions, 100)
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize)
		}

		return () => {
			clearTimeout(timeoutId)
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [measureTableDimensions]) // Only depend on the memoized function

	// Calculate position of red line - should be at exact current time position
	const calculateTimeLinePosition = useCallback(() => {
		const now = currentTime
		const currentHour = now.getHours()
		const currentMinute = now.getMinutes()

		if (!tableDimensions) return null

		// Find today
		const today = memoizedWeekDays.find(day => isToday(day))
		if (!today) return null

		// Find the current hour slot
		const currentTimeSlot = `${currentHour.toString().padStart(2, '0')}:00`
		const currentSlotIndex = memoizedTimeSlots.indexOf(currentTimeSlot)

		// If current hour slot not found, don't show line
		if (currentSlotIndex === -1) return null

		// Calculate exact position within the current hour slot
		const minuteProgress = currentMinute / 60 // 0 to 1 progress through the hour
		const slotTopPosition = currentSlotIndex * tableDimensions.cellHeight
		const exactPosition =
			slotTopPosition + minuteProgress * tableDimensions.cellHeight

		const topPosition = tableDimensions.headerHeight + exactPosition

		return {
			top: topPosition,
			currentSlotIndex,
			currentTimeString: `${currentHour
				.toString()
				.padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
		}
	}, [currentTime, tableDimensions, memoizedWeekDays, memoizedTimeSlots])

	// Check if a time slot has been completely passed by current time
	const isTimeSlotCompletelyPast = useCallback(
		(timeSlot: string, dayDate: Date) => {
			const now = currentTime
			const [hours] = timeSlot.split(':').map(Number)

			const slotEndDate = new Date(dayDate)
			slotEndDate.setHours(hours + 1, 0, 0, 0) // End of the time slot (next hour)

			const currentDate = new Date(now)
			currentDate.setSeconds(0, 0) // Reset seconds and milliseconds

			return currentDate >= slotEndDate // Only past if current time is past the END of the slot
		},
		[currentTime]
	)

	// Check if current day
	const isToday = useCallback(
		(date: Date) => {
			const today = currentTime
			return date.toDateString() === today.toDateString()
		},
		[currentTime]
	)

	// Notify parent about time slot status changes - only when currentTime changes
	useEffect(() => {
		if (!onTimeSlotStatusChange) return

		memoizedWeekDays.forEach(day => {
			memoizedTimeSlots.forEach(timeSlot => {
				const isPast = isTimeSlotCompletelyPast(timeSlot, day)
				onTimeSlotStatusChange(day, timeSlot, isPast)
			})
		})
	}, [
		currentTime,
		onTimeSlotStatusChange,
		memoizedWeekDays,
		memoizedTimeSlots,
		isTimeSlotCompletelyPast,
	])

	const timeLineData = calculateTimeLinePosition()

	// Only show timeline if current week contains today
	const todayInWeek = useMemo(
		() => memoizedWeekDays.some(day => isToday(day)),
		[memoizedWeekDays, isToday]
	)
	const todayIndex = useMemo(
		() => memoizedWeekDays.findIndex(day => isToday(day)),
		[memoizedWeekDays, isToday]
	)

	// Calculate today column position
	const getTodayColumnPosition = useCallback(() => {
		if (todayIndex === -1 || !tableDimensions) return null

		const left =
			tableDimensions.timeColumnWidth + todayIndex * tableDimensions.columnWidth

		return {
			left,
			width: tableDimensions.columnWidth,
		}
	}, [todayIndex, tableDimensions])

	const todayColumnPos = getTodayColumnPosition()

	return (
		<>
			{/* Time line indicator for current day only */}
			{timeLineData && todayInWeek && todayColumnPos && (
				<motion.div
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{ opacity: 1, scaleX: 1 }}
					transition={{ duration: 0.5 }}
					className='absolute z-50 pointer-events-none'
					style={{
						top: `${timeLineData.top}px`,
						left: `${todayColumnPos.left}px`,
						width: `${todayColumnPos.width}px`,
					}}
				>
					{/* Time indicator line */}
					<motion.div
						animate={{
							boxShadow: [
								'0 0 10px rgba(239, 68, 68, 0.8)',
								'0 0 20px rgba(239, 68, 68, 1)',
								'0 0 10px rgba(239, 68, 68, 0.8)',
							],
						}}
						transition={{ duration: 2, repeat: Infinity }}
						className='h-0.5 bg-red-500 relative w-full'
					>
						{/* Time label */}
						<motion.div
							animate={{
								scale: [1, 1.05, 1],
								backgroundColor: ['#ef4444', '#dc2626', '#ef4444'],
							}}
							transition={{ duration: 2, repeat: Infinity }}
							className='absolute left-1/2 -translate-x-1/2 -top-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white'
							title={`Thời gian hiện tại: ${timeLineData.currentTimeString}`}
						>
							🕐 {timeLineData.currentTimeString}
						</motion.div>

						{/* Left arrow */}
						<div className='absolute -left-1 -top-1 w-0 h-0 border-t-[3px] border-b-[3px] border-r-[6px] border-t-transparent border-b-transparent border-r-red-500'></div>

						{/* Right arrow */}
						<div className='absolute -right-1 -top-1 w-0 h-0 border-t-[3px] border-b-[3px] border-l-[6px] border-t-transparent border-b-transparent border-l-red-500'></div>
					</motion.div>
				</motion.div>
			)}
		</>
	)
}
