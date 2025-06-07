import AccountList from '@/Components/Management/AccountList'
import AddNewButton from '@/Components/Management/AddNewButton'
import ItemCardHeader from '@/Components/Management/ItemCardHeader'
import SearchBar from '@/Components/Management/SearchBar'
import clsx from 'clsx'
import React, { Suspense } from 'react'

const AccountPage = () => {
	return (
		<section
			className={clsx('flex h-full flex-col gap-4 md:gap-5')}
			aria-label='Account Management'
		>
			<div className='w-full flex gap-3 px-1'>
				<div className='w-full'>
					<h1 className='text-2xl font-bold'>Search</h1>
					<div className='flex gap-3 grow overflow-scroll'>
						<SearchBar />
						<AddNewButton />
					</div>
				</div>
			</div>

			<ItemCardHeader
				label='Họ và Tên'
				secondaryLabel='Email'
				thirdLabel='Ngày sinh'
				fourthLabel='Tác vụ'
			/>

			<Suspense
				fallback={
					<div className='h-full center-all w-full animate-pulse'>
						Fetching data...
					</div>
				}
			>
				<AccountList />
			</Suspense>
		</section>
	)
}

export default AccountPage
