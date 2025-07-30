'use client'

import BookingList from '@/Components/app/Booking/BookingList'
import { useGetOrder } from '@/Services/book-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'

// VNPay error code mapping
const getVNPayErrorMessage = (responseCode: string): string => {
	const errorCodes: { [key: string]: string } = {
		'00': 'Transaction successful',
		'07': 'Transaction deducted successfully. Transaction is suspected of fraud (related to the amount of money deducted)',
		'09': 'Card/Account of customer is not registered for internet banking service at bank',
		'10': 'Customer authenticated card/account information incorrectly more than 3 times',
		'11': 'Payment deadline has expired. Please try again',
		'12': 'Card/Account of customer is locked',
		'13': 'You entered the wrong transaction authentication password (OTP). Please try again',
		'24': 'Customer canceled the transaction',
		'51': 'Your account does not have enough balance to make the transaction',
		'65': 'Your account has exceeded the daily transaction limit',
		'75': 'Payment bank is under maintenance',
		'79': 'You entered the wrong payment password more than allowed. Please try again',
		'99': 'Other error (please contact the bank)',
	}

	return errorCodes[responseCode] || `Unknown error (Code: ${responseCode})`
}

const Page = () => {
	const { t } = useLocale()
	const { data, isLoading, error, refetch } = useGetOrder()
	const searchParams = useSearchParams()

	// Check for payment callback parameters from different payment gateways
	useEffect(() => {
		// MoMo payment callback parameters
		const resultCode = searchParams?.get('resultCode')
		const message = searchParams?.get('message')

		// VNPay payment callback parameters
		const vnpResponseCode = searchParams?.get('vnp_ResponseCode')
		const vnpTransactionStatus = searchParams?.get('vnp_TransactionStatus')
		const vnpOrderInfo = searchParams?.get('vnp_OrderInfo')

		// Handle MoMo payment callback
		if (resultCode !== null) {
			// Clear MoMo URL parameters
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
		// Handle VNPay payment callback
		else if (vnpResponseCode !== null) {
			console.log('VNPay callback detected:', {
				vnpResponseCode,
				vnpTransactionStatus,
				vnpOrderInfo,
				allParams: Object.fromEntries(searchParams?.entries() || []),
			})

			// Clear VNPay URL parameters
			const url = new URL(window.location.href)
			const vnpParams = [
				'vnp_Amount',
				'vnp_BankCode',
				'vnp_CardType',
				'vnp_OrderInfo',
				'vnp_PayDate',
				'vnp_ResponseCode',
				'vnp_TmnCode',
				'vnp_TransactionNo',
				'vnp_TransactionStatus',
				'vnp_TxnRef',
				'vnp_SecureHash',
			]
			vnpParams.forEach(param => url.searchParams.delete(param))
			window.history.replaceState({}, '', url.toString())

			// Show appropriate message based on VNPay response codes
			// vnp_ResponseCode: 00 = success, others = failure
			// vnp_TransactionStatus: 00 = success, others = failure
			if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
				console.log('VNPay payment successful')
				toast.success(t('member.booking.payment_success'))
				// Refresh booking data
				refetch()
			} else {
				console.log('VNPay payment failed:', {
					vnpResponseCode,
					vnpTransactionStatus,
				})
				// Parse order info for better error context
				const errorMessage = getVNPayErrorMessage(vnpResponseCode || '99')
				toast.error(`${t('member.booking.payment_failed')}: ${errorMessage}`)
			}
		}
	}, [searchParams, refetch, t])

	// Show error as toast notification
	useEffect(() => {
		if (error) {
			toast.error(t('member.booking.load_error'))
		}
	}, [error, t])

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
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-main'>
						{data?.length || 0}
					</div>
					<div className='text-sm text-gray-600'>
						{t('booking.total_bookings')}
					</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-green-600'>
						{data?.filter(item => item.status).length || 0}
					</div>
					<div className='text-sm text-gray-600'>
						{t('booking.paid_bookings')}
					</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-yellow-600'>
						{data?.filter(item => !item.status).length || 0}
					</div>
					<div className='text-sm text-gray-600'>
						{t('booking.unpaid_bookings')}
					</div>
				</div>
			</motion.div>

			{/* Book Now CTA when no bookings */}
			{(!data || data.length === 0) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-center mb-8'
				>
					<div className='bg-gradient-to-r from-main/10 to-secondary/10 rounded-[30px] p-8'>
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
							className='bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-[30px] font-medium transition-colors shadow-sm text-lg'
						>
							{t('member.booking.explore_services')}
						</motion.button>
					</div>
				</motion.div>
			)}

			{/* Booking List */}
			{data && data.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<BookingList data={data} />
				</motion.div>
			)}
		</div>
	)
}

export default Page
