'use client'

import { BookedService } from '@/Interfaces/Payment/Types/BookService'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import ConfirmDialog from '../ConfirmationDialog'
import { useManualPay } from '@/Services/book-service'
import { toast } from 'react-hot-toast'
import LoadingIcon from '../LoadingIcon'
import {
	CheckCircleSVG,
	XCircleSVG,
	ChevronDownSVG,
	ChevronUpSVG,
} from '../SVGs'
import clsx from 'clsx'
import { useLocale } from '@/Hooks/useLocale'

interface PurchaseItemProps {
	purchase: BookedService
}

const PurchaseItem = ({ purchase }: PurchaseItemProps) => {
	const { t } = useLocale()
	const [isOpen, setIsOpen] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const manualPayment = useManualPay()

	const handlePayment = () => {
		manualPayment.mutate(
			{ purchaseId: purchase.purchaseId },
			{
				onSuccess: () => {
					setShowConfirm(false)
					toast.success(t('staff.payment_confirmed_success'))
				},
				onError: error => {
					console.error('Manual payment failed:', error)
					setShowConfirm(false)
					toast.error(t('staff.payment_confirmation_failed'))
				},
			}
		)
	}

	const formatDate = (dateString: string | Date) => {
		try {
			const date =
				typeof dateString === 'string' ? new Date(dateString) : dateString
			return date.toLocaleDateString('vi-VN', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
		} catch {
			return 'N/A'
		}
	}

	const formatGender = (gender: boolean) => {
		return gender ? t('common.male') : t('common.female')
	}

	return (
		<div className='w-full'>
			<ConfirmDialog
				isOpen={showConfirm}
				title={t('staff.confirm_payment')}
				message={t('staff.confirm_payment_message')}
				onConfirm={handlePayment}
				onCancel={() => setShowConfirm(false)}
			/>

			{/* Main Card */}
			<motion.div
				whileHover={{
					scale: 1.01,
					boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
				}}
				transition={{ duration: 0.3 }}
				className='bg-white border border-gray-200 rounded-[30px] p-6 hover:border-accent/50 transition-all duration-300'
			>
				{/* Header */}
				<div className='flex flex-col gap-4'>
					<div className='flex justify-between items-start'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<h3 className='text-lg font-bold text-gray-900'>
									{t('staff.transaction_code')}: {purchase.purchaseId}
								</h3>
								<div
									className={clsx(
										'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
										purchase.isPaid
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									)}
								>
									{purchase.isPaid ? (
										<CheckCircleSVG className='size-3' />
									) : (
										<XCircleSVG className='size-3' />
									)}
									{purchase.isPaid ? t('payment.paid') : t('payment.unpaid')}
								</div>
							</div>
							<p className='text-2xl font-bold text-main'>
								{purchase.price.toLocaleString('vi-VN')} VND
							</p>
						</div>

						<div className='flex items-center gap-3'>
							{!purchase.isPaid && (
								<button
									onClick={e => {
										e.stopPropagation()
										setShowConfirm(true)
									}}
									disabled={manualPayment.isPending}
									className={clsx(
										'px-4 py-2 rounded-[20px] text-white font-medium transition-all flex items-center gap-2',
										manualPayment.isPending
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-accent hover:bg-accent/90 hover:shadow-md'
									)}
								>
									{manualPayment.isPending ? (
										<>
											<LoadingIcon className='size-4' />
											{t('common.processing')}
										</>
									) : (
										t('staff.confirm_payment')
									)}
								</button>
							)}

							<button
								onClick={() => setIsOpen(!isOpen)}
								className='p-2 rounded-full hover:bg-gray-100 transition-colors'
								aria-label={isOpen ? t('common.collapse') : t('common.expand')}
							>
								{isOpen ? (
									<ChevronUpSVG className='size-5 text-gray-600' />
								) : (
									<ChevronDownSVG className='size-5 text-gray-600' />
								)}
							</button>
						</div>
					</div>

					{/* Service Count */}
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<span className='font-medium'>{purchase.order.length}</span>
						<span>{t('staff.services_booked')}</span>
					</div>
				</div>

				{/* Expandable Content */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							key='expandable-content'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='mt-6 pt-6 border-t border-gray-200'
						>
							<h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
								{t('staff.service_details')}:
							</h4>
							<div className='grid gap-4 max-h-[400px] overflow-auto pr-2'>
								{purchase.order.map((service, index) => (
									<motion.div
										layout
										key={service.orderDetailId}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className='bg-gray-50 border border-gray-200 p-4 rounded-[20px] hover:bg-gray-100 transition-colors'
									>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													{t('service.name')}:
												</p>
												<p className='text-sm text-gray-900 font-semibold'>
													{service.serviceName}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													{t('customer.name')}:
												</p>
												<p className='text-sm text-gray-900'>
													{service.firstName} {service.lastName}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													{t('common.phoneNumber')}:
												</p>
												<p className='text-sm text-gray-900'>
													{service.phoneNumber}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													{t('common.dateOfBirth')}:
												</p>
												<p className='text-sm text-gray-900'>
													{formatDate(service.dateOfBirth)}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													{t('common.gender')}:
												</p>
												<p className='text-sm text-gray-900'>
													{formatGender(service.gender)}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													{t('booking.booking_date')}:
												</p>
												<p className='text-sm text-gray-900'>
													{formatDate(service.createdAt)}
												</p>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	)
}

export default PurchaseItem
