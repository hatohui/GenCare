'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'
import { EyeSVG, DownloadSVG } from '@/Components/SVGs'
import TestResultModal from './TestResultModal'
import { useMomoPay } from '@/Services/book-service'
import { toast } from 'react-hot-toast'
import LoadingIcon from '@/Components/LoadingIcon'

interface BookingItemProps {
	booking: OrderDetail
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	// Debug: Log the booking data to check purchaseId
	console.log('BookingItem - booking data:', booking)
	console.log('BookingItem - purchaseId:', booking.purchaseId)

	const momoPayMutation = useMomoPay(booking.purchaseId)

	const formatDate = (date: Date | string) => {
		try {
			const dateObj = date instanceof Date ? date : new Date(date)
			if (isNaN(dateObj.getTime())) {
				return 'Ngày không hợp lệ'
			}
			return dateObj.toLocaleDateString('vi-VN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		} catch (error) {
			console.error('Error formatting date:', error)
			return 'Ngày không hợp lệ'
		}
	}

	const handleViewResults = () => {
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleMomoPayment = async () => {
		// Check if purchaseId exists
		if (!booking.purchaseId) {
			toast.error('Không tìm thấy thông tin đặt dịch vụ')
			return
		}

		try {
			console.log(
				'Attempting MoMo payment with purchaseId:',
				booking.purchaseId
			)

			const result = await momoPayMutation.mutateAsync()

			// Redirect to MoMo payment URL
			if (result.payUrl) {
				window.location.href = result.payUrl
			} else {
				toast.error('Không thể tạo liên kết thanh toán')
			}
		} catch (error) {
			console.error('MoMo payment failed:', error)
			toast.error('Thanh toán MoMo thất bại. Vui lòng thử lại.')
		}
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all duration-300'
			>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
					<div className='flex-1'>
						<h3 className='text-lg font-semibold text-main mb-2'>
							{booking.serviceName}
						</h3>
						<div className='text-sm text-gray-600 space-y-1'>
							<p>
								Khách hàng: {booking.firstName} {booking.lastName}
							</p>
							<p>Ngày đặt: {formatDate(booking.createdAt)}</p>
							<p>
								Trạng thái:
								<span
									className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
										booking.status
											? 'bg-green-100 text-green-600'
											: 'bg-yellow-100 text-yellow-600'
									}`}
								>
									{booking.status ? 'Đã thanh toán' : 'Chưa thanh toán'}
								</span>
							</p>
						</div>
					</div>

					<div className='flex gap-2'>
						{booking.status ? (
							// Show test results and download buttons for paid services
							<>
								<button
									onClick={handleViewResults}
									className='flex items-center gap-2 px-4 py-2 text-main border border-main rounded-[20px] hover:bg-main hover:text-white transition-colors'
								>
									<EyeSVG className='size-4' />
									Xem kết quả
								</button>
								<button
									onClick={() =>
										console.log('Download results for:', booking.serviceName)
									}
									className='flex items-center gap-2 px-4 py-2 bg-main text-white rounded-[20px] hover:bg-main/90 transition-colors'
								>
									<DownloadSVG className='size-4' />
									Tải xuống
								</button>
							</>
						) : (
							// Show payment button for unpaid services
							<button
								onClick={handleMomoPayment}
								disabled={momoPayMutation.isPending}
								className={`flex items-center gap-2 px-4 py-2 rounded-[20px] transition-colors ${
									momoPayMutation.isPending
										? 'bg-gray-400 cursor-not-allowed'
										: 'bg-pink-500 hover:bg-pink-600 text-white'
								}`}
							>
								{momoPayMutation.isPending ? (
									<LoadingIcon className='size-4' />
								) : (
									<div className='w-4 h-4 bg-white rounded-full flex items-center justify-center'>
										<span className='text-pink-500 font-bold text-xs'>M</span>
									</div>
								)}
								{momoPayMutation.isPending
									? 'Đang xử lý...'
									: 'Thanh toán MoMo'}
							</button>
						)}
					</div>
				</div>
			</motion.div>

			{/* Only show TestResultModal for paid services */}
			{booking.status && (
				<TestResultModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					bookingItem={booking}
				/>
			)}
		</>
	)
}

export default BookingItem
