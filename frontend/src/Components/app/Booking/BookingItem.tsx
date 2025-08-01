'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'
import { EyeSVG, DownloadSVG } from '@/Components/SVGs'
import TestResultModal from './TestResultModal'
import {
	useMomoPay,
	useVnpayPay,
	useDeleteOrderDetail,
	useCreateBookingPDF,
} from '@/Services/book-service'
import { toast } from 'react-hot-toast'
import LoadingIcon from '@/Components/LoadingIcon'
import ConfirmDialog from '@/Components/ConfirmationDialog'
import { parseISO, isValid, format as formatDateFns } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useLocale } from '@/Hooks/useLocale'
import { useGetResult } from '@/Services/Result-service'

interface BookingItemProps {
	booking: OrderDetail
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const { t } = useLocale()

	// Debug: Log the booking data to check purchaseId

	const momoPayMutation = useMomoPay()
	const vnpayPayMutation = useVnpayPay()
	const deleteMutation = useDeleteOrderDetail(booking.orderDetailId)

	// PDF export functionality
	const createBookingPDF = useCreateBookingPDF()
	const [isExporting, setIsExporting] = useState(false)
	const { refetch: refetchResult } = useGetResult(booking.orderDetailId, {
		enabled: false,
	})

	const formatDate = (date: Date | string) => {
		try {
			const dateObj = date instanceof Date ? date : parseISO(date)
			if (!isValid(dateObj)) {
				return t('booking.invalid_date')
			}
			return formatDateFns(dateObj, 'EEEE, dd MMMM yyyy', { locale: vi })
		} catch (error) {
			console.error('Error formatting date:', error)
			return t('booking.invalid_date')
		}
	}

	const handleViewResults = async () => {
		await refetchResult()
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}

	const handleDownloadPDF = async () => {
		setIsExporting(true)
		try {
			const { data: latestResult } = await refetchResult()
			const pdfBlob = await createBookingPDF(booking, latestResult)
			const url = window.URL.createObjectURL(
				new Blob([pdfBlob], { type: 'application/pdf' })
			)
			const link = document.createElement('a')
			link.href = url
			link.download = `booking-${booking.orderDetailId}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading PDF:', error)
			toast.error(t('booking.pdf_download_error'))
		} finally {
			setIsExporting(false)
		}
	}

	const handleMomoPayment = async () => {
		// Check if purchaseId exists
		if (!booking.purchaseId) {
			toast.error(t('payment.payment_required'))
			return
		}

		try {
			console.log(
				'Attempting MoMo payment with purchaseId:',
				booking.purchaseId
			)

			const result = await momoPayMutation.mutateAsync(booking.purchaseId)

			// Redirect to MoMo payment URL
			if (result.payUrl) {
				window.location.href = result.payUrl
			} else {
				toast.error(t('payment.payment_link_failed'))
			}
		} catch (error) {
			console.error('MoMo payment failed:', error)
			toast.error(t('payment.payment_failed'))
		}
	}

	const handleVnpayPayment = async () => {
		// Check if purchaseId exists
		if (!booking.purchaseId) {
			toast.error(t('booking.payment_info_not_found'))
			return
		}

		try {
			console.log(
				'Attempting VNPay payment with purchaseId:',
				booking.purchaseId
			)

			await vnpayPayMutation.mutateAsync(booking.purchaseId, {
				onSuccess: data => {
					// Redirect to VNPay payment URL
					if (data) {
						window.location.href = data
					} else {
						toast.error(t('booking.payment_link_failed'))
					}
				},
				onError: error => {
					console.error('VNPay payment failed:', error)
				},
			})
		} catch (error) {
			console.error('VNPay payment failed:', error)
			toast.error(t('booking.vnpay_payment_failed'))
		}
	}

	const handleDelete = async () => {
		setShowConfirm(true)
	}

	const handleConfirmDelete = async () => {
		setShowConfirm(false)
		await deleteMutation.mutateAsync(undefined, {
			onSuccess() {
				toast.success(t('payment.booking_cancelled'))
			},
			onError() {
				toast.error(t('payment.booking_cancel_failed'))
			},
		})
	}

	const handleCancelDelete = () => {
		setShowConfirm(false)
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
								{t('booking.customer')}: {booking.firstName} {booking.lastName}
							</p>
							<p>
								{t('booking.booking_date')}: {formatDate(booking.createdAt)}
							</p>
							<p>
								{t('booking.status_label')}:
								<span
									className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
										booking.status
											? 'bg-green-100 text-green-600'
											: 'bg-yellow-100 text-yellow-600'
									}`}
								>
									{booking.status ? t('payment.paid') : t('payment.unpaid')}
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
									{t('booking.view_results')}
								</button>
								<button
									onClick={handleDownloadPDF}
									disabled={isExporting}
									className='flex items-center gap-2 px-4 py-2 bg-main text-white rounded-[20px] hover:bg-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
								>
									<DownloadSVG className='size-4' />
									{isExporting
										? t('booking.downloading')
										: t('booking.download_pdf')}
								</button>
							</>
						) : (
							// Show payment buttons for unpaid services
							<>
								<button
									onClick={handleMomoPayment}
									disabled={
										momoPayMutation.isPending || vnpayPayMutation.isPending
									}
									className={`flex items-center gap-2 px-4 py-2 rounded-[20px] transition-colors ${
										momoPayMutation.isPending || vnpayPayMutation.isPending
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
										? t('booking.processing')
										: t('booking.pay_momo')}
								</button>
								<button
									onClick={handleVnpayPayment}
									disabled={
										momoPayMutation.isPending || vnpayPayMutation.isPending
									}
									className={`flex items-center gap-2 px-4 py-2 rounded-[20px] transition-colors ${
										momoPayMutation.isPending || vnpayPayMutation.isPending
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-blue-600 hover:bg-blue-700 text-white'
									}`}
								>
									{vnpayPayMutation.isPending ? (
										<LoadingIcon className='size-4' />
									) : (
										<div className='w-4 h-4 bg-white rounded-full flex items-center justify-center'>
											<span className='text-blue-600 font-bold text-xs'>V</span>
										</div>
									)}
									{vnpayPayMutation.isPending
										? t('booking.processing')
										: t('booking.pay_vnpay')}
								</button>
								<button
									onClick={handleDelete}
									disabled={deleteMutation.isPending}
									className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-[20px] hover:bg-red-600 transition-colors'
								>
									{deleteMutation.isPending
										? t('booking.deleting')
										: t('payment.cancel_booking')}
								</button>
							</>
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

			<ConfirmDialog
				isOpen={showConfirm}
				title={t('payment.confirm_cancel')}
				message={t('payment.cancel_booking_confirm')}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		</>
	)
}

export default BookingItem
