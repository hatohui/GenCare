'use client'
import React from 'react'
import ScheduleCalendar from '@/Components/Schedule/ScheduleCalendar'

const ScheduleManagementPage = () => {
	return (
		<div className='w-full h-full'>
			<ScheduleCalendar isAdminOrManager={true} />
		</div>
	)
}

export default ScheduleManagementPage
