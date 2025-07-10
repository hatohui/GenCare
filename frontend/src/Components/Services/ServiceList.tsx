'use client'

import { useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { ServiceCard } from './ServiceCard'
import Pagination from '../Management/Pagination'
import { useSearchParams } from 'next/navigation'

const ServiceList = () => {
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const [orderByPrice, setOrderByPrice] = useState<boolean>(false)
	const [search, setSearch] = useState<string>('')
	const itemsPerPage = 6

	useEffect(() => {
		setOrderByPrice(Boolean(searchParams?.get('orderByPrice')))
		setSearch(searchParams?.get('search') ?? '')
	}, [searchParams])

	const { isError, isFetching, data } = useServiceByPage(
		page ? page : 0,
		itemsPerPage,
		orderByPrice,
		search
	)

	// Show loading state
	if (isFetching) {
		return (
			<div className='flex items-center justify-center pt-20 min-h-96'>
				<div className='text-center'>
					<div className='animate-pulse text-lg font-medium text-slate-700'>
						Đang tải dữ liệu...
					</div>
				</div>
			</div>
		)
	}

	// Show error state
	if (isError) {
		return (
			<div className='flex items-center justify-center pt-20 min-h-96'>
				<div className='text-center text-red-500 font-medium'>
					Error fetching data.
				</div>
			</div>
		)
	}

	// Show empty state
	if (data?.services.length === 0) {
		return (
			<div className='flex items-center justify-center pt-20 min-h-96'>
				<div className='text-center text-slate-500'>No data found.</div>
			</div>
		)
	}

	return (
		<div>
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
						<ServiceCard service={item} />
					</motion.div>
				))}
			</div>
			<div className='flex justify-center col-end-3'>
				<Pagination
					currentPage={page}
					isFetching={isFetching}
					setCurrentPage={setPage}
					totalCount={data?.totalCount ?? 0}
					itemsPerPage={itemsPerPage}
				/>
			</div>
		</div>
	)
}

export default ServiceList
