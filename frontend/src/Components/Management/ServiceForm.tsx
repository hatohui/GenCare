'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'
import {
	ServiceFormSchema,
	serviceSchema,
} from '@/Interfaces/Service/Schemas/service'
import LoadingIcon from '../LoadingIcon'
import { CloudinaryButton } from '../CloudinaryButton'
import { useDeleteMedia } from '@/Services/media-service'
import { useServiceById } from '@/Services/service-services'

interface ImageWithId {
	id: string
	url: string
}

interface ServiceFormProps {
	id: string
	onSave: (data: any) => void
	onCancel: () => void
	isLoading?: boolean
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
	id,
	onSave,
	onCancel,
	isLoading = false,
}) => {
	const deleteMediaMutation = useDeleteMedia()
	const { data: initialData } = useServiceById(id)

	const [existingImages] = useState<ImageWithId[]>(
		initialData?.imageUrls?.map(img => ({
			id: typeof img === 'string' ? '' : img.id,
			url: typeof img === 'string' ? img : img.url,
		})) || []
	)
	const [newImageUrls, setNewImageUrls] = useState<string[]>([])
	const [removedImageIds, setRemovedImageIds] = useState<string[]>([])

	const displayImages = existingImages
		.filter(img => !removedImageIds.includes(img.id))
		.map(img => img.url)
		.concat(newImageUrls)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ServiceFormSchema>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: initialData?.name || '',
			description: initialData?.description || '',
			price: initialData?.price || 0,
		},
	})

	// Reset form when initial data changes (important for editing)
	React.useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || '',
				description: initialData.description || '',
				price: initialData.price || 0,
			})
		}
	}, [initialData, reset])

	const handleImageUpload = (url: string, publicId: string) => {
		console.log('🖼️ Service image uploaded:', { url, publicId })
		setNewImageUrls(prev => [...prev, url])
		toast.success('Image uploaded successfully')
	}

	const handleUploadError = (error: string) => {
		console.error('❌ Service image upload error:', error)
		toast.error(error)
	}

	const handleRemoveImage = (index: number) => {
		const imageUrl = displayImages[index]

		// Find if this is an existing image (has an ID) or new image (no ID)
		const existingImage = existingImages.find(img => img.url === imageUrl)

		if (existingImage && existingImage.id) {
			// It's an existing image - mark for removal and delete from backend
			setRemovedImageIds(prev => [...prev, existingImage.id])

			// Optionally delete immediately from backend
			deleteMediaMutation.mutate(existingImage.id, {
				onSuccess: () => {
					toast.success('Image removed successfully')
				},
				onError: () => {
					toast.error('Failed to remove image')
					// Revert the removal if backend deletion failed
					setRemovedImageIds(prev => prev.filter(id => id !== existingImage.id))
				},
			})
		} else {
			// It's a new image - just remove from state
			setNewImageUrls(prev => prev.filter(url => url !== imageUrl))
			toast.success('Image removed')
		}
	}

	const onSubmit = (data: ServiceFormSchema) => {
		// Only include existing images that weren't removed and new images
		const existingImageUrls = existingImages
			.filter(img => !removedImageIds.includes(img.id))
			.map(img => img.url)
		const finalImageUrls = [...existingImageUrls, ...newImageUrls]

		const submitData = {
			...data,
			imageUrls: finalImageUrls,
		}

		console.log('📤 Submitting Service Update:', {
			existing: existingImages,
			removed: removedImageIds,
			new: newImageUrls,
			final: finalImageUrls,
			submitData,
		})

		onSave(submitData)
	}

	return (
		<div className='w-full max-w-3xl mx-auto'>
			<div className='bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100'>
				<div className='main-gradient-bg px-6 py-5'>
					<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
							/>
						</svg>
						Edit Service
					</h2>
					<p className='text-white/70 text-sm mt-1 font-light'>
						Update service information and manage images
					</p>
				</div>

				<div className='p-6'>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						{/* Service Images */}
						<div className='space-y-4 pb-6 border-b border-gray-100'>
							<div className='text-center'>
								<h3 className='text-md font-medium text-gray-900 mb-2'>
									Service Images
								</h3>
								<p className='text-sm text-gray-600 mb-4'>
									Upload or manage images for this service
								</p>

								{displayImages && displayImages.length > 0 && (
									<div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
										{displayImages
											.slice(0, 4)
											.map((imageUrl: string, index: number) => (
												<div key={index} className='relative group'>
													<CldImage
														src={imageUrl}
														alt={`Service image ${index + 1}`}
														width={120}
														height={120}
														className='w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm'
													/>
													<button
														type='button'
														onClick={() => handleRemoveImage(index)}
														className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg'
													>
														×
													</button>
												</div>
											))}
									</div>
								)}

								<CloudinaryButton
									onUploaded={handleImageUpload}
									onError={handleUploadError}
									uploadPreset='gencare'
									text={
										displayImages.length > 0 ? 'Add More Images' : 'Add Images'
									}
									className='px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium'
								/>
							</div>
						</div>

						{/* Service Details */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-900 mb-2'>
									Service Name *
								</label>
								<input
									{...register('name')}
									type='text'
									className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
										errors.name
											? 'border-red-300 bg-red-50'
											: 'border-gray-200 bg-gray-50'
									}`}
									placeholder='Enter service name'
								/>
								<div className='mt-1 h-5'>
									{errors.name && (
										<p className='text-sm text-red-500'>
											{errors.name.message}
										</p>
									)}
								</div>
							</div>

							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-900 mb-2'>
									Description
								</label>
								<textarea
									{...register('description')}
									rows={4}
									className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
										errors.description
											? 'border-red-300 bg-red-50'
											: 'border-gray-200 bg-gray-50'
									}`}
									placeholder='Enter service description'
								/>
								<div className='mt-1 h-5'>
									{errors.description && (
										<p className='text-sm text-red-500'>
											{errors.description.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-900 mb-2'>
									Price *
								</label>
								<div className='relative'>
									<input
										{...register('price', { valueAsNumber: true })}
										type='number'
										min='0'
										step='1000'
										className={`w-full pl-3 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
											errors.price
												? 'border-red-300 bg-red-50'
												: 'border-gray-200 bg-gray-50'
										}`}
										placeholder='Enter service price'
									/>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<span className='text-gray-500 text-sm font-medium'>
											VND
										</span>
									</div>
								</div>
								<div className='mt-1 h-5'>
									{errors.price && (
										<p className='text-sm text-red-500'>
											{errors.price.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-900 mb-2'>
									Status
								</label>
								<div className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg flex items-center'>
									<span
										className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
											initialData?.isDeleted
												? 'bg-red-100 text-red-700'
												: 'bg-green-100 text-green-700'
										}`}
									>
										<div
											className={`w-2 h-2 rounded-full mr-2 ${
												initialData?.isDeleted ? 'bg-red-500' : 'bg-green-500'
											}`}
										/>
										{initialData?.isDeleted ? 'Inactive' : 'Active'}
									</span>
								</div>
							</div>
						</div>

						{/* Form Actions */}
						<div className='flex justify-end gap-3 pt-6 border-t border-gray-100'>
							<button
								type='button'
								onClick={onCancel}
								className='px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
								disabled={isLoading}
							>
								Cancel
							</button>
							<button
								type='submit'
								disabled={isLoading}
								className='px-6 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 min-w-[120px] flex items-center justify-center gap-2'
							>
								{isLoading && <LoadingIcon className='w-4 h-4' />}
								<span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
