'use client'
import Calendar from '@/Components/Scheduling/Calendar/RangeCalendar'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const DashBoard = () => {
	const { data, isLoading } = useAccountStore()
	const [startDate, setStartDate] = React.useState<Date | null>(null)
	const [endDate, setEndDate] = React.useState<Date | null>(null)

	if (isLoading) {
		return <div className='h-full w-full center-all'>Loading....</div>
	}

	return (
		<div className='h-full w-full center-all flex-col'>
			<div>Account id: {data?.id}</div>
			<div>Role: {data?.role.name}</div>

			<Calendar
				startDate={startDate}
				endDate={endDate}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
			/>
		</div>
	)
}

export default DashBoard
