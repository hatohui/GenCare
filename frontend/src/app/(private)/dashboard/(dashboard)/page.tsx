'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const DashBoard = () => {
	const { data, isLoading } = useAccountStore()
	const accountData = data

	if (isLoading) {
		return <div className='h-full w-full center-all'>Loading....</div>
	}

	return (
		<div className='h-full w-full center-all flex-col'>
			<div>Account id: {accountData?.id}</div>
			<div>Role: {accountData?.role.name}</div>
		</div>
	)
}

export default DashBoard
