'use client'

import React, { useState } from 'react'
import { useGetAllOrderDetail, useGetResult } from '@/Services/Result-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'

const Page = () => {
	const { data, isLoading, isError, refetch } = useGetAllOrderDetail()
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState(false)

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
							<thead>
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
											className='border-b hover:bg-gray-50'
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
												<span
													className={
														order.status ? 'text-green-600' : 'text-yellow-600'
													}
												>
													{order.status ? 'Hoàn thành' : 'Chờ xử lý'}
												</span>
											</td>
											<td className='py-2 px-3'>
												<button
													className='bg-main hover:bg-accent text-white px-4 py-2 rounded-lg transition-colors font-medium'
													onClick={() => handleOpenModal(order.orderDetailId)}
												>
													Xem kết quả
												</button>
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
								{/* Display result fields here, add edit functionality as needed */}
								<pre className='bg-gray-100 rounded p-2 text-xs overflow-x-auto'>
									{JSON.stringify(resultData, null, 2)}
								</pre>
								{/* TODO: Add edit and action buttons here, using your color palette */}
							</div>
						) : null}
					</div>
				</div>
			)}
		</div>
	)
}

export default Page
