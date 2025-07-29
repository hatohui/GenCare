'use client'
import React from 'react'
import SlotManagementCalendar from '@/Components/SlotManagement/SlotManagementCalendar'
import { useAccountStore } from '@/Hooks/useAccount'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'

const ScheduleManagementPage = () => {
	const { data: userData } = useAccountStore()

	const isManager = isAllowedRole(userData?.role.name, PermissionLevel.manager)

	if (!isManager) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900 mb-2'>
						Access Denied
					</h1>
					<p className='text-gray-600'>
						You don&apos;t have permission to access this page.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='w-full h-full'>
			<SlotManagementCalendar isManager={true} />
		</div>
	)
}

export default ScheduleManagementPage
