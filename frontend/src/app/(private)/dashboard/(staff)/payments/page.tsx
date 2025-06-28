'use client'

import SearchBar from '@/Components/Management/SearchBar'
import AccountList from '@/Components/staff/AccountList'
import clsx from 'clsx'
import React from 'react'

const Page = () => {
	return (
		<section
			className={clsx('flex flex-col gap-4 md:gap-5')}
			aria-label='Account'
		>
			<div className='w-full flex gap-3 px-1'>
				<div className='w-full'>
					<div className='flex items-center px-5 gap-3 grow shadow-sm bg-general py-1 pt-2 round'>
						<SearchBar className='mx-2' waitTime={1000} />
					</div>
				</div>
			</div>
			<AccountList />
		</section>
	)
}

export default Page
