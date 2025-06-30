'use client'
import Button from '@/Components/Button'
import Pagination from '@/Components/Management/Pagination'
import { usePagination } from '@/Hooks/List/usePagination'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useGetConsultants } from '@/Services/account-service'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion, AnimatePresence } from 'motion/react'
import { useConsultantContext } from '@/Components/Consultant/ConsultantContext'
import Image from 'next/image'

const PAGE_SIZE = 8

const ConsultantList = () => {
	const { page, setPage } = usePagination(undefined, PAGE_SIZE)
	const router = useRouter()
	const searchParams = useSearchParams()
	const searchTerm = searchParams?.get('search') ?? ''
	const { setConsultants } = useConsultantContext()

	const { data, isLoading, error } = useGetConsultants(
		PAGE_SIZE ?? 0,
		page,
		searchTerm || null
	)
	const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1

	const handleConsultantClick = (consultant: Consultant) => {
		router.push(`/app/consultants/${consultant.id}`)
	}

	React.useEffect(() => {
		if (data?.consultants) setConsultants(data.consultants)
	}, [data, setConsultants])

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
			</div>
		)
	}

	return (
		<>
			{/* Results Info */}
			{data && (
				<div className='px-6 pb-4'>
					<p className='text-sm text-gray-600'>
						Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
						{Math.min(page * PAGE_SIZE, data.totalCount)} of {data.totalCount}{' '}
						consultants
					</p>
				</div>
			)}

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6'>
				<AnimatePresence mode='wait'>
					{data.consultants.map((consultant, idx) => {
						const fullName =
							`${consultant.firstName ?? ''} ${
								consultant.lastName ?? ''
							}`.trim() ?? 'N/A'
						const initials =
							fullName !== 'N/A'
								? fullName
										.split(' ')
										.map(n => n[0])
										.join('')
										.toUpperCase()
								: 'N/A'

						return (
							<motion.div
								key={consultant.id}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -30 }}
								transition={{
									duration: 0.4,
									type: 'spring',
									stiffness: 120,
									delay: idx * 0.08,
								}}
								whileHover={{
									scale: 1.04,
									boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
								}}
								className='bg-white border border-blue-100 rounded-2xl shadow-sm flex flex-col items-center justify-between p-4 text-center h-full min-h-[300px] min-w-[320px] mx-auto cursor-pointer'
								onClick={() => handleConsultantClick(consultant)}
							>
								<div className='flex flex-col items-center'>
									{consultant.avatarUrl ? (
										<Image
											src={consultant.avatarUrl}
											alt={fullName}
											width={80}
											height={80}
											className='w-20 min-h-20 rounded-full object-cover border-4 border-blue-200 mb-2'
										/>
									) : (
										<div className='min-h-[120px] min-w-[120px] rounded-full bg-blue-200 border-4 border-blue-200 mb-2 flex items-center justify-center text-blue-600 font-semibold text-base'>
											{initials}
										</div>
									)}
									<h2 className='text-base font-semibold text-blue-900'>
										{fullName}
									</h2>
									<span className='text-xs text-white bg-gradient-to-l from-main to-secondary px-2 py-0.5 rounded-full mt-1'>
										{consultant.department}
									</span>
									<p className='text-xs text-gray-600 mt-2 h-12 max-h-12 truncate text-wrap'>
										{consultant.biography ??
											`${consultant.degree} with ${consultant.yearOfExperience} years of experience`}
									</p>
								</div>
								<div className='flex items-center justify-between mt-1 w-full'>
									<span className='text-xs text-yellow-500 font-medium'>
										⭐ {consultant.yearOfExperience}+ years
									</span>
									<Button
										label='Book Consultant'
										labelMobile='Book'
										onClick={() => handleConsultantClick(consultant)}
										className='text-xs px-2 py-1'
									/>
								</div>
							</motion.div>
						)
					})}
				</AnimatePresence>
				{page === totalPages && (
					<div className='bg-white border border-blue-100 rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 text-center h-full min-h-[320px]'>
						<div className='w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-3xl font-bold mb-4'>
							+
						</div>
						<h2 className='text-lg font-semibold text-blue-500'>
							New Consultant Coming Soon
						</h2>
						<p className='text-sm text-gray-500 mt-2'>
							We&apos;re expanding our team of healthcare professionals. Stay
							tuned for our new consultant!
						</p>
					</div>
				)}
			</div>
			<div className='center-all w-full'>
				<Pagination
					currentPage={page}
					isFetching={isLoading}
					setCurrentPage={setPage}
					totalCount={data.totalCount}
					itemsPerPage={PAGE_SIZE}
				/>
			</div>
		</>
	)
}

export default ConsultantList
