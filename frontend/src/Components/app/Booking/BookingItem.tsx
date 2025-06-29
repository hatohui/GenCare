import React, { useState } from 'react'
import { motion } from 'motion/react'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'
import clsx from 'clsx'
import { useDeleteOrderDetail, useMomoPay } from '@/Services/book-service'
import { useRouter } from 'next/navigation'
import { TrashCanSVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'
import ConfirmDialog from '@/Components/ConfirmationDialog'
import { toast } from 'react-hot-toast'

interface BookingItemProps {
	item: OrderDetail
	onViewTestResult: (item: OrderDetail) => void
}

const BookingItem = ({ item, onViewTestResult }: BookingItemProps) => {
	const momoPayment = useMomoPay(item.purchaseId)
	const deleteOrder = useDeleteOrderDetail(item.orderDetailId)
	const router = useRouter()
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const handlePayment = async () => {
		try {
			const result = await momoPayment.mutateAsync()
			if (result.payUrl) {
				toast.success('Chuyển hướng đến trang thanh toán...')
				// Open MoMo payment in new window/tab
				window.open(result.payUrl, '_blank')
			} else {
				toast.error('Không thể tạo liên kết thanh toán')
			}
		} catch (error) {
			console.error('Payment failed:', error)
			toast.error('Thanh toán thất bại. Vui lòng thử lại.')
		}
	}

	const handleDelete = async () => {
		try {
			await deleteOrder.mutateAsync()
			toast.success('Đã xóa đặt dịch vụ thành công')
		} catch (error) {
			console.error('Delete failed:', error)
			toast.error('Xóa thất bại. Vui lòng thử lại.')
		}
	}

	const formatDateTime = (date: Date | string) => {
		try {
			const dateObj = date instanceof Date ? date : new Date(date)
			if (isNaN(dateObj.getTime())) {
				return 'Ngày không hợp lệ'
			}
			return dateObj.toLocaleDateString('vi-VN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
		} catch (error) {
			console.error('Error formatting date:', error)
			return 'Ngày không hợp lệ'
		}
	}

	const formatDateOnly = (date: Date | string) => {
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

	const getStatusBadge = (status: boolean) => {
		return (
			<span
				className={clsx(
					'px-3 py-1 rounded-full text-xs font-medium',
					status
						? 'bg-green-100 text-green-800'
						: 'bg-yellow-100 text-yellow-800'
				)}
			>
				{status ? 'Đã thanh toán' : 'Chưa thanh toán'}
			</span>
		)
	}

	return (
		<motion.div
			className='bg-white border border-gray-200 p-6 rounded-[30px] mb-6 max-w-5xl mx-auto shadow-sm hover:shadow-md transition-all duration-300'
			whileHover={{ scale: 1.01 }}
		>
			<ConfirmDialog
				isOpen={showDeleteConfirm}
				title='Xóa đặt dịch vụ'
				message='Bạn có chắc chắn muốn xóa đặt dịch vụ này? Hành động này không thể hoàn tác.'
				onConfirm={() => {
					handleDelete()
					setShowDeleteConfirm(false)
				}}
				onCancel={() => setShowDeleteConfirm(false)}
			/>

			{/* Header */}
			<div className='flex justify-between items-start mb-4'>
				<div className='flex-1'>
					<h3 className='font-bold text-xl text-main mb-2'>
						{item.serviceName}
					</h3>
					<div className='flex items-center gap-4 text-sm text-gray-600'>
						<span>Đặt lúc: {formatDateTime(item.createdAt)}</span>
						{getStatusBadge(item.status)}
					</div>
				</div>
				<button
					onClick={() => setShowDeleteConfirm(true)}
					className='text-red-500 hover:bg-red-50 rounded-full p-2 transition-colors'
					title='Xóa đặt dịch vụ'
				>
					<TrashCanSVG className='size-5' />
				</button>
			</div>

			{/* Customer Information */}
			<div className='bg-gray-50 rounded-[20px] p-4 mb-4'>
				<h4 className='font-semibold text-gray-800 mb-3'>
					Thông tin khách hàng
				</h4>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
					<div className='flex items-center'>
						<span className='font-medium text-gray-700 w-24'>Họ tên:</span>
						<span className='ml-2'>{`${item.firstName} ${item.lastName}`}</span>
					</div>
					<div className='flex items-center'>
						<span className='font-medium text-gray-700 w-24'>
							Số điện thoại:
						</span>
						<span className='ml-2'>{item.phoneNumber}</span>
					</div>
					<div className='flex items-center'>
						<span className='font-medium text-gray-700 w-24'>Giới tính:</span>
						<span className='ml-2'>
							{item.gender === true
								? 'Nam'
								: item.gender === false
								? 'Nữ'
								: 'Không xác định'}
						</span>
					</div>
					<div className='flex items-center'>
						<span className='font-medium text-gray-700 w-24'>Ngày sinh:</span>
						<span className='ml-2'>{formatDateOnly(item.dateOfBirth)}</span>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className='flex justify-end gap-3'>
				{item.status ? (
					<button
						onClick={() => onViewTestResult(item)}
						className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-[30px] transition-colors shadow-sm'
					>
						Xem kết quả xét nghiệm
					</button>
				) : (
					<button
						onClick={handlePayment}
						disabled={momoPayment.isPending}
						className={clsx(
							'px-6 py-3 font-medium rounded-[30px] transition-all shadow-sm flex items-center gap-2',
							momoPayment.isPending
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-accent hover:bg-accent/90 text-white hover:shadow-md'
						)}
					>
						{momoPayment.isPending ? (
							<>
								<LoadingIcon className='size-4' />
								Đang xử lý...
							</>
						) : (
							'Thanh toán bằng MoMo'
						)}
					</button>
				)}
			</div>
		</motion.div>
	)
}

export default BookingItem
