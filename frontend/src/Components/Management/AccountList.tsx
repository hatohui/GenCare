'use client'

import React, { useState } from 'react'
import ItemCard from './ItemCard'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import {
	useDeleteAccount,
	useGetAccountsByPage,
} from '@/Services/account-service'
import Pagination from './Pagination'
import { useSearchParams } from 'next/navigation'

const AccountList = () => {
	const [page, setPage] = useState<number>(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const searchParams = useSearchParams()
	const search = searchParams.get('search')
	const accountDeleteMutate = useDeleteAccount()
	const [isAddNewOpen, setIsAddNewOpen] = useState(false)
	const query = useGetAccountsByPage(itemsPerPage, page ? page : 1, search)
	const [orderByPrice, setOrderByPrice] = useState<boolean>(false)
	const [] = useState<boolean>(false)

	const { isLoading, isError, isFetching, data } = query

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 5

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
							<ItemCard
								id={account.id}
								delay={key}
								key={account.id}
								label={`${account.firstName} ${account.lastName}`}
								secondaryLabel={account.email}
								status={account.isDeleted ? 'FAILED' : 'SUCCESS'}
								thirdLabel={account.dateOfBirth}
								fourthLabel={account.role.name}
								path='/dashboard/accounts/'
								handleDelete={handleDelete}
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
					totalPages={pageCount}
				/>
			</div>
		</>
	)
}

export default AccountList
