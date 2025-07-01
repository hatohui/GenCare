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
	console.log(data)

	return (
		<div className='mx-auto'>
			<Profile data={data} />
		</div>
	)
}

export default Page
