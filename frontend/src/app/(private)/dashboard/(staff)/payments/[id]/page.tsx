'use client'

import SearchBar from '@/Components/Management/SearchBar'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
	const { id } = useParams()
	const router = useRouter()

	if (!id) {
		router.push('/dashboard/accounts')
		return <div>Loading...</div>
	}

	return (
		<div className='h-full w-full '>
			<div className='w-full flex gap-3 px-1'>
				<div className='flex items-center px-5 gap-3 grow shadow-sm bg-general py-1 pt-2 round overflow-scroll'>
					<SearchBar className='mx-2' waitTime={1000} />
				</div>
			</div>
		</div>
	)
}

export default Page
