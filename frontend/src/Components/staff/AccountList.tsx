'use client'

import { useGetAccountsByPageStaff } from '@/Services/account-service'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Pagination from '../Management/Pagination'
import AccountItem from './AccountItem'

const AccountList = () => {
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const [search, setSearch] = useState<string>('')
	const itemsPerPage = 6

	useEffect(() => {
		setSearch(searchParams.get('search') || '')
	}, [searchParams])

	const { isFetching, data } = useGetAccountsByPageStaff(
		itemsPerPage,
		page ? page : 0,
		search
	)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 5

	return (
		<div className=''>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max auto-rows-max'>
				{data?.accounts.map((item, index) => (
					<AccountItem key={index} item={item} />
				))}
			</div>

			<div className='flex justify-center items-end'>
				<Pagination
					currentPage={page}
					totalPages={pageCount}
					isFetching={isFetching}
					setCurrentPage={setPage}
				/>
			</div>
		</div>
	)
}

export default AccountList
