'use client'

import { useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'
import Pagination from '@/Components/Management/Pagination'
import { ServiceCard } from '@/Components/Services/ServiceCard'

const ServiceList = () => {
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const [orderByPrice, setOrderByPrice] = useState<boolean | null>(null)
	const [search, setSearch] = useState<string>('')
	const itemsPerPage = 6

	useEffect(() => {
		setOrderByPrice(
			searchParams.get('orderByPrice') === 'true'
				? true
				: searchParams.get('orderByPrice') === 'false'
				? false
				: null
		)
		setSearch(searchParams.get('search') || '')
	}, [searchParams])

	const { isError, isFetching, data } = useServiceByPage(
		page ? page : 0,
		itemsPerPage,
		orderByPrice,
		search
	)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 5

	return (
		<>
			{isFetching && !data && (
				<div className='flex justify-center items-center h-64'>
					<div>Loading services...</div>
				</div>
			)}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-cols-max auto-rows-max'>
				{data?.services.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							delay: index * 0.15,
							duration: 0.5,
						}}
						className=' rounded-[30px] p-2 duration-300'
					>
						<ServiceCard {...item} />
					</motion.div>
				))}

				{data?.services.length === 0 && (
					<div className='w-full h-full center-all '>No data found.</div>
				)}

				{isError && (
					<div className='w-full h-full center-all'>Error fetching data.</div>
				)}
			</div>
			<div className='flex justify-center col-end-3'>
				<Pagination
					currentPage={page}
					totalPages={pageCount}
					isFetching={isFetching}
					setCurrentPage={setPage}
				/>
			</div>
		</>
	)
}

export default ServiceList
