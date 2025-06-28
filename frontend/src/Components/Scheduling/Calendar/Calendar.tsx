'use client'

import React, { useState } from 'react'
import MonthPicker from './MonthPicker'
import DateGrid from './DateGrid'
import './style.css'
import { format, isSameDay } from 'date-fns'
import clsx from 'clsx'

export type SingleDateCalendarProps = {
	selectedDate: Date | null
	setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>
	className?: string
}

const SingleDateCalendar = ({
	className,
	selectedDate,
	setSelectedDate,
}: SingleDateCalendarProps) => {
	const [currentDate, setCurrentDate] = useState(new Date())

	const handleDateClick = (date: Date) => {
		if (selectedDate && isSameDay(date, selectedDate)) {
			setSelectedDate(null)
		} else {
			setSelectedDate(date)
		}
	}

	return (
		<div
			id='calendar'
			aria-label='calendar'
			className={clsx(
				className,
				'flex flex-col gap-3 w-full max-w-sm px-6 py-4 bg-white rounded-[30px] shadow'
			)}
		>
			<MonthPicker
				className='px-3'
				currentDate={currentDate}
				setCurrentDate={setCurrentDate}
			/>
			<div className='h-[1px] rounded bg-slate-300 mx-4' />

			<DateGrid
				rangeStart={selectedDate}
				rangeEnd={selectedDate}
				currentDate={currentDate}
				handleDateClick={handleDateClick}
			/>

			<div className='text-center text-sm font-light mx-5'>
				Selected Date:{' '}
				<span className='font-medium bg-secondary/40 px-2 py-1 rounded'>
					{selectedDate ? format(selectedDate, 'MM/dd/yy') : 'None'}
				</span>
			</div>
		</div>
	)
}

export default SingleDateCalendar
