'use client'

import React, { useState } from 'react'
import { useGetAllOrderDetail, useGetResult } from '@/Services/Result-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { ResultData } from '@/Interfaces/Tests/Types/Tests'
import TestResultEditModal from '@/Components/staff/TestResultEditModal'
import StatusBadge from '@/Components/Lab/StatusBadge'
import { EyeSVG, PencilSVG } from '@/Components/SVGs'

const Page = () => {
	const { data, isLoading, isError, refetch } = useGetAllOrderDetail()
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [editOrderId, setEditOrderId] = useState<string | null>(null)

	// Fetch result only when modal is open and order is selected
	const {
		data: resultData,
		isLoading: isResultLoading,
		isError: isResultError,
		refetch: refetchResult,
	} = useGetResult(selectedOrderId || '')

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
					Quản Lý Kết Quả Xét Nghiệm
				</h1>
				<p className='text-gray-600'>
					Xem và quản lý kết quả xét nghiệm của khách hàng
				</p>
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
						Không thể tải danh sách đơn hàng.
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full text-sm'>
							<thead className='sticky top-0 bg-white z-10 shadow-sm'>
								<tr className='text-left border-b'>
									<th className='py-2 px-3'>Mã đơn</th>
									<th className='py-2 px-3'>Tên khách hàng</th>
									<th className='py-2 px-3'>Dịch vụ</th>
									<th className='py-2 px-3'>Ngày tạo</th>
									<th className='py-2 px-3'>Trạng thái</th>
									<th className='py-2 px-3'>Hành động</th>
								</tr>
							</thead>
							<tbody>
								{data && data.length > 0 ? (
									data.map((order: any) => (
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
													status={order.status ? 'completed' : 'pending'}
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
														title='Xem kết quả'
													>
														<EyeSVG className='size-5' />
														<span className='hidden sm:inline'>Xem</span>
													</button>
													<button
														className='flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors font-medium shadow-sm'
														onClick={e => {
															e.stopPropagation()
															setEditOrderId(order.orderDetailId)
														}}
														title='Chỉnh sửa kết quả'
													>
														<PencilSVG className='size-5' />
														<span className='hidden sm:inline'>Sửa</span>
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className='text-center py-6 text-gray-400'>
											Không có dữ liệu
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</motion.div>

			{/* Modal for Result */}
			{modalOpen && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
					onClick={handleCloseModal}
				>
					<div
						className='bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[90vw] relative'
						onClick={e => e.stopPropagation()}
					>
						<button
							className='absolute top-2 right-2 text-gray-400 hover:text-main'
							onClick={handleCloseModal}
						>
							&times;
						</button>
						{isResultLoading ? (
							<div className='flex justify-center items-center min-h-[120px]'>
								<LoadingIcon className='size-6' />
							</div>
						) : isResultError ? (
							<div className='text-center text-red-500'>
								Không thể tải kết quả.
							</div>
						) : resultData ? (
							<div>
								<h2 className='text-lg font-semibold text-main mb-2'>
									Kết quả xét nghiệm
								</h2>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
									{Object.entries(resultData.resultData as ResultData).map(
										([parameter, result], index) => (
											<div
												key={index}
												className='bg-gray-100 rounded p-2 text-xs overflow-x-auto'
											>
												<div className='font-bold'>{parameter}</div>
												<div>
													Giá trị: {result.value} {result.unit}
												</div>
												<div>Khoảng tham chiếu: {result.referenceRange}</div>
												<div>
													Trạng thái:{' '}
													{result.flag === 'normal'
														? 'Bình thường'
														: result.flag === 'high'
														? 'Cao'
														: 'Thấp'}
												</div>
											</div>
										)
									)}
								</div>
							</div>
						) : (
							<div className='text-center text-gray-400'>
								Không có dữ liệu kết quả.
							</div>
						)}
					</div>
				</div>
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
