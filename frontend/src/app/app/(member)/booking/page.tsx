'use client'

import BookingList from '@/Components/app/Booking/BookingList'
import { useGetOrder } from '@/Services/book-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

const Page = () => {
	const { data, isLoading, error, refetch } = useGetOrder()
	const searchParams = useSearchParams()

	// Check for payment callback parameters
	useEffect(() => {
		const resultCode = searchParams?.get('resultCode')
		const message = searchParams?.get('message')

		if (resultCode !== null) {
			// Clear URL parameters
			const url = new URL(window.location.href)
			url.searchParams.delete('resultCode')
			url.searchParams.delete('message')
			window.history.replaceState({}, '', url.toString())

			// Show appropriate message
			if (resultCode === '0') {
				toast.success(message || 'Thanh toán thành công!')
				// Refresh booking data
				refetch()
			} else {
				toast.error(message || 'Thanh toán thất bại')
			}
		}
	}, [searchParams, refetch])

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>Đang tải danh sách đặt dịch vụ...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Không thể tải danh sách
					</h3>
					<p className='text-gray-600 mb-4'>
						Đã xảy ra lỗi khi tải danh sách đặt dịch vụ. Vui lòng thử lại sau.
					</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
					>
						Thử lại
					</button>
				</div>
			</div>
		)
	}

	if (!data || data.length === 0) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-gray-400 text-6xl mb-4'>📋</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Chưa có đặt dịch vụ nào
					</h3>
					<p className='text-gray-600 mb-6'>
						Bạn chưa có đặt dịch vụ nào. Hãy khám phá các dịch vụ của chúng tôi
						và đặt lịch ngay!
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => (window.location.href = '/app/service')}
						className='bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors shadow-sm'
					>
						Khám phá dịch vụ
					</motion.button>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					Danh Sách Đặt Dịch Vụ
				</h1>
				<p className='text-gray-600'>
					Quản lý và theo dõi các dịch vụ bạn đã đặt
				</p>
			</motion.div>

			{/* Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-main'>{data.length}</div>
					<div className='text-sm text-gray-600'>Tổng số đặt dịch vụ</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-green-600'>
						{data.filter(item => item.status).length}
					</div>
					<div className='text-sm text-gray-600'>Đã thanh toán</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-yellow-600'>
						{data.filter(item => !item.status).length}
					</div>
					<div className='text-sm text-gray-600'>Chưa thanh toán</div>
				</div>
			</motion.div>

			{/* Booking List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<BookingList data={data} />
			</motion.div>
		</div>
	)
}

export default Page
