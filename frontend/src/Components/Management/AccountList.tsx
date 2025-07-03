'use client'

import React, { useEffect, useState } from 'react'
import ItemCard from './ItemCard'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteAccount,
	useGetAccountsByPage,
	useUpdateAccount,
} from '@/Services/account-service'
import Pagination from './Pagination'
import { useSearchParams } from 'next/navigation'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { toast } from 'react-hot-toast'

const AccountList = () => {
	const [page, setPage] = useState<number>(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const searchParams = useSearchParams()
	const search = searchParams?.get('search')
	const accountDeleteMutate = useDeleteAccount()
	const query = useGetAccountsByPage(
		itemsPerPage,
		page ? page : 1,
		search ?? null
	)
	const updateAccountMutation = useUpdateAccount()

	const { isLoading, isError, isFetching, data } = query

	console.log(data)

	useEffect(() => {
		setPage(1)
	}, [search])

	const handleDelete = (id: string) => {
		accountDeleteMutate.mutate(id, {
			onSuccess: () => {
				query.refetch()
				toast.success('Account deleted successfully')
			},
			onError: error => {
				console.error('Failed to delete account:', error)
				toast.error('Failed to delete account')
			},
		})
	}

	const handleRestore = (id: string, data: Account) => {
		updateAccountMutation.mutate(
			{ id, data: { account: { ...data, isDeleted: false } } },
			{
				onSuccess: () => {
					query.refetch()
					toast.success('Account restored successfully')
				},
				onError: error => {
					console.error('Failed to restore account:', error)
					toast.error('Failed to restore account')
				},
			}
		)
	}

	return (
		<>
			{/* Show loading state */}
			{(isFetching || isLoading) && (
				<div className='flex-1 flex items-center justify-center pt-20'>
					<div className='text-center'>
						<div className='animate-pulse text-lg font-medium text-slate-700'>
							Đang tải dữ liệu...
						</div>
					</div>
				</div>
			)}

			{/* Show error state */}
			{isError && !isFetching && !isLoading && (
				<div className='flex-1 flex items-center justify-center pt-20'>
					<div className='text-center text-red-500 font-medium'>
						Internal Server Error.
					</div>
				</div>
			)}

			{/* Show empty state */}
			{data?.accounts &&
				data.accounts.length === 0 &&
				!isLoading &&
				!isFetching &&
				!isError && (
					<div className='flex-1 flex items-center justify-center pt-20'>
						<div className='text-center text-slate-500'>No data found.</div>
					</div>
				)}

			{/* Show content */}
			{!isFetching &&
				!isLoading &&
				!isError &&
				data?.accounts &&
				data.accounts.length > 0 && (
					<div
						className='flex-1 overflow-y-scroll scroll-bar'
						style={{
							maskImage:
								'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
							WebkitMaskImage:
								'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
						}}
					>
						<div className='flex flex-col gap-3 px-2 py-1' role='list'>
							{data.accounts.map((account, key) => (
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
									isActive={account.isDeleted}
								/>
							))}
						</div>
					</div>
				)}

			{/* Pagination - only show when there's content or when not loading */}
			{!isFetching && !isLoading && data && (
				<div className='center-all'>
					<Pagination
						currentPage={page}
						isFetching={isFetching}
						setCurrentPage={setPage}
						totalCount={data?.totalCount || 0}
						itemsPerPage={itemsPerPage}
					/>
				</div>
			)}
		</>
	)
}

export default AccountList
