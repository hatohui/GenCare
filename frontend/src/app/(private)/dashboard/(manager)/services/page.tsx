'use client'
import Pagination from '@/Components/Management/Pagination'
import SearchBar from '@/Components/Management/SearchBar'
import ServiceList from '@/Components/Management/ServiceList'
import { PlusSVG } from '@/Components/SVGs'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { useServiceByPageAdmin } from '@/Services/service-services'
import clsx from 'clsx'
import { motion } from 'motion/react'
import React, { useState } from 'react'

const ServicesPage = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const totalPages = 5

	const { isError, isFetching, data, isLoading } = useServiceByPageAdmin(
		currentPage,
		itemsPerPage
	)

	//delete
	const handleDelete = () => {
		alert('Account is getting deleted')
	}

	if (isError)
		return <div className='h-full center-all w-full text-red-500'>Error.</div>

	return (
		<section
			className={clsx('flex h-full flex-col gap-4 md:gap-5')}
			aria-label='Account Management'
		>
			<div className='w-full flex gap-3 px-1'>
				<div className='w-full'>
					<h1 className='text-2xl font-bold'>Search</h1>
					<div className='flex gap-3 grow overflow-scroll'>
						<SearchBar />
						<motion.button
							className='rounded-[30px] z-50 drop-shadow-smt cursor-pointer flex center-all gap-2 border px-3'
							tabIndex={0}
							whileHover={{
								backgroundColor: 'var(--color-accent)',
								color: 'var(--color-general)',
							}}
							transition={{ duration: 0.2 }}
						>
							<span className='pointer-events-none'>
								<PlusSVG />
							</span>
							<span className='whitespace-nowrap pointer-events-none hidden md:block'>
								Add
							</span>
						</motion.button>
					</div>
				</div>
			</div>

			{!data || isLoading || isFetching || !data.payload ? (
				<div className='h-full center-all w-full animate-pulse'>
					Fetching data...
				</div>
			) : (
				<ServiceList data={data} handleDelete={handleDelete} />
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				isFetching={isFetching}
				setCurrentPage={setCurrentPage}
			/>
		</section>
	)
}

export default ServicesPage
