'use client'

import StatusBadge from '@/Components/Lab/StatusBadge'
import LoadingIcon from '@/Components/LoadingIcon'
import Pagination from '@/Components/Management/Pagination'
import SearchBar from '@/Components/Management/SearchBar'
import { EyeSVG, PencilSVG } from '@/Components/SVGs'
import TestResultEditModal from '@/Components/staff/TestResultEditModal'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { useLocale } from '@/Hooks/useLocale'
import { ResultData } from '@/Interfaces/Tests/Types/Tests'
import { useGetAllOrderDetail, useGetResult } from '@/Services/Result-service'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
	const { t } = useLocale()
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT

	// Get search from URL params
	const search = searchParams?.get('search') || ''

	// Reset to first page when search changes
	useEffect(() => {
		setPage(1)
	}, [search])

	const { data, isLoading, isError, isFetching } = useGetAllOrderDetail(
		page,
		itemsPerPage,
		search || undefined
	)

	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [editOrderId, setEditOrderId] = useState<string | null>(null)

	// Fetch result only when modal is open and order is selected
	const {
		data: resultData,
		isLoading: isResultLoading,
		isError: isResultError,
	} = useGetResult(selectedOrderId || '', {
		enabled: !!selectedOrderId, // Only run query when selectedOrderId is not null
	})

	const handleOpenModal = (orderId: string) => {
		setSelectedOrderId(orderId)
		setModalOpen(true)
	}
	const handleCloseModal = () => {
		setModalOpen(false)
		setSelectedOrderId(null)
	}

	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					{t('staff.tests.title')}
				</h1>
				<p className='text-gray-600'>{t('staff.tests.subtitle')}</p>
			</motion.div>

			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='mb-6'
			>
				<div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
					<SearchBar className='flex-1 max-w-md' waitTime={500} />
					<div className='text-sm text-gray-600'>
						{data && (
							<span>
								{t('staff.tests.showing', {
									from: (page - 1) * itemsPerPage + 1,
									to: Math.min(page * itemsPerPage, data.totalCount || 0),
									total: data.totalCount || 0,
								})}
							</span>
						)}
					</div>
				</div>
			</motion.div>

			{/* Orders Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm'
			>
				{isLoading ? (
					<div className='flex justify-center items-center min-h-[200px]'>
						<LoadingIcon className='size-8' />
					</div>
				) : isError ? (
					<div className='text-center text-red-500'>
						{t('staff.tests.load_error')}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full text-sm'>
							<thead className='sticky top-0 bg-white z-10 shadow-sm'>
								<tr className='text-left border-b'>
									<th className='py-2 px-3'>{t('staff.tests.order_id')}</th>
									<th className='py-2 px-3'>
										{t('staff.tests.customer_name')}
									</th>
									<th className='py-2 px-3'>{t('staff.tests.service')}</th>
									<th className='py-2 px-3'>{t('staff.tests.created_at')}</th>
									<th className='py-2 px-3'>{t('staff.tests.status')}</th>
									<th className='py-2 px-3'>{t('staff.tests.actions')}</th>
								</tr>
							</thead>
							<tbody>
								{data && data.result.length > 0 ? (
									data.result.map((order: any) => (
										<tr
											key={order.orderDetailId}
											className='border-b hover:bg-blue-50 transition cursor-pointer'
											onClick={e => {
												// Only trigger if not clicking a button
												if (!(e.target as HTMLElement).closest('button')) {
													handleOpenModal(order.orderDetailId)
												}
											}}
										>
											<td className='py-2 px-3 font-mono'>
												{order.orderDetailId}
											</td>
											<td className='py-2 px-3'>
												{order.firstName} {order.lastName}
											</td>
											<td className='py-2 px-3'>{order.serviceName}</td>
											<td className='py-2 px-3'>
												{new Date(order.createdAt).toLocaleDateString('vi-VN')}
											</td>
											<td className='py-2 px-3'>
												<StatusBadge
													status={
														order.status === true ? 'completed' : 'pending'
													}
												/>
											</td>
											<td className='py-2 px-3'>
												<div className='flex gap-2'>
													<button
														className='flex items-center gap-1 bg-main hover:bg-accent text-white px-3 py-2 rounded-lg transition-colors font-medium shadow-sm'
														onClick={e => {
															e.stopPropagation()
															handleOpenModal(order.orderDetailId)
														}}
														title={t('staff.tests.view_result')}
													>
														<EyeSVG className='size-5' />
														<span className='hidden sm:inline'>
															{t('staff.tests.view')}
														</span>
													</button>
													<button
														className='flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors font-medium shadow-sm'
														onClick={e => {
															e.stopPropagation()
															setEditOrderId(order.orderDetailId)
														}}
														title={t('staff.tests.edit_result')}
													>
														<PencilSVG className='size-5' />
														<span className='hidden sm:inline'>
															{t('staff.tests.edit')}
														</span>
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className='text-center py-6 text-gray-400'>
											{t('common.no_data')}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</motion.div>

			{/* Pagination */}
			{data && data.totalCount > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='flex justify-center mt-8'
				>
					<Pagination
						currentPage={page}
						isFetching={isFetching}
						setCurrentPage={setPage}
						totalCount={data.totalCount}
						itemsPerPage={itemsPerPage}
					/>
				</motion.div>
			)}

			{/* Modal for Result */}
			{modalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
					onClick={handleCloseModal}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className='bg-white rounded-2xl shadow-2xl min-w-[400px] max-w-[90vw] max-h-[85vh] overflow-hidden relative'
						onClick={e => e.stopPropagation()}
					>
						{/* Header */}
						<div className='bg-gradient-to-r from-main to-secondary px-6 py-4 text-white relative'>
							<h2 className='text-xl font-bold flex items-center gap-2'>
								<EyeSVG className='size-5' />
								{t('staff.tests.result_title')}
							</h2>
							<button
								className='absolute top-3 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20'
								onClick={handleCloseModal}
							>
								<svg
									className='size-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>

						{/* Content */}
						<div className='p-6 overflow-y-auto max-h-[calc(85vh-120px)]'>
							{isResultLoading ? (
								<div className='flex flex-col justify-center items-center min-h-[200px] gap-4'>
									<LoadingIcon className='size-8 text-main' />
									<p className='text-gray-600 font-medium'>
										{t('staff.tests.loading_result')}
									</p>
								</div>
							) : isResultError ? (
								<div className='flex flex-col justify-center items-center min-h-[200px] gap-4'>
									<div className='size-16 bg-red-100 rounded-full flex items-center justify-center'>
										<svg
											className='size-8 text-red-500'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
											/>
										</svg>
									</div>
									<div className='text-center'>
										<h3 className='text-lg font-semibold text-red-600 mb-2'>
											{t('staff.tests.data_error_title')}
										</h3>
										<p className='text-gray-600'>
											{t('staff.tests.data_error_message')}
										</p>
									</div>
								</div>
							) : resultData ? (
								<div>
									{resultData.resultData ? (
										<div className='space-y-6'>
											{/* Summary Card */}
											<div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100'>
												<div className='flex items-center gap-3 mb-3'>
													<div className='size-10 bg-blue-500 rounded-full flex items-center justify-center'>
														<svg
															className='size-5 text-white'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
															/>
														</svg>
													</div>
													<div>
														<h3 className='font-semibold text-gray-800'>
															{t('staff.tests.total_summary_title')}
														</h3>
														<p className='text-sm text-gray-600'>
															{
																Object.keys(resultData.resultData as ResultData)
																	.length
															}{' '}
															{t('staff.tests.test_parameters')}
														</p>
													</div>
												</div>
											</div>

											{/* Results Grid */}
											<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
												{Object.entries(
													resultData.resultData as ResultData
												).map(([parameter, result], index) => (
													<div
														key={index}
														className='bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group'
													>
														<div className='flex items-start justify-between mb-3'>
															<h4 className='font-semibold text-gray-800 text-sm group-hover:text-main transition-colors'>
																{parameter}
															</h4>
															<div
																className={`px-2 py-1 rounded-full text-xs font-medium ${
																	result.flag === 'normal'
																		? 'bg-green-100 text-green-700'
																		: result.flag === 'high'
																		? 'bg-orange-100 text-orange-700'
																		: 'bg-red-100 text-red-700'
																}`}
															>
																{result.flag === 'normal'
																	? t('staff.tests.normal_flag')
																	: result.flag === 'high'
																	? t('staff.tests.high_flag')
																	: t('staff.tests.low_flag')}
															</div>
														</div>

														<div className='space-y-2 text-sm'>
															<div className='flex justify-between items-center'>
																<span className='text-gray-600'>
																	{t('staff.tests.value')}:
																</span>
																<span className='font-semibold text-gray-800'>
																	{result.value} {result.unit}
																</span>
															</div>
															<div className='flex justify-between items-center'>
																<span className='text-gray-600'>
																	{t('staff.tests.reference_range')}:
																</span>
																<span className='text-gray-700 font-mono text-xs'>
																	{result.referenceRange}
																</span>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									) : (
										<div className='flex flex-col justify-center items-center min-h-[200px] gap-4'>
											<div className='size-16 bg-gray-100 rounded-full flex items-center justify-center'>
												<svg
													className='size-8 text-gray-400'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
													/>
												</svg>
											</div>
											<div className='text-center'>
												<h3 className='text-lg font-semibold text-gray-600 mb-2'>
													{t('staff.tests.no_data_title')}
												</h3>
												<p className='text-gray-500'>
													{t('staff.tests.no_data_message')}
												</p>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className='flex flex-col justify-center items-center min-h-[200px] gap-4'>
									<div className='size-16 bg-gray-100 rounded-full flex items-center justify-center'>
										<svg
											className='size-8 text-gray-400'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
											/>
										</svg>
									</div>
									<div className='text-center'>
										<h3 className='text-lg font-semibold text-gray-600 mb-2'>
											{t('staff.tests.no_data_title')}
										</h3>
										<p className='text-gray-500'>
											{t('staff.tests.no_data_message')}
										</p>
									</div>
								</div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}

			{/* Edit Result Modal */}
			{editOrderId && (
				<TestResultEditModal
					isOpen={!!editOrderId}
					onClose={() => setEditOrderId(null)}
					orderDetailId={editOrderId}
					useMock={false}
				/>
			)}
		</div>
	)
}

export default Page
