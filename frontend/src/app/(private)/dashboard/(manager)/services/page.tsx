'use client'
import AddNewButton from '@/Components/Management/AddNewButton'
import AddNewServiceForm from '@/Components/Management/AddNewServiceForm'
import ItemCardHeader from '@/Components/Management/ItemCardHeader'
import Pagination from '@/Components/Management/Pagination'
import SearchBar from '@/Components/Management/SearchBar'
import ServiceList from '@/Components/Management/ServiceList'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { ServiceDTO } from '@/Interfaces/Service/Schemas/service'
import {
	useDeleteService,
	useServiceByPageAdmin,
	useUpdateService,
} from '@/Services/service-services'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

const ServicesPage = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const deleteMutation = useDeleteService()
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const searchParams = useSearchParams()
	const search = searchParams.get('search')
	const [orderByPrice, setOrderByPrice] = useState<boolean | null>(null)
	const [includeDeleted, setIncludeDeleted] = useState<boolean | null>(null)
	const [sortByAlphabetical, setSortByAlphabetical] = useState<boolean>(false)
	const updateMutation = useUpdateService()

	const query = useServiceByPageAdmin(
		currentPage,
		itemsPerPage,
		search,
		includeDeleted,
		orderByPrice,
		sortByAlphabetical
	)

	const { isError, isFetching, data, isLoading } = query
	const [isAddNewOpen, setIsAddNewOpen] = useState(false)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 5

	const handleDelete = (id: string) => {
		if (window.confirm('Bạn có muốn xóa mục này không?'))
			deleteMutation.mutate(id, {
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
			})
	}

	const handleRestore = (id: string, data: ServiceDTO) => {
		if (window.confirm('Bạn có muốn khôi phục mục này không?'))
			updateMutation.mutate(
				{ id, data: { ...data, isDeleted: false } },
				{
					onSuccess: () => {
						query.refetch()
					},
					onError: () => {},
				}
			)
	}

	if (isError)
		return <div className='h-full center-all w-full text-red-500'>Error.</div>

	return (
		<>
			{isAddNewOpen && (
				<div className='h-full w-full absolute  '>
					<AddNewServiceForm
						className='z-20'
						onSuccess={() => query.refetch()}
						onClose={() => setIsAddNewOpen(false)}
					/>
				</div>
			)}

			<section
				className={clsx(
					'flex w-full h-full flex-col gap-4 select-none md:gap-5'
				)}
				aria-label='Account Management'
			>
				<div className='w-full flex gap-3 px-1'>
					<div className='w-full'>
						<div className='flex items-center px-5 gap-3 grow shadow-sm bg-general py-1 pt-2 round overflow-scroll'>
							<SearchBar className='mx-2' waitTime={1000} />
							<AddNewButton
								handleAddNew={() => setIsAddNewOpen(!isAddNewOpen)}
							/>
						</div>
					</div>
				</div>

				<div className='flex flex-wrap gap-3 px-1'>
					{/* IncludeDeleted filter */}
					<button
						onClick={() => setIncludeDeleted(null)}
						className={clsx(
							'flex items-center px-3 py-1 rounded-md shadow-sm hover:brightness-90',
							includeDeleted === null
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-black'
						)}
					>
						Tất cả
					</button>
					<button
						onClick={() => setIncludeDeleted(false)}
						className={clsx(
							'flex items-center px-3 py-1 rounded-md shadow-sm hover:brightness-90',
							includeDeleted === false
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-black'
						)}
					>
						Đang hoạt động
					</button>
					<button
						onClick={() => setIncludeDeleted(true)}
						className={clsx(
							'flex items-center px-3 py-1 rounded-md shadow-sm hover:brightness-90',
							includeDeleted === true
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-black'
						)}
					>
						Ngừng hoạt động
					</button>

					{/* Price sorting toggle */}
					<button
						onClick={() => {
							if (orderByPrice === null) {
								setOrderByPrice(true)
								setSortByAlphabetical(false)
							} else if (orderByPrice === true) {
								setOrderByPrice(false)
								setSortByAlphabetical(false)
							} else {
								setOrderByPrice(null)
							}
						}}
						className={clsx(
							'flex items-center px-3 py-1 rounded-md shadow-sm hover:brightness-90',
							orderByPrice !== null
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-black'
						)}
					>
						{orderByPrice === null
							? 'Sắp xếp giá (Tắt)'
							: orderByPrice
							? 'Giá tăng dần ↑'
							: 'Giá giảm dần ↓'}
					</button>

					{/* Alphabetical sorting toggle */}
					<button
						onClick={() => {
							setSortByAlphabetical(prev => {
								const newState = !prev
								if (newState) setOrderByPrice(null)
								return newState
							})
						}}
						className={clsx(
							'flex items-center px-3 py-1 rounded-md shadow-sm hover:brightness-90',
							sortByAlphabetical
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-black'
						)}
					>
						{sortByAlphabetical ? 'A → Z' : 'Sắp xếp ABC'}
					</button>
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
					<ServiceList
						data={data}
						handleDelete={handleDelete}
						handleRestore={handleRestore}
					/>
				)}

				<div className='center-all'>
					<Pagination
						currentPage={currentPage}
						totalPages={pageCount}
						isFetching={isFetching}
						setCurrentPage={setCurrentPage}
					/>
				</div>
			</section>
		</>
	)
}

export default ServicesPage
