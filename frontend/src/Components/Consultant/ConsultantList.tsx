'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'
import { ConsultantCard } from './ConsultantCard'
import { useGetConsultants } from '@/Services/account-service'
import Button from '@/Components/Button'
import LoadingIcon from '@/Components/LoadingIcon'

interface ConsultantListProps {
	itemsPerPage?: number
	onConsultantClick?: (consultant: Consultant) => void
}

export const ConsultantList = ({
	itemsPerPage = 8,
	onConsultantClick,
}: ConsultantListProps) => {
	const [currentPage, setCurrentPage] = useState(1)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const { data, isLoading, error } = useGetConsultants(
		itemsPerPage,
		currentPage,
		searchTerm || null
	)

	const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 0

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		setCurrentPage(1) // Reset to first page when searching
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<LoadingIcon />
			</div>
		)
	}

	if (error) {
		return (
			<div className='text-center py-8'>
				<p className='text-red-600 mb-4'>Failed to load consultants</p>
				<Button label='Try Again' onClick={() => window.location.reload()} />
			</div>
		)
	}

	if (!data || data.consultants.length === 0) {
		return (
			<div className='text-center py-8'>
				<p className='text-gray-600 mb-4'>
					{searchTerm
						? 'No consultants found matching your search.'
						: 'No consultants available.'}
				</p>
				{searchTerm && (
					<Button label='Clear Search' onClick={() => setSearchTerm('')} />
				)}
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Search Form */}
			<form onSubmit={handleSearch} className='flex gap-2'>
				<input
					type='text'
					placeholder='Search consultants by name, department, or degree...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent'
				/>
				<Button
					label='Search'
					onClick={() => {}} // Form submission is handled by onSubmit
				/>
			</form>

			{/* Results Info */}
			<div className='flex justify-between items-center'>
				<p className='text-gray-600'>
					Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
					{Math.min(currentPage * itemsPerPage, data.totalCount)} of{' '}
					{data.totalCount} consultants
				</p>
			</div>

			{/* Consultant Grid */}
			<motion.div
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				{data.consultants.map(consultant => (
					<ConsultantCard
						key={consultant.id}
						consultant={consultant}
						onClick={onConsultantClick}
					/>
				))}
			</motion.div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className='flex justify-center items-center gap-2 mt-8'>
					<Button
						label='Previous'
						onClick={() => handlePageChange(currentPage - 1)}
						className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
					/>

					<div className='flex gap-1'>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
							<button
								key={page}
								onClick={() => handlePageChange(page)}
								className={`px-3 py-1 rounded ${
									currentPage === page
										? 'bg-accent text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								{page}
							</button>
						))}
					</div>

					<Button
						label='Next'
						onClick={() => handlePageChange(currentPage + 1)}
						className={
							currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
						}
					/>
				</div>
			)}
		</div>
	)
}
