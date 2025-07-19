'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useLocale } from '@/Hooks/useLocale'

interface ConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	isDangerous?: boolean
	isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	isDangerous = false,
	isLoading = false,
}) => {
	const { t } = useLocale()
	const modalRef = useRef<HTMLDivElement>(null)
	const firstFocusableRef = useRef<HTMLButtonElement>(null)

	// Focus management and escape key handler
	useEffect(() => {
		if (!isOpen) return

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		// Focus the first focusable element (cancel button) when modal opens
		if (firstFocusableRef.current) {
			firstFocusableRef.current.focus()
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	if (!isOpen) return null

	const handleConfirm = () => {
		onConfirm()
	}

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<motion.div
			ref={modalRef}
			className='fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
			onClick={handleBackdropClick}
		>
			<motion.div
				className='bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full mx-4 overflow-hidden'
				initial={{ scale: 0.95, opacity: 0, y: -20 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.95, opacity: 0, y: -20 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				{/* Header with Icon */}
				<div className='px-6 py-4 border-b border-gray-100'>
					<div className='flex items-center gap-3'>
						<div className='flex-shrink-0'>
							{isDangerous ? (
								<div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-red-600'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
										/>
									</svg>
								</div>
							) : (
								<div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-blue-600'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
							)}
						</div>
						<div className='flex-1'>
							<h3
								id='modal-title'
								className='text-lg font-semibold text-gray-900'
							>
								{title}
							</h3>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className='px-6 py-4'>
					<p
						id='modal-description'
						className='text-gray-600 text-sm leading-relaxed'
					>
						{message}
					</p>
				</div>

				{/* Buttons */}
				<div className='px-6 py-4 bg-gray-50 flex gap-3'>
					<motion.button
						ref={firstFocusableRef}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onClose}
						disabled={isLoading}
						className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm'
						aria-label={`${cancelText} and close dialog`}
					>
						{cancelText}
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleConfirm}
						disabled={isLoading}
						className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm ${
							isDangerous
								? 'bg-red-600 hover:bg-red-700 text-white'
								: 'bg-blue-600 hover:bg-blue-700 text-white'
						}`}
						aria-label={`${confirmText} action`}
					>
						{isLoading ? (
							<div className='flex items-center justify-center gap-2'>
								<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
								{t('common.processing')}
							</div>
						) : (
							confirmText
						)}
					</motion.button>
				</div>
			</motion.div>
		</motion.div>
	)
}

export default ConfirmationModal
