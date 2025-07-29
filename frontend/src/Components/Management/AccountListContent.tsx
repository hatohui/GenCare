'use client'

import React from 'react'
import ItemCard from './ItemCard'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { useLocale } from '@/Hooks/useLocale'

interface AccountListProps {
	accounts: Account[]
	isLoading: boolean
	isError: boolean
	isFetching: boolean
	handleDelete: (id: string) => void
	handleRestore: (id: string, data: Account) => void
	handleUpdate?: (id: string, data: any) => void
}

const AccountListContent = ({
	accounts,
	isLoading,
	isError,
	isFetching,
	handleDelete,
	handleRestore,
	handleUpdate,
}: AccountListProps) => {
	const { t } = useLocale()

	// Show loading state
	if (isFetching || isLoading) {
		return (
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='text-center'>
					<div className='animate-pulse text-lg font-medium text-slate-700'>
						{t('management.loading_data')}
					</div>
				</div>
			</div>
		)
	}

	// Show error state
	if (isError) {
		return (
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='text-center text-red-500 font-medium'>
					Internal Server Error.
				</div>
			</div>
		)
	}

	// Show empty state
	if (accounts.length === 0) {
		return (
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='text-center text-slate-500'>No data found.</div>
			</div>
		)
	}

	// Show content
	return (
		<div className='flex-1 flex flex-col min-h-0'>
			<div
				className='flex-1 overflow-y-auto min-h-0'
				style={{
					scrollbarWidth: 'thin',
					scrollbarColor: 'rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1)',
				}}
			>
				<div className='flex flex-col gap-2 px-4 py-2' role='list'>
					{accounts.map((account, key) => (
						<ItemCard<Account>
							id={account.id}
							data={account}
							delay={key}
							key={account.id}
							label={`${account.firstName} ${account.lastName}`}
							secondaryLabel={account.email}
							status={account.isDeleted ? 'FAILED' : 'SUCCESS'}
							thirdLabel={account.dateOfBirth}
							fourthLabel={account.role.name}
							path='/dashboard/accounts/'
							handleDelete={handleDelete}
							handleRestore={handleRestore}
							onUpdate={handleUpdate}
							isActive={account.isDeleted}
							enableModal={true}
							modalType='account'
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default AccountListContent
