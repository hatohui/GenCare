'use client'

import BirthControlForm from '@/Components/app/BirthControl/BirthControlForm'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const Page = () => {
	const { data, isLoading } = useAccountStore()

	if (isLoading) return <div>Loading...</div>

	return (
		<div>
			<div className='bg-general p-7 rounded-[30px]'>
				<BirthControlForm accountID={data?.id || ''} />
			</div>
		</div>
	)
}

export default Page
