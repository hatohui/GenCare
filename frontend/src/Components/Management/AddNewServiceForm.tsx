'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateService } from '@/Services/service-services'
import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import {
	ServiceFormSchema,
	serviceSchema,
} from '@/Interfaces/Service/Schemas/service'

interface Props {
	onSuccess?: () => void
	onClose?: () => void
	className?: string
}

const AddNewServiceForm = ({ onSuccess, onClose, className }: Props) => {
	const [loading, setLoading] = useState(false)
	const createMutation = useCreateService()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ServiceFormSchema>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: '',
			description: '',
			price: 0,
		},
	})

	const onSubmit = (data: ServiceFormSchema) => {
		setLoading(true)
		createMutation.mutate(data, {
			onSuccess: () => {
				reset()
				onSuccess?.()
				onClose?.()
			},
			onSettled: () => setLoading(false),
		})
	}

	return (
		<>
			{/* Overlay */}
			<motion.div
				className='fixed inset-0 bg-black/30 backdrop-blur-[6px] z-40'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			/>

			{/* Modal */}
			<motion.div
				className='fixed inset-0 z-50 flex items-center justify-center px-4'
				initial={{ opacity: 0, scale: 0.95, y: -20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: -20 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				<div
					className={clsx(
						'relative bg-white w-full max-w-md rounded-xl p-6 shadow-2xl border border-gray-200',
						className
					)}
					onClick={e => e.stopPropagation()}
				>
					{/* Close Button */}
					<button
						onClick={onClose}
						className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold'
						aria-label='Close'
					>
						×
					</button>

					<h2 className='text-2xl font-semibold mb-6 text-gray-800'>
						Add New Service
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
						{/* Name */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Service Name
							</label>
							<input
								{...register('name')}
								type='text'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								placeholder='Enter service name'
							/>
							{errors.name && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Description */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Description
							</label>
							<textarea
								{...register('description')}
								rows={3}
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								placeholder='Enter description'
							/>
							{errors.description && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.description.message}
								</p>
							)}
						</div>

						{/* Price */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Price
							</label>
							<input
								{...register('price', { valueAsNumber: true })}
								type='number'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								placeholder='Enter price'
							/>
							{errors.price && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.price.message}
								</p>
							)}
						</div>

						<button
							type='submit'
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed'
							disabled={loading}
						>
							{loading ? 'Creating...' : 'Create Service'}
						</button>
					</form>
				</div>
			</motion.div>
		</>
	)
}

export default AddNewServiceForm
