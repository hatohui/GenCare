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

	useEffect(() => {
		setPage(1)
	}, [search])

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 1

	const handleDelete = (id: string) => {
		if (window.confirm('Are you sure you want to delete this account?')) {
			accountDeleteMutate.mutate(id, {
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
			})
		}
	}

	const handleRestore = (id: string, data: Account) => {
		if (window.confirm('Are you sure you want to restore this account?')) {
			updateAccountMutation.mutate(
				{ id, data: { account: { ...data, isDeleted: false } } },
				{
					onSuccess: () => {
						query.refetch()
					},
					onError: () => {},
				}
			)
		}
	}

	return (
		<>
			<div className='flex-1 overflow-y-scroll scroll-bar'>
				<div className='flex flex-col gap-3 px-2 py-1' role='list'>
					{data?.accounts &&
					data.accounts.length === 0 &&
					!isLoading &&
					!isFetching ? (
						<div className='w-full h-full center-all'>No data found.</div>
					) : (
						data?.accounts.map((account, key) => (
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
						))
					)}
					{(isFetching || isLoading) && (
						<div className='h-full center-all w-full animate-pulse'>
							Đang tải dữ liệu...
						</div>
					)}
					{isError && (
						<div className='h-full center-all w-full text-red-500'>
							Internal Server Error.
						</div>
					)}
				</div>
			</div>

			<div className='center-all'>
				<Pagination
					currentPage={page}
					isFetching={isFetching}
					setCurrentPage={setPage}
					totalCount={pageCount}
					itemsPerPage={itemsPerPage}
				/>
			</div>
		</>
	)
}

export default AccountList
