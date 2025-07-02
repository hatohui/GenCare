'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { ServiceDTO } from '@/Interfaces/Service/Schemas/service'
import { AccountForm } from './AccountForm'
import { ServiceForm } from './ServiceForm'

interface EditModalProps<T> {
	isOpen: boolean
	onClose: () => void
	data: T
	type: 'account' | 'service'
	onSave: (data: any) => void
	isLoading?: boolean
}

export function EditModal<T extends Account | ServiceDTO>({
	isOpen,
	onClose,
	data,
	type,
	onSave,
	isLoading = false,
}: EditModalProps<T>) {
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
						className='fixed inset-0 bg-black/50 z-40'
						onClick={handleOverlayClick}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className='fixed inset-0 z-50 flex items-center justify-center px-4'
						onKeyDown={handleEscape}
						tabIndex={-1}
					>
						<div
							className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden'
							onClick={e => e.stopPropagation()}
						>
							<div className='overflow-y-auto max-h-[90vh] p-6'>
								{type === 'account' && (
									<AccountForm
										initialData={data as Account}
										onSave={onSave}
										onCancel={onClose}
										isLoading={isLoading}
									/>
								)}
								{type === 'service' && (
									<ServiceForm
										initialData={data as ServiceDTO}
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
