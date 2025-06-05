'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const DashBoard = () => {
	const accountStore = useAccountStore()
	const accountdata = accountStore.data?.account

	return (
		<div className='h-full w-full center-all flex-col'>
			<div>Account id: {accountdata?.id}</div>
			<div>Role: {accountdata?.role}</div>
		</div>
	)
}

export default DashBoard
