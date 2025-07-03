'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

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
			className='fixed inset-0 bg-black/30 backdrop-blur-[6px] flex items-center justify-center z-50 p-4'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
			onClick={handleBackdropClick}
		>
			{' '}
			<motion.div
				className='bg-white rounded-[20px] p-8 shadow-2xl max-w-md w-full mx-4'
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				transition={{ duration: 0.2 }}
			>
				{/* Icon */}
				<div className='mx-auto flex items-center justify-center w-16 h-16 rounded-[16px] mb-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200'>
					{isDangerous ? (
						<svg
							className='w-8 h-8 text-red-600'
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
					) : (
						<div className='w-16 h-16 rounded-[16px] bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
							<svg
								className='w-8 h-8 text-white'
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

				{/* Content */}
				<div className='text-center mb-8'>
					<h3 id='modal-title' className='text-xl font-bold text-gray-900 mb-3'>
						{title}
					</h3>
					<p
						id='modal-description'
						className='text-gray-600 text-lg leading-relaxed'
					>
						{message}
					</p>
				</div>

				{/* Buttons */}
				<div className='flex gap-4'>
					<motion.button
						ref={firstFocusableRef}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onClose}
						disabled={isLoading}
						className='flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
						aria-label={`${cancelText} and close dialog`}
					>
						{cancelText}
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleConfirm}
						disabled={isLoading}
						className={`flex-1 px-6 py-4 rounded-[12px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
							isDangerous
								? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
								: 'bg-gradient-to-r from-main to-secondary hover:from-secondary hover:to-main text-white'
						}`}
						aria-label={`${confirmText} action`}
					>
						{isLoading ? (
							<div className='flex items-center justify-center gap-2'>
								<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
								Đang xử lý...
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
