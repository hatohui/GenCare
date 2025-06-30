'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { CheckCircleSVG, XCircleSVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'
import { toast } from 'react-hot-toast'

const PaymentCallback = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
		'loading'
	)
	const [message, setMessage] = useState('')

	useEffect(() => {
		// Get payment status from URL parameters
		const resultCode = searchParams?.get('resultCode')
		const message = searchParams?.get('message') || ''
		// const orderId = searchParams.get('orderId') || ''

		// Simulate processing time
		const timer = setTimeout(() => {
			if (resultCode === '0') {
				setStatus('success')
				setMessage('Thanh toán thành công!')
				toast.success('Thanh toán thành công!')
			} else {
				setStatus('failed')
				setMessage(message || 'Thanh toán thất bại')
				toast.error(message || 'Thanh toán thất bại')
			}
		}, 2000)

		return () => clearTimeout(timer)
	}, [searchParams])

	const handleBackToBooking = () => {
		router.push('/app/booking')
	}

	const handleBackToServices = () => {
		router.push('/app/service')
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className='bg-white rounded-[30px] shadow-xl p-8 max-w-md w-full text-center'
			>
				{status === 'loading' && (
					<div className='space-y-6'>
						<LoadingIcon className='mx-auto size-16 text-main' />
						<h2 className='text-2xl font-bold text-gray-800'>
							Đang xử lý thanh toán...
						</h2>
						<p className='text-gray-600'>
							Vui lòng chờ trong giây lát, chúng tôi đang xác nhận giao dịch của
							bạn.
						</p>
					</div>
				)}

				{status === 'success' && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='space-y-6'
					>
						<div className='flex justify-center'>
							<CheckCircleSVG className='size-20 text-green-500' />
						</div>
						<h2 className='text-2xl font-bold text-gray-800'>
							Thanh toán thành công!
						</h2>
						<p className='text-gray-600'>{message}</p>
						<div className='bg-green-50 border border-green-200 rounded-[15px] p-4'>
							<p className='text-sm text-green-700'>
								Chúng tôi sẽ gửi email xác nhận và thông tin chi tiết về dịch vụ
								của bạn.
							</p>
						</div>
						<div className='space-y-3'>
							<button
								onClick={handleBackToBooking}
								className='w-full bg-main hover:bg-main/90 text-white py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								Xem đặt dịch vụ
							</button>
							<button
								onClick={handleBackToServices}
								className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								Đặt thêm dịch vụ
							</button>
						</div>
					</motion.div>
				)}

				{status === 'failed' && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='space-y-6'
					>
						<div className='flex justify-center'>
							<XCircleSVG className='size-20 text-red-500' />
						</div>
						<h2 className='text-2xl font-bold text-gray-800'>
							Thanh toán thất bại
						</h2>
						<p className='text-gray-600'>{message}</p>
						<div className='bg-red-50 border border-red-200 rounded-[15px] p-4'>
							<p className='text-sm text-red-700'>
								Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
							</p>
						</div>
						<div className='space-y-3'>
							<button
								onClick={handleBackToBooking}
								className='w-full bg-main hover:bg-main/90 text-white py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								Thử lại thanh toán
							</button>
							<button
								onClick={handleBackToServices}
								className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								Quay lại dịch vụ
							</button>
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}

export default PaymentCallback
