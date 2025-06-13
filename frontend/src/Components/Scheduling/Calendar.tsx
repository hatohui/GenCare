'use client'

import React, { useState } from 'react'
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	addMonths,
	subMonths,
	format,
	isSameMonth,
	isSameDay,
	isWithinInterval,
	isBefore,
	isAfter,
} from 'date-fns'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [rangeStart, setRangeStart] = useState<Date | null>(null)
	const [rangeEnd, setRangeEnd] = useState<Date | null>(null)

	const handleDateClick = (selectedDate: Date) => {
		console.log(selectedDate)

		if (!rangeStart || (rangeStart && rangeEnd)) {
			setRangeStart(selectedDate)
			setRangeEnd(null)
		} else if (rangeStart && !rangeEnd) {
			if (isBefore(selectedDate, rangeStart)) {
				setRangeStart(selectedDate)
			} else {
				setRangeEnd(selectedDate)
			}
		}
	}

	const isInRange = (date: Date) => {
		if (rangeStart && rangeEnd) {
			return isWithinInterval(date, { start: rangeStart, end: rangeEnd })
		}
		return false
	}

	const isStartOrEnd = (date: Date) =>
		(rangeStart && isSameDay(date, rangeStart)) ||
		(rangeEnd && isSameDay(date, rangeEnd))

	const renderHeader = () => (
		<div className='flex justify-between items-center mb-4'>
			<button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
				◀
			</button>
			<h2 className='text-lg font-bold'>{format(currentDate, 'MMMM yyyy')}</h2>
			<button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
				▶
			</button>
		</div>
	)

	const renderDays = () => (
		<div className='grid grid-cols-7 text-center font-semibold'>
			{daysOfWeek.map(day => (
				<div key={day}>{day}</div>
			))}
		</div>
	)

	const renderCells = () => {
		const monthStart = startOfMonth(currentDate)
		const monthEnd = endOfMonth(monthStart)
		const startDate = startOfWeek(monthStart)
		const endDate = endOfWeek(monthEnd)

		const rows = []
		let days = []
		let day = startDate

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const isToday = isSameDay(day, new Date())
				const isCurrentMonth = isSameMonth(day, monthStart)

				const inRange = isInRange(day)
				const isSelected = isStartOrEnd(day)

				days.push(
					<div
						key={day.toString()}
						onClick={() => handleDateClick(day)}
						className={`text-center h-16 flex items-center justify-center cursor-pointer
              ${
								isCurrentMonth
									? 'hover:bg-accent/20'
									: 'text-gray-400 bg-slate-300'
							}
              ${isSelected ? 'bg-blue-300 text-white round' : ''}
              ${inRange && !isSelected ? 'bg-blue-200 text-blue-800' : ''}
              ${isToday && !isSelected ? 'ring-1 ring-blue-400' : ''}
            `}
					>
						{format(day, 'd')}
					</div>
				)
				day = addDays(day, 1)
			}
			rows.push(
				<div className='grid grid-cols-7' key={day.toString()}>
					{days}
				</div>
			)
			days = []
		}

		return <div className='mt-2'>{rows}</div>
	}

	return (
		<div className='w-full max-w-md mx-auto p-4 bg-white rounded shadow'>
			{renderHeader()}
			{renderDays()}
			{renderCells()}

			<div className='mt-4 text-center text-sm text-gray-600'>
				Selected: {rangeStart ? format(rangeStart, 'MMM d, yyyy') : 'None'} →{' '}
				{rangeEnd ? format(rangeEnd, 'MMM d, yyyy') : 'None'}
			</div>
		</div>
	)
}

export default Calendar
