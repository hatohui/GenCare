import React, { useState } from 'react'
import MonthPicker from './MonthPicker'
import DateGrid from './DateGrid'
import './style.css'
import { format, isBefore, isSameDay } from 'date-fns'

export type RangeCalendarProps = {
	startDate: Date | null
	endDate: Date | null
	setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
	setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
}

const RangeCalendar = ({
	startDate,
	endDate,
	setStartDate,
	setEndDate,
}: RangeCalendarProps) => {
	const [currentDate, setCurrentDate] = useState(new Date())

	const handleDateClick = (date: Date) => {
		if (!startDate || (startDate && endDate)) {
			setStartDate(date)
			setEndDate(null)
		}

		if (startDate && !endDate) {
			if (isBefore(date, startDate)) {
				setEndDate(startDate)
				setStartDate(date)
			} else if (!isSameDay(date, startDate)) {
				setEndDate(date)
			}
		}

		if (startDate && endDate) {
			setStartDate(date)
			setEndDate(null)
		}

		if (startDate && isSameDay(date, startDate)) {
			setStartDate(null)
		}

		if (endDate && isSameDay(date, endDate)) {
			setStartDate(null)
		}
	}

	return (
		<div
			id='calendar'
			aria-label='calendar'
			className='flex flex-col gap-3 w-full max-w-sm px-6 py-4 bg-white rounded-[30px] shadow'
		>
			<MonthPicker
				className='px-3'
				currentDate={currentDate}
				setCurrentDate={setCurrentDate}
			/>
			<div className='h-[1px] rounded bg-slate-300 mx-4' />

			<DateGrid
				rangeStart={startDate}
				rangeEnd={endDate}
				currentDate={currentDate}
				handleDateClick={handleDateClick}
			/>

			<div className='text-center text-sm font-light mx-5 flex justify-around'>
				Selected Range:{' '}
				<span className='font-medium w-1/4 bg-secondary/40 px-1 rounded'>
					{startDate ? format(startDate, 'MM/dd/yy') : 'None'}
				</span>
				{' - '}
				<span className='font-medium w-1/4 bg-secondary/40 px-1 rounded'>
					{endDate ? format(endDate, 'MM/dd/yy') : 'None'}
				</span>
			</div>
		</div>
	)
}

export default RangeCalendar
