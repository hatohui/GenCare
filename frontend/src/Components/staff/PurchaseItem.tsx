'use client'

import { BookedService } from '@/Interfaces/Payment/Types/BookService'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import ConfirmDialog from '../ConfirmationDialog'
import { useManualPay } from '@/Services/book-service'

const PurchaseItem = ({ purchase }: { purchase: BookedService }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const manualPayment = useManualPay()

	const handlePayment = () => {
		manualPayment.mutate({ purchaseId: purchase.purchaseId })
		setShowConfirm(false)
		console.log('Payment for purchase ID:', purchase.purchaseId)
	}

	return (
		<div className='w-full p-2'>
			<ConfirmDialog
				isOpen={showConfirm}
				title='Xác nhận đã trả'
				message='Khách hàng đã trả tiền'
				onConfirm={handlePayment}
				onCancel={() => setShowConfirm(false)}
			/>

			{/* Header (Click to Expand) */}
			<motion.div
				whileHover={{
					scale: 1.02,
					boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)',
				}}
				transition={{ duration: 0.3 }}
				className='cursor-pointer flex flex-col gap-2 rounded-[30px] bg-white p-4 h-auto'
			>
				<div className='flex flex-col gap-2' onClick={() => setIsOpen(!isOpen)}>
					<div className='flex justify-between items-center'>
						<h3 className='text-lg font-semibold text-gray-900'>
							Purchase ID: {purchase.purchaseId}
						</h3>
						<p className='text-gray-600'>
							Total Price: {purchase.price.toLocaleString('vi-VN')} VND
						</p>
					</div>
					<div className='flex justify-between items-center'>
						<p
							className={`text-sm ${
								purchase.isPaid ? 'text-green-600' : 'text-red-600'
							}`}
						>
							Status: {purchase.isPaid ? 'Paid' : 'Unpaid'}
						</p>
						<button
							onClick={e => {
								e.stopPropagation() // prevent toggling on button click
								setShowConfirm(true)
							}}
							disabled={purchase.isPaid}
							className={`py-2 px-4 rounded-full text-white ${
								purchase.isPaid ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent'
							}`}
						>
							{!purchase.isPaid ? 'Xác Nhận Trả' : 'Đã Thanh Toán'}
						</button>
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
							className='mt-4'
						>
							<h4 className='font-semibold text-gray-800 mb-2'>
								Booked Services:
							</h4>
							<div className='flex flex-col gap-2 max-h-[300px] overflow-auto pr-2'>
								{purchase.order.map(service => (
									<motion.div
										layout
										key={service.orderDetailId}
										className='border border-gray-200 p-3 rounded-lg bg-gray-50'
									>
										<p className='text-sm'>
											<span className='font-medium'>Service:</span>{' '}
											{service.serviceName}
										</p>
										<p className='text-sm'>
											<span className='font-medium'>Customer:</span>{' '}
											{service.firstName} {service.lastName}
										</p>
										<p className='text-sm'>
											<span className='font-medium'>Phone:</span>{' '}
											{service.phoneNumber}
										</p>
										<p className='text-sm'>
											<span className='font-medium'>DOB:</span>{' '}
											{new Date(service.dateOfBirth).toLocaleDateString()}
										</p>
										<p className='text-sm'>
											<span className='font-medium'>Gender:</span>{' '}
											{service.gender ? 'Male' : 'Female'}
										</p>
										<p className='text-sm'>
											<span className='font-medium'>Created At:</span>{' '}
											{new Date(service.createdAt).toLocaleString()}
										</p>
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
