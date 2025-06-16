'use client'

import { useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import { ServiceCard } from './ServiceCard'
import Pagination from '../Management/Pagination'

const ServiceList = () => {
	const [page, setPage] = useState<number>(1)
	const itemsPerPage = 6

	const { isError, isFetching, data } = useServiceByPage(
		page ? page : 0,
		itemsPerPage
	)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 5

	// const handleDelete = () => {
	// 	alert('Account is getting deleted')
	// }

	return (
		<>
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
