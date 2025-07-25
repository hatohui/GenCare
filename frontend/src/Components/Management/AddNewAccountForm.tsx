'use client'

import React from 'react'
import { motion } from 'motion/react'
import { CreateAccountForm } from './CreateAccountForm'
import { useCreateAccount } from '@/Services/account-service'
import { CreateAccountRequest } from '@/Interfaces/Account/Schema/account'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'

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
	const { t } = useLocale()

	const handleSave = (formData: CreateAccountRequest) => {
		createMutation.mutate(formData, {
			onSuccess: () => {
				onSuccess()
				onClose()
				toast.success(t('management.account.created_successfully'))
			},
			onError: error => {
				console.error('Failed to create account:', error)
				toast.error(t('management.account.create_failed'))
			},
		})
	}

	return (
		<motion.div
			className={`fixed inset-0 bg-black/30 backdrop-blur-[6px] flex items-center justify-center z-50 p-4 ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
		>
			<motion.div
				className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				transition={{ duration: 0.2 }}
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<h2 className='text-xl font-semibold text-gray-900'>
						{t('management.account.create_new')}
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
