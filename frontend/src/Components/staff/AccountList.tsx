import { useGetAccountsByPageStaff } from '@/Services/account-service'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Pagination from '../Management/Pagination'

const AccountList = () => {
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const [search, setSearch] = useState<string>('')
	const itemsPerPage = 6

	useEffect(() => {
		setSearch(searchParams.get('search') || '')
	}, [searchParams])

	const { isError, isFetching, data } = useGetAccountsByPageStaff(
		itemsPerPage,
		page ? page : 0,
		search
	)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 5

	return (
		<div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max auto-rows-max'>
				{data?.accounts.map((item, index) => (
					<div
						key={item.id}
						className='flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow-sm'
					>
						<div className='flex flex-col gap-2'>
							<h3 className='text-lg font-semibold text-gray-900'>
								{item.firstName} {item.lastName}
							</h3>
							<p className='text-sm text-gray-500'>{item.email}</p>
						</div>
					</div>
				))}
			</div>

			<div className='flex justify-center col-end-3'>
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
