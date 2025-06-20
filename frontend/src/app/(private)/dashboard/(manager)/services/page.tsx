'use client'
import AddNewButton from '@/Components/Management/AddNewButton'
import ItemCardHeader from '@/Components/Management/ItemCardHeader'
import Pagination from '@/Components/Management/Pagination'
import SearchBar from '@/Components/Management/SearchBar'
import ServiceList from '@/Components/Management/ServiceList'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { useServiceByPageAdmin } from '@/Services/service-services'
import clsx from 'clsx'
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
			className={clsx('flex w-full h-full flex-col gap-4 md:gap-5')}
			aria-label='Account Management'
		>
			<div className='w-full flex gap-3 px-1'>
				<div className='w-full'>
					<div className='flex items-center px-5 gap-3 grow shadow-sm bg-general py-1 pt-2 round overflow-scroll'>
						<SearchBar className='mx-2' waitTime={1000} />

						<AddNewButton />
					</div>
				</div>
			</div>

			<ItemCardHeader
				label='Tên dịch vụ'
				secondaryLabel='Miêu tả'
				fourthLabel='Giá'
				fifthLabel='Tác vụ'
			/>

			{!data || isLoading || isFetching || !data.services ? (
				<div className='h-full center-all w-full animate-pulse'>
					Fetching data...
				</div>
			) : (
				<ServiceList data={data} handleDelete={handleDelete} />
			)}

			<div className='center-all'>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					isFetching={isFetching}
					setCurrentPage={setCurrentPage}
				/>
			</div>
		</section>
	)
}

export default ServicesPage
