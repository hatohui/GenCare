'use client'

import React from 'react'
import { motion } from 'motion/react'
import { CreateAccountForm } from './CreateAccountForm'
import { useCreateAccount } from '@/Services/account-service'
import { PostAccountRequest } from '@/Interfaces/Account/Schema/account'

// Simple X icon component
const XIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M6 18L18 6M6 6l12 12'
		/>
	</svg>
)

interface AddNewAccountFormProps {
	onSuccess: () => void
	onClose: () => void
	className?: string
}

const AddNewAccountForm: React.FC<AddNewAccountFormProps> = ({
	onSuccess,
	onClose,
	className = '',
}) => {
	const createMutation = useCreateAccount()

	const handleSave = (formData: PostAccountRequest) => {
		createMutation.mutate(formData, {
			onSuccess: () => {
				onSuccess()
				onClose()
			},
			onError: error => {
				console.error('Failed to create account:', error)
			},
		})
	}

	return (
		<motion.div
			className={`fixed inset-0 bg-black/30 backdrop-blur-[6px] flex items-center justify-center z-50 p-4 ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				transition={{ duration: 0.2 }}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<h2 className='text-xl font-semibold text-gray-900'>
						Create New Account
					</h2>
					<button
						onClick={onClose}
						className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
					>
						<XIcon className='w-5 h-5' />
					</button>
				</div>

				{/* Content */}
				<div className='p-6 max-h-[calc(90vh-120px)] overflow-y-auto'>
					<CreateAccountForm
						onSave={handleSave}
						onCancel={onClose}
						isLoading={createMutation.isPending}
					/>
				</div>
			</motion.div>
		</motion.div>
	)
}

export default AddNewAccountForm
