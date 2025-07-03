'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'
import {
	ServiceDTO,
	ServiceFormSchema,
	serviceSchema,
} from '@/Interfaces/Service/Schemas/service'
import LoadingIcon from '../LoadingIcon'
import { CloudinaryButton } from '../CloudinaryButton'

interface ServiceFormProps {
	initialData: ServiceDTO
	onSave: (data: any) => void
	onCancel: () => void
	isLoading?: boolean
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
	initialData,
	onSave,
	onCancel,
	isLoading = false,
}) => {
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)
	const [imageUrls, setImageUrls] = useState<string[]>(
		initialData.imageUrls?.map(img =>
			typeof img === 'string' ? img : img.url
		) || []
	)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ServiceFormSchema>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: initialData.name || '',
			description: initialData.description || '',
			price: initialData.price || 0,
		},
	})

	const handleImageUpload = (url: string, publicId: string) => {
		console.log('🖼️ Service image uploaded:', { url, publicId })
		const newImageUrls = [...imageUrls, url]
		setImageUrls(newImageUrls)
		setIsImageModalOpen(false)
	}

	const handleUploadError = (error: string) => {
		console.error('❌ Service image upload error:', error)
		toast.error(error)
	}

	const handleRemoveImage = (index: number) => {
		const newImageUrls = imageUrls.filter((_, i) => i !== index)
		setImageUrls(newImageUrls)
	}

	const onSubmit = (data: ServiceFormSchema) => {
		// Include the imageUrls as List<string> for the backend
		const submitData = {
			...data,
			imageUrls: imageUrls, // This will be sent as List<string> to backend
		}
		console.log(
			'📤 Submitting Service Update:',
			JSON.stringify(submitData, null, 2)
		)
		onSave(submitData)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-semibold text-gray-900'>Edit Service</h2>
				<button
					onClick={onCancel}
					className='text-gray-500 hover:text-gray-700 transition-colors'
				>
					<svg
						className='w-6 h-6'
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
				</button>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				{/* Service Image Section */}
				<div className='flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg'>
					<div className='text-center'>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							Service Images
						</h3>
						<p className='text-sm text-gray-600 mb-4'>
							Upload or manage images for this service
						</p>

						{/* Display current images if any */}
						{imageUrls && imageUrls.length > 0 && (
							<div className='grid grid-cols-2 gap-2 mb-4'>
								{imageUrls.slice(0, 4).map((imageUrl, index) => (
									<div key={index} className='relative group w-20 h-20'>
										<CldImage
											src={imageUrl}
											alt={`Service image ${index + 1}`}
											width={80}
											height={80}
											className='object-cover rounded-lg border border-gray-200'
										/>
										{/* Remove button */}
										<button
											type='button'
											onClick={() => handleRemoveImage(index)}
											className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100'
										>
											×
										</button>
									</div>
								))}
							</div>
						)}

						<button
							type='button'
							onClick={() => setIsImageModalOpen(true)}
							className='px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors'
						>
							{imageUrls.length > 0 ? 'Add More Images' : 'Add Images'}
						</button>
					</div>
				</div>

				{/* Service Name */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Service Name <span className='text-red-500'>*</span>
					</label>
					<input
						{...register('name')}
						type='text'
						className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
							errors.name ? 'border-red-500' : 'border-gray-300'
						}`}
						placeholder='Enter service name'
					/>
					{errors.name && (
						<p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>
					)}
				</div>

				{/* Description */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Description
					</label>
					<textarea
						{...register('description')}
						rows={4}
						className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
							errors.description ? 'border-red-500' : 'border-gray-300'
						}`}
						placeholder='Enter service description'
					/>
					{errors.description && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>
						Price (VND) <span className='text-red-500'>*</span>
					</label>
					<input
						{...register('price', { valueAsNumber: true })}
						type='number'
						min='0'
						step='1000'
						className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent ${
							errors.price ? 'border-red-500' : 'border-gray-300'
						}`}
						placeholder='Enter service price'
					/>
					{errors.price && (
						<p className='mt-1 text-sm text-red-500'>{errors.price.message}</p>
					)}
				</div>

				{/* Service Status */}
				<div className='flex items-center space-x-2'>
					<div className='flex items-center'>
						<span
							className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
								initialData.isDeleted
									? 'bg-red-100 text-red-800'
									: 'bg-green-100 text-green-800'
							}`}
						>
							{initialData.isDeleted ? 'Inactive' : 'Active'}
						</span>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
					<button
						type='button'
						onClick={onCancel}
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
						disabled={isLoading}
					>
						Cancel
					</button>
					<button
						type='submit'
						disabled={isLoading}
						className='px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
					>
						{isLoading && <LoadingIcon className='w-4 h-4' />}
						<span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
					</button>
				</div>
			</form>

			{/* Image Upload Modal */}
			{isImageModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className='bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4'
					>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							Upload Service Images
						</h3>
						<div className='space-y-4'>
							<CloudinaryButton
								onUploaded={handleImageUpload}
								onError={handleUploadError}
								uploadPreset='gencare'
								text='Upload New Image'
								className='w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50'
							/>
							<button
								onClick={() => setIsImageModalOpen(false)}
								className='w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
							>
								Cancel
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	)
}

export default ServiceForm
