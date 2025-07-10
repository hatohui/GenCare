'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ConfirmDialogProps {
	isOpen: boolean
	title?: string
	message?: string
	onConfirm: () => void
	onCancel: () => void
	confirmButtonVariant?: 'danger' | 'primary'
	confirmButtonText?: string
	cancelButtonText?: string
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	isOpen,
	title = 'Confirm Action',
	message = 'Are you sure you want to proceed?',
	onConfirm,
	onCancel,
	confirmButtonVariant = 'danger',
	confirmButtonText = 'Xác nhận',
	cancelButtonText = 'Hủy',
}) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onCancel()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onCancel])

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-40 bg-black/50'
					/>

					{/* Dialog */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className='fixed inset-0 z-50 flex items-center justify-center'
					>
						<div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'>
							<h2 className='text-lg font-bold text-gray-800 mb-2'>{title}</h2>
							<p className='text-sm text-gray-600 mb-4'>{message}</p>
							<div className='flex justify-end gap-3'>
								<button
									onClick={onCancel}
									className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100'
								>
									{cancelButtonText}
								</button>
								<button
									onClick={onConfirm}
									className={`px-4 py-2 rounded-md text-white ${
										confirmButtonVariant === 'danger'
											? 'bg-red-600 hover:bg-red-700'
											: 'bg-blue-600 hover:bg-blue-700'
									}`}
								>
									{confirmButtonText}
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default ConfirmDialog
