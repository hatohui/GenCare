'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateService } from '@/Services/service-services'
import { useState } from 'react'
import { motion } from 'motion/react'
import clsx from 'clsx'
import {
	ServiceFormSchema,
	serviceSchema,
} from '@/Interfaces/Service/Schemas/service'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'

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
	} = useForm<ServiceFormSchema>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			name: '',
			description: '',
			price: 0,
		},
	})

	const handleImageUpload = (url: string, publicId: string) => {
		console.log('🖼️ Service image uploaded:', { url, publicId })
		setImageUrls(prev => [...prev, url])
		toast.success('Image uploaded successfully')
	}

	const handleUploadError = (error: string) => {
		console.error('❌ Service image upload error:', error)
		toast.error(error)
	}

	const handleRemoveImage = (index: number) => {
		setImageUrls(prev => prev.filter((_, i) => i !== index))
		toast.success('Image removed')
	}

	const onSubmit = (data: ServiceFormSchema) => {
		setLoading(true)

		const submitData = {
			...data,
			imageUrls: imageUrls,
		}

		console.log(
			'📤 Submitting Service Creation:',
			JSON.stringify(submitData, null, 2)
		)

		createMutation.mutate(submitData as any, {
			onSuccess: () => {
				reset()
				setImageUrls([])
				onSuccess?.()
				onClose?.()
				toast.success('Service created successfully')
			},
			onError: error => {
				console.error('Failed to create service:', error)
				toast.error('Failed to create service')
			},
			onSettled: () => setLoading(false),
		})
	}

	return (
		<>
			<motion.div
				className='fixed inset-0 bg-black/30 backdrop-blur-[6px] z-40'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			/>

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
						<div className='flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
							<div className='text-center'>
								<h3 className='text-lg font-medium text-gray-700 mb-2'>
									Service Images
								</h3>
								<p className='text-sm text-gray-500 mb-4'>
									Upload images for this service
								</p>

								{imageUrls && imageUrls.length > 0 && (
									<div className='grid grid-cols-3 gap-2 mb-4'>
										{imageUrls.map((imageUrl, index) => (
											<div
												key={index}
												className='relative group w-full aspect-square'
											>
												<CldImage
													src={imageUrl}
													alt={`Service image ${index + 1}`}
													width={120}
													height={120}
													className='object-cover rounded-lg border border-gray-200 w-full h-full'
												/>
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

								<CloudinaryButton
									onUploaded={handleImageUpload}
									onError={handleUploadError}
									uploadPreset='gencare'
									text={imageUrls.length > 0 ? 'Add More Images' : 'Add Images'}
									className='px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm'
								/>
							</div>
						</div>

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

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Price
							</label>
							<div className='relative'>
								<input
									{...register('price', { valueAsNumber: true })}
									type='number'
									min='0'
									step='1000'
									className='w-full pl-4 pr-12 py-2 rounded-md border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
									placeholder='Enter price'
								/>
								<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
									<span className='text-gray-500 text-sm font-medium'>VND</span>
								</div>
							</div>
							{errors.price && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.price.message}
								</p>
							)}
						</div>

						<button
							type='submit'
							className='w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed'
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
