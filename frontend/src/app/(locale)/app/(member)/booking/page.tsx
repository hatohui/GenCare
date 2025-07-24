'use client'

import BookingList from '@/Components/app/Booking/BookingList'
import { useGetOrder } from '@/Services/book-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'

const Page = () => {
	const { t } = useLocale()
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
				toast.success(message || t('member.booking.payment_success'))
				// Refresh booking data
				refetch()
			} else {
				toast.error(message || t('member.booking.payment_failed'))
			}
		}
	}, [searchParams, refetch, t])

	// Show loading while booking data is being fetched
	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>{t('member.booking.loading')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto p-6'>
			{/* Show error if present */}
			{error && (
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						{t('member.booking.load_error')}
					</h3>
					<p className='text-gray-600 mb-4'>
						{t('member.booking.load_error_description')}
					</p>
				</div>
			)}

			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					{t('member.booking.title')}
				</h1>
				<p className='text-gray-600'>{t('member.booking.subtitle')}</p>
			</motion.div>

			{/* Stats */}
			{data && data.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'
				>
					<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
						<div className='text-2xl font-bold text-main'>{data.length}</div>
						<div className='text-sm text-gray-600'>
							{t('booking.total_bookings')}
						</div>
					</div>
					<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
						<div className='text-2xl font-bold text-green-600'>
							{data.filter(item => item.status).length}
						</div>
						<div className='text-sm text-gray-600'>
							{t('booking.paid_bookings')}
						</div>
					</div>
					<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
						<div className='text-2xl font-bold text-yellow-600'>
							{data.filter(item => !item.status).length}
						</div>
						<div className='text-sm text-gray-600'>
							{t('booking.unpaid_bookings')}
						</div>
					</div>
				</motion.div>
			)}

			{/* Booking List */}
			{data && data.length > 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<BookingList data={data} />
				</motion.div>
			) : (
				!error && (
					<div className='flex justify-center items-center min-h-[400px]'>
						<div className='text-center max-w-md mx-auto p-6'>
							<div className='text-gray-400 text-6xl mb-4'>📋</div>
							<h3 className='text-xl font-semibold text-gray-800 mb-2'>
								{t('member.booking.no_bookings')}
							</h3>
							<p className='text-gray-600 mb-6'>
								{t('member.booking.no_bookings_description')}
							</p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => (window.location.href = '/app/service')}
								className='bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors shadow-sm'
							>
								{t('member.booking.explore_services')}
							</motion.button>
						</div>
					</div>
				)
			)}
		</div>
	)
}

export default Page
