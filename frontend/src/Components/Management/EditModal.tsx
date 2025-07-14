'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AccountForm } from './AccountForm'
import { ServiceForm } from './ServiceForm'

interface EditModalProps {
	id: string
	isOpen: boolean
	onClose: () => void
	type: 'account' | 'service'
	onSave: (data: any) => void
	isLoading?: boolean
}

export function EditModal({
	id,
	isOpen,
	onClose,
	type,
	onSave,
	isLoading = false,
}: EditModalProps) {
	const handleEscape = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose()
		}
	}

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/40 backdrop-blur-md z-40'
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className='fixed inset-0 z-50 flex items-center justify-center px-4'
						onKeyDown={handleEscape}
						onClick={handleOverlayClick}
						role='dialog'
						aria-modal='true'
						aria-labelledby='edit-modal-title'
					>
						<div
							className='bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden'
							onClick={e => e.stopPropagation()}
						>
							<div className='overflow-y-auto max-h-[90vh] scroll-bar'>
								{type === 'account' && (
									<AccountForm
										id={id}
										onSave={onSave}
										onCancel={onClose}
										isLoading={isLoading}
									/>
								)}
								{type === 'service' && (
									<ServiceForm
										id={id}
										onSave={onSave}
										onCancel={onClose}
										isLoading={isLoading}
									/>
								)}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default EditModal
