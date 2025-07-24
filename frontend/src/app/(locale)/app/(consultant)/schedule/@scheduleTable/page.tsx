'use client'

import React from 'react'
import ScheduleCalendar from '@/Components/Schedule/ScheduleCalendar'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import useToken from '@/Hooks/Auth/useToken'

const ScheduleTable = () => {
	const { accessToken } = useToken()
	const userRole = accessToken ? getRoleFromToken(accessToken) : null

	// Check if user is admin or manager
	const isAdminOrManager = userRole === 'admin' || userRole === 'manager'

	return (
		<div className='w-full h-full'>
			<ScheduleCalendar isAdminOrManager={isAdminOrManager} />
		</div>
	)
}

export default ScheduleTable
