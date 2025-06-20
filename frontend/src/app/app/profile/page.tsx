'use client'

import Profile from '@/Components/Profile/profile'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const Page = () => {
	const { data, isLoading } = useAccountStore()
	if (isLoading) {
		return <div>Loading...</div>
	}

	if (!data) {
		return <div>No account data found.</div>
	}

	return (
		<div className='flex center-all'>
			<Profile data={data} />
		</div>
	)
}

export default Page
