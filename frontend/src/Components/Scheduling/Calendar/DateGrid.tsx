import clsx from 'clsx'
import React, { useEffect } from 'react'
import {
	format,
	isFirstDayOfMonth,
	isLastDayOfMonth,
	isSameDay,
	isSameMonth,
	isToday,
	isWithinInterval,
} from 'date-fns'
import { getCalendarDates } from '@/Utils/Calendar/getCalendarDates'
import { animate } from 'motion/react'

export type DateGridProps = {
	currentDate: Date
	rangeStart: Date | null
	rangeEnd: Date | null
	handleDateClick: (date: Date) => void
}

const DateGrid = ({
	rangeStart,
	rangeEnd,
	currentDate,
	handleDateClick,
}: DateGridProps) => {
	const keyDateString = currentDate.toDateString()

	useEffect(() => {
		animate('.toBeAnimated', { opacity: 1 }, { duration: 0.5, ease: 'easeIn' })
	}, [keyDateString])

	const dates = getCalendarDates(currentDate)
	const firstWeek = dates.slice(0, 7)

	const isInRange = (date: Date) => {
		if (rangeStart && rangeEnd) {
			return isWithinInterval(date, { start: rangeStart, end: rangeEnd })
		}
		return false
	}

	const isInRangeThisMonth = (date: Date) => {
		return isInRange(date) && isSameMonth(date, currentDate)
	}

	const isStart = (date: Date) => rangeStart && isSameDay(date, rangeStart)
	const isEnd = (date: Date) => rangeEnd && isSameDay(date, rangeEnd)
	const isStartOrEnd = (date: Date) => isStart(date) || isEnd(date)
	const isSingleDay = rangeStart && rangeEnd && isSameDay(rangeStart, rangeEnd)

	return (
		<section id='calendar-cell'>
			<div className='calendar-grid grid-rows-1 py-1'>
				{firstWeek.map(day => (
					<div
						key={day.toDateString()}
						className={clsx(
							'text-center text-sm opacity-80',
							format(day, 'EEEEEE') === 'Su' ? 'text-red-500' : 'text-main'
						)}
					>
						{format(day, 'EEEEEE')}
					</div>
				))}
			</div>
			<div key={keyDateString} className='calendar-grid grid-rows-6'>
				{dates.map(date => (
					<div
						key={date.toDateString()}
						className='my-1 opacity-0 toBeAnimated'
					>
						<div
							className={clsx(
								'center-all h-full w-full px-[2px]',
								isInRangeThisMonth(date) &&
									isFirstDayOfMonth(date) &&
									'start-cell',
								isInRangeThisMonth(date) &&
									isLastDayOfMonth(date) &&
									!isSingleDay &&
									'end-cell',
								isStart(date) &&
									rangeEnd &&
									isSameMonth(date, currentDate) &&
									!isSingleDay &&
									'start-cell',
								isEnd(date) &&
									rangeStart &&
									isSameMonth(date, currentDate) &&
									!isSingleDay &&
									'end-cell',
								isInRangeThisMonth(date) &&
									!isStartOrEnd(date) &&
									!isFirstDayOfMonth(date) &&
									!isLastDayOfMonth(date)
									? 'bg-blue-200'
									: ''
							)}
						>
							<button
								key={date.toDateString()}
								onClick={() => handleDateClick(date)}
								className={clsx(
									'hoverable h-full text-sm w-full border py-2 px-1 select-none rounded-full',

									isToday(date) && 'today-cell',

									isStartOrEnd(date) &&
										isSameMonth(date, currentDate) &&
										'selected-cell',

									!isSameMonth(date, currentDate) && 'disabled-cell',

									isFirstDayOfMonth(date) &&
										isInRangeThisMonth(date) &&
										'month-rear-button',

									isLastDayOfMonth(date) &&
										isInRangeThisMonth(date) &&
										'month-rear-button',

									'border-transparent hover:border-transparent'
								)}
							>
								{date.getDate()}
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default DateGrid
