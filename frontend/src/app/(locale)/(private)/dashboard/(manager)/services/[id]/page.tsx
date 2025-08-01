'use client'
import { useServiceById, useUpdateService } from '@/Services/service-services'
import './style.css'
import { useEditableField } from '@/Hooks/Form/useEditable'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'
import EditableField from '@/Components/Management/EditableField'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { useDeleteMedia } from '@/Services/media-service'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'
import LocalizedCurrency from '@/Components/LocalizedCurrency'
import { useQueryClient } from '@tanstack/react-query'
import {
	Service,
	UpdateServiceApiRequest,
	updateServiceSchema,
} from '@/Interfaces/Service/Types/Service'

const ArrowLeftIcon = ({ className }: { className?: string }) => (
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
			d='M15 19l-7-7 7-7'
		/>
	</svg>
)

const ServiceDetailPage = () => {
	const params = useParams()
	const router = useRouter()
	const { t } = useLocale()
	const queryClient = useQueryClient()
	const serviceId =
		params && typeof params.id === 'string' ? params.id : undefined
	const updateServiceMutation = useUpdateService()
	const deleteMediaMutation = useDeleteMedia()
	const query = useServiceById(serviceId ?? '')
	const [newImageUrls, setNewImageUrls] = useState<string[]>([])

	const {
		localData: serviceData,
		editingField,
		handleChange,
		toggleFieldEdit,
		handleFieldSave,
	} = useEditableField({
		query: query,
		onSave: updatedData => {
			const existingImageUrls =
				updatedData.imageUrls?.map((img: any) =>
					typeof img === 'string' ? img : img.url
				) || []

			const updatedServiceDTO: UpdateServiceApiRequest = {
				name: updatedData.name,
				description: updatedData.description,
				price: updatedData.price,
				isDeleted: updatedData.isDeleted,
				imageUrls: existingImageUrls, // Don't add newImageUrls here
			}

			const result = updateServiceSchema.safeParse(updatedServiceDTO)

			if (!result.success) {
				toast.error(t('feedback.validationFailed'))
			} else {
				updateServiceMutation.mutate(
					{ id: serviceId ?? '', data: result.data },
					{
						onSuccess: () => {
							setNewImageUrls([])
							toast.success(
								t('feedback.updateSuccess') || 'Service updated successfully'
							)
							// Invalidate both individual service and services list queries
							queryClient.invalidateQueries({
								queryKey: ['service', serviceId],
							})
							queryClient.invalidateQueries({ queryKey: ['services'] })
							query.refetch()
						},
						onError: error => {
							console.log(error)
							toast.error(
								t('feedback.updateFailed') || 'Failed to update service'
							)
						},
					}
				)
			}
		},
	})

	const queryUI = useQueryUIState({
		query: query,
	})

	// Auto-save images when new ones are uploaded
	useEffect(() => {
		if (
			newImageUrls.length > 0 &&
			serviceData &&
			!updateServiceMutation.isPending
		) {
			// Only send the new image URLs, not the existing ones
			// The backend will handle adding them to the existing images
			const updatedServiceDTO: UpdateServiceApiRequest = {
				name: serviceData.name,
				description: serviceData.description,
				price: serviceData.price,
				isDeleted: serviceData.isDeleted,
				imageUrls: newImageUrls, // Only send new images
			}

			const result = updateServiceSchema.safeParse(updatedServiceDTO)

			if (result.success) {
				updateServiceMutation.mutate(
					{ id: serviceId ?? '', data: result.data },
					{
						onSuccess: () => {
							setNewImageUrls([])
							toast.success(
								t('feedback.imagesSaved') || 'Images saved automatically'
							)
							// Invalidate both individual service and services list queries
							queryClient.invalidateQueries({
								queryKey: ['service', serviceId],
							})
							queryClient.invalidateQueries({ queryKey: ['services'] })
							query.refetch()
						},
						onError: error => {
							console.log(error)
							toast.error(t('feedback.updateFailed') || 'Failed to save images')
						},
					}
				)
			}
		}
	}, [
		newImageUrls,
		serviceData,
		serviceId,
		updateServiceMutation,
		queryClient,
		query,
		t,
	])

	const handleImageUpload = (url: string, publicId: string) => {
		console.log(publicId)
		setNewImageUrls(prev => [...prev, url])
		toast.success(t('feedback.imageUploaded') || 'Image uploaded successfully')
	}

	const handleRemoveImage = (imageId: string, imageUrl: string) => {
		if (imageId) {
			deleteMediaMutation.mutate(imageId, {
				onSuccess: () => {
					toast.success(t('feedback.removed'))
					// Invalidate both individual service and services list queries
					queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
					queryClient.invalidateQueries({ queryKey: ['services'] })
					query.refetch()
				},
				onError: () => {
					toast.error(t('feedback.error'))
				},
			})
		} else {
			setNewImageUrls(prev => prev.filter(url => url !== imageUrl))
			toast.success(t('feedback.removed'))
		}
	}

	return queryUI ? (
		queryUI
	) : (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
				<div className='max-w-5xl mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<button
								onClick={() => router.push('/dashboard/services')}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
							>
								<ArrowLeftIcon className='w-5 h-5 text-gray-600' />
							</button>
							<div>
								<h1 className='text-xl font-semibold text-gray-900'>
									{serviceData?.name || t('services.details')}
								</h1>
								<p className='text-sm text-gray-500'>
									{t('services.management')}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-5xl mx-auto px-6 py-6'>
				<div className='space-y-6'>
					{/* Service Overview */}
					<div className='bg-white rounded-xl border border-gray-200 p-6'>
						<div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
							{/* Service Image */}
							<div className='relative group flex-shrink-0'>
								{serviceData?.imageUrls && serviceData.imageUrls.length > 0 ? (
									<CldImage
										src={
											typeof serviceData.imageUrls[0] === 'string'
												? serviceData.imageUrls[0]
												: serviceData.imageUrls[0].url
										}
										alt={serviceData.name}
										width={96}
										height={96}
										className='rounded-lg w-24 h-24 border-2 border-gray-200 object-cover'
									/>
								) : (
									<div className='w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-200'>
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
												d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
											/>
										</svg>
									</div>
								)}
							</div>

							{/* Service Info */}
							<div className='flex-1 min-w-0'>
								<h2 className='text-xl font-semibold text-gray-900 mb-2'>
									{serviceData?.name || t('services.name')}
								</h2>
								<div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-4'>
									{serviceData?.price && (
										<div className='flex items-center gap-2 text-gray-600'>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
												/>
											</svg>
											<span className='text-sm font-medium'>
												<LocalizedCurrency amount={serviceData.price} />
											</span>
										</div>
									)}
									{serviceData?.imageUrls &&
										serviceData.imageUrls.length > 0 && (
											<div className='flex items-center gap-2 text-gray-600'>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
													/>
												</svg>
												<span className='text-sm'>
													{serviceData.imageUrls.length} {t('services.images')}
												</span>
											</div>
										)}
								</div>
								<div className='flex flex-wrap gap-2'>
									<span
										className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${
											serviceData?.isDeleted
												? 'bg-red-50 text-red-700 border border-red-200'
												: 'bg-green-50 text-green-700 border border-green-200'
										}`}
									>
										<div
											className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
												serviceData?.isDeleted ? 'bg-red-500' : 'bg-green-500'
											}`}
										/>
										{serviceData?.isDeleted
											? t('status.inactive')
											: t('status.active')}
									</span>
									<span className='inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200'>
										{t('services.service')}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Service Details */}
					<div className='bg-white rounded-xl border border-gray-200 p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							{t('services.information')}
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-500 mb-1'>
									{t('services.name')}
								</label>
								<EditableField<Service>
									name='name'
									value={serviceData?.name ?? ''}
									onChange={handleChange}
									editingField={editingField}
									handleFieldSave={handleFieldSave}
									toggleFieldEdit={toggleFieldEdit}
									className='text-gray-900'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-500 mb-1'>
									{t('services.price')}
								</label>
								<EditableField
									name='price'
									type='number'
									value={serviceData?.price ?? 0}
									onChange={handleChange}
									editingField={editingField}
									handleFieldSave={handleFieldSave}
									toggleFieldEdit={toggleFieldEdit}
									className='text-gray-900'
								/>
							</div>
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-500 mb-1'>
									{t('services.description')}
								</label>
								<EditableField
									name='description'
									type='textarea'
									value={
										serviceData?.description ?? t('services.noDescription')
									}
									onChange={handleChange}
									editingField={editingField}
									handleFieldSave={handleFieldSave}
									toggleFieldEdit={toggleFieldEdit}
									className='text-gray-900 leading-relaxed'
								/>
							</div>
						</div>
					</div>

					{/* Service Images */}
					<div className='bg-white rounded-xl border border-gray-200 p-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							{t('services.images')}
						</h3>
						<div className='space-y-4'>
							{serviceData?.imageUrls && serviceData.imageUrls.length > 0 ? (
								<div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'>
									{serviceData.imageUrls.map((img, index) => (
										<div
											key={index}
											className='relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors group'
										>
											<CldImage
												src={typeof img === 'string' ? img : img.url}
												alt={`Service image ${index + 1}`}
												width={120}
												height={120}
												className='object-cover w-full h-full'
											/>
											<button
												onClick={e => {
													e.stopPropagation()
													const imageId =
														typeof img === 'object' && img.id
															? img.id
															: undefined
													const imageUrl =
														typeof img === 'string' ? img : img.url
													handleRemoveImage(imageId || '', imageUrl)
												}}
												className='absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs'
												disabled={deleteMediaMutation.isPending}
											>
												×
											</button>
										</div>
									))}
								</div>
							) : (
								<div className='text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50'>
									<svg
										className='w-8 h-8 text-gray-400 mx-auto mb-2'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
									<p className='text-gray-500 text-sm'>
										{t('services.noImages')}
									</p>
								</div>
							)}

							<div className='flex items-center gap-3'>
								<CloudinaryButton
									text={
										serviceData?.imageUrls && serviceData.imageUrls.length > 0
											? t('services.addMoreImages')
											: t('services.uploadImages')
									}
									onUploaded={handleImageUpload}
									className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ServiceDetailPage
