'use client'
import AddNewButton from '@/Components/Management/AddNewButton'
import AddNewServiceForm from '@/Components/Management/AddNewServiceForm'
import ItemCardHeader from '@/Components/Management/ItemCardHeader'
import Pagination from '@/Components/Management/Pagination'
import SearchBar from '@/Components/Management/SearchBar'
import ServiceListContent from '@/Components/Management/ServiceListContent'
import FilterButtons from '@/Components/Management/FilterButtons'
import { useServiceManagement } from '@/Hooks/useServiceManagement'
import { useLocale } from '@/Hooks/useLocale'
import clsx from 'clsx'
import React, { useState } from 'react'
import { motion } from 'motion/react'

const ServicesPage = () => {
	const [isAddNewOpen, setIsAddNewOpen] = useState(false)
	const { t } = useLocale()

	const {
		services,
		totalCount,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		isLoading,
		isError,
		isFetching,
		handleDelete,
		handleRestore,
		handleUpdate,
		orderByPrice,
		includeDeleted,
		sortByAlphabetical,
		setIncludeDeleted,
		handlePriceSorting,
		handleAlphabeticalSorting,
		refetch,
	} = useServiceManagement()

	const handleAddNew = () => setIsAddNewOpen(!isAddNewOpen)

	if (isError)
		return (
			<div className='h-full center-all w-full text-red-500'>
				{t('common.error')}
			</div>
		)

	return (
		<>
			{isAddNewOpen && (
				<div className='h-full w-full absolute'>
					<AddNewServiceForm
						className='z-20'
						onSuccess={() => refetch()}
						onClose={() => setIsAddNewOpen(false)}
					/>
				</div>
			)}

			<motion.section
				className={clsx('flex h-full flex-col px-0 py-4 min-h-0')}
				aria-label='Service Management'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			>
				{/* Header with Search and Add Button */}
				<motion.div
					className='flex items-center justify-between gap-4 px-4 mb-4'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
				>
					<div className='flex-1'>
						<motion.h1
							className='text-xl font-semibold text-slate-800 mb-1'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
						>
							{t('services.management')}
						</motion.h1>
						<motion.p
							className='text-xs text-text'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
						>
							{t('services.search_and_manage')}
						</motion.p>
					</div>
					<motion.div
						className='flex items-center gap-3'
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
					>
						<SearchBar waitTime={1000} />
						<AddNewButton handleAddNew={handleAddNew} />
					</motion.div>
				</motion.div>

				{/* Filter Buttons */}
				<FilterButtons
					includeDeleted={includeDeleted}
					orderByPrice={orderByPrice}
					sortByAlphabetical={sortByAlphabetical}
					setIncludeDeleted={setIncludeDeleted}
					handlePriceSorting={handlePriceSorting}
					handleAlphabeticalSorting={handleAlphabeticalSorting}
				/>

				{/* Content Area */}
				<motion.div
					className='flex-1 flex flex-col overflow-hidden min-h-0 mt-4'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
				>
					{/* Table Header */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<ItemCardHeader
							label={t('services.name')}
							secondaryLabel={t('services.description')}
							thirdLabel={t('services.price')}
							fourthLabel=''
							fifthLabel={t('common.actions')}
						/>
					</motion.div>

					{/* Service List */}
					<motion.div
						className='flex-1 min-h-0'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.6 }}
					>
						<ServiceListContent
							services={services}
							isLoading={isLoading}
							isError={isError}
							isFetching={isFetching}
							handleDelete={handleDelete}
							handleRestore={handleRestore}
							handleUpdate={handleUpdate}
						/>
					</motion.div>
				</motion.div>

				{/* Pagination - Fixed at bottom */}
				<motion.div
					className='center-all py-3 mt-auto'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.8 }}
				>
					<Pagination
						currentPage={currentPage}
						isFetching={isFetching}
						setCurrentPage={setCurrentPage}
						totalCount={totalCount}
						itemsPerPage={itemsPerPage}
					/>
				</motion.div>
			</motion.section>
		</>
	)
}

export default ServicesPage
