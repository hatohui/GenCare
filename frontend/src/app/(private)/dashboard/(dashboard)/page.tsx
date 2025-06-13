'use client'
import Calendar from '@/Components/Scheduling/Calendar'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const DashBoard = () => {
	const { data, isLoading } = useAccountStore()

	if (isLoading) {
		return <div className='h-full w-full center-all'>Loading....</div>
	}

	return (
		<div className='h-full w-full center-all flex-col'>
			<div>Account id: {data?.id}</div>
			<div>Role: {data?.role.name}</div>
			<Calendar />
		</div>
	)
}

export default DashBoard
