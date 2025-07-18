'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { CheckCircleSVG, XCircleSVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'

const PaymentCallback = () => {
	const { t } = useLocale()
	const router = useRouter()
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
		'loading'
	)
	const [message, setMessage] = useState('')
	const [orderId, setOrderId] = useState<string | null>(null)

	useEffect(() => {
		// Get payment status from URL parameters
		const resultCode = searchParams?.get('resultCode')
		const message = searchParams?.get('message') || ''
		const orderIdParam = searchParams?.get('orderId') || null
		setOrderId(orderIdParam)

		// Simulate processing time
		const timer = setTimeout(() => {
			if (resultCode === '0') {
				setStatus('success')
				setMessage(t('payment.callback.success'))
				toast.success(t('payment.callback.success'))
			} else {
				setStatus('failed')
				setMessage(message || t('payment.callback.failed'))
				toast.error(message || t('payment.callback.failed'))
			}
		}, 2000)

		return () => clearTimeout(timer)
	}, [searchParams, t])

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
							{t('payment.callback.processing')}
						</h2>
						<p className='text-gray-600'>
							{t('payment.callback.processingDescription')}
						</p>
						{orderId && (
							<p className='text-xs text-gray-400'>
								{t('payment.callback.orderId')}: {orderId}
							</p>
						)}
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
							{t('payment.callback.success')}
						</h2>
						<p className='text-gray-600'>{message}</p>
						{orderId && (
							<p className='text-sm text-gray-500'>
								{t('payment.callback.orderId')}:{' '}
								<span className='font-mono'>{orderId}</span>
							</p>
						)}
						<div className='bg-green-50 border border-green-200 rounded-[15px] p-4'>
							<p className='text-sm text-green-700'>
								{t('payment.callback.successDescription')}
							</p>
						</div>
						<div className='space-y-3'>
							<button
								onClick={handleBackToBooking}
								className='w-full bg-main hover:bg-main/90 text-white py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								{t('payment.callback.viewBooking')}
							</button>
							<button
								onClick={handleBackToServices}
								className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								{t('payment.callback.bookMore')}
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
							{t('payment.callback.failed')}
						</h2>
						<p className='text-gray-600'>{message}</p>
						{orderId && (
							<p className='text-sm text-gray-500'>
								{t('payment.callback.orderId')}:{' '}
								<span className='font-mono'>{orderId}</span>
							</p>
						)}
						<div className='bg-red-50 border border-red-200 rounded-[15px] p-4'>
							<p className='text-sm text-red-700'>
								{t('payment.callback.failedDescription')}
							</p>
						</div>
						<div className='space-y-3'>
							<button
								onClick={handleBackToBooking}
								className='w-full bg-main hover:bg-main/90 text-white py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								{t('payment.callback.tryAgain')}
							</button>
							<button
								onClick={handleBackToServices}
								className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-[20px] font-medium transition-colors'
							>
								{t('payment.callback.backToServices')}
							</button>
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}

export default PaymentCallback
