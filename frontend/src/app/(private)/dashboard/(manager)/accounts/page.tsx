import AccountList from '@/Components/Management/AccountList'
import AddNewButton from '@/Components/Management/AddNewButton'
import SearchBar from '@/Components/Management/SearchBar'
import clsx from 'clsx'
import React from 'react'
import AccountListHeader from '@/Components/Management/ItemCardHeader'

const AccountPage = () => {
	return (
		<section
			className={clsx('flex h-full flex-col gap-4 md:gap-5')}
			aria-label='Account Management'
		>
			<div className='w-full flex gap-3 px-1'>
				<div className='w-full'>
					<div className='flex items-center px-5 gap-3 grow shadow-sm bg-general py-1 pt-2 round overflow-scroll'>
						<SearchBar className='mx-2' waitTime={1000} />
						<AddNewButton handleAddNew={() => {}} />
					</div>
				</div>
			</div>

			<AccountListHeader
				label='Họ và Tên'
				secondaryLabel='Email'
				thirdLabel='Vai trò'
				fourthLabel='Ngày sinh'
				fifthLabel='Tác vụ'
			/>

			<AccountList />
		</section>
	)
}

export default AccountPage
