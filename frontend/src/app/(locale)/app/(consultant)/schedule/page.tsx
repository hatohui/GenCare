'use client'
import React from 'react'
import ConsultantScheduleView from '@/Components/SlotManagement/ConsultantScheduleView'
import { useAccountStore } from '@/Hooks/useAccount'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'

const SchedulePage = () => {
	const { data: userData } = useAccountStore()

	// Check if user has consultant permission
	const isConsultant = isAllowedRole(
		userData?.role.name,
		PermissionLevel.consultant
	)

	if (!isConsultant) {
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

	if (!userData?.id) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900 mb-2'>Loading...</h1>
					<p className='text-gray-600'>Please wait while we load your data.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='w-full h-full'>
			<ConsultantScheduleView consultantId={userData.id} />
		</div>
	)
}

export default SchedulePage
