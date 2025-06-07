import React from 'react'
import ItemCardHeader from './ItemCardHeader'
import { GetAccountByPageResponse } from '@/Interfaces/Account/Schema/account'
import ItemCard from './ItemCard'

const AccountList = ({
	data,
	handleDelete,
}: {
	data: GetAccountByPageResponse
	handleDelete: (id: string) => void
}) => {
	return (
		<>
			<ItemCardHeader
				label='Họ và Tên'
				secondaryLabel='Email'
				thirdLabel='Ngày sinh'
				fourthLabel='Tác vụ'
			/>

			<div className='flex-1 overflow-y-auto'>
				<div className='flex flex-col gap-3 px-2 py-1' role='list'>
					{data.accounts && data.accounts.length === 0 ? (
						<div className='w-full h-full center-all'>No data found</div>
					) : (
						data?.accounts.map((account, key) => (
							<ItemCard
								id={account.id}
								delay={key}
								key={account.id}
								label={`${account.firstName} ${account.lastName}`}
								secondaryLabel={account.email}
								status={account.isDeleted ? 'FAILED' : 'SUCCESS'}
								thirdLabel={account.dateOfBirth}
								path='/accounts/'
								handleDelete={handleDelete}
							/>
						))
					)}
				</div>
			</div>
		</>
	)
}

export default AccountList
