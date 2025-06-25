'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateService } from '@/Services/service-services'
import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
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
	const [imageUrls, setImageUrls] = useState<string[]>([])
	const createMutation = useCreateService()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<ServiceFormSchema>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: '',
			description: '',
			price: 0,
			imageUrls: [],
		},
	})

	const handleImageUpload = (url: string, publicId: string) => {
		const newImageUrls = [...imageUrls, url]
		setImageUrls(newImageUrls)
		setValue('imageUrls', newImageUrls)
	}

	const onSubmit = (data: ServiceFormSchema) => {
		setLoading(true)
		createMutation.mutate(data, {
			onSuccess: () => {
				reset()
				setImageUrls([])
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
				className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40'
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

						{/* Image Upload */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Service Image
							</label>
							<CldUploadWidget
								options={{
									sources: ['local', 'google_drive'],
									multiple: false,
									maxFiles: 1,
									clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
								}}
								signatureEndpoint='/api/sign-image'
								uploadPreset='gencare'
								onSuccess={(result: CloudinaryUploadWidgetResults) => {
									const info = result.info as {
										secure_url: string
										public_id: string
									}
									handleImageUpload(info.secure_url, info.public_id)
								}}
							>
								{({ open }) => (
									<button
										type='button'
										onClick={() => open()}
										className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition'
									>
										Upload Image
									</button>
								)}
							</CldUploadWidget>
							{imageUrls.length > 0 && (
								<div className='mt-2'>
									<p className='text-sm text-gray-600'>Uploaded Image:</p>
									<img
										src={imageUrls[0]}
										alt='Uploaded service'
										className='mt-1 h-24 w-24 object-cover rounded-md'
									/>
								</div>
							)}
							{errors.imageUrls && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.imageUrls.message}
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
