'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const DashBoard = () => {
	const { data: store, isLoading } = useAccountStore()
	const accountData = store?.account

	if (isLoading) {
		return <div className='h-full w-full center-all'>Loading....</div>
	}

	return (
		<div className='h-full w-full center-all flex-col'>
			<div>Account id: {accountData?.id}</div>
			<div>Role: {accountData?.role}</div>
		</div>
	)
}

export default DashBoard
