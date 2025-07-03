'use client'
import { useServiceById, useUpdateService } from '@/Services/service-services'
import './style.css'
import { useEditableField } from '@/Hooks/Form/useEditable'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'
import EditableField from '@/Components/Management/EditableField'
import ReturnButton from '@/Components/ReturnButton'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { motion } from 'motion/react'
import { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { useDeleteMedia } from '@/Services/media-service'
import { toast } from 'react-hot-toast'
import {
	Service,
	UpdateServiceApiRequest,
	updateServiceSchema,
} from '@/Interfaces/Service/Types/Service'

const ServiceDetailPage = () => {
	const params = useParams()
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
			const allImageUrls = [...existingImageUrls, ...newImageUrls]

			const updatedServiceDTO: UpdateServiceApiRequest = {
				name: updatedData.name,
				description: updatedData.description,
				price: updatedData.price,
				isDeleted: updatedData.isDeleted,
				imageUrls: allImageUrls,
			}

			const result = updateServiceSchema.safeParse(updatedServiceDTO)

			if (!result.success) {
				console.error('Validation failed:', result.error)
				toast.error('Validation failed. Please check your input.')
			} else {
				updateServiceMutation.mutate(
					{ id: serviceId ?? '', data: result.data },
					{
						onSuccess: () => {
							setNewImageUrls([])
						},
						onError: error => {
							console.error('Update failed:', error)
						},
					}
				)
			}
		},
	})

	const queryUI = useQueryUIState({
		query: query,
	})

	const handleImageUpload = (url: string, publicId: string) => {
		console.log('🖼️ Service detail image uploaded:', { url, publicId })
		setNewImageUrls(prev => [...prev, url])
	}

	const handleRemoveImage = (imageId: string, imageUrl: string) => {
		if (imageId) {
			deleteMediaMutation.mutate(imageId, {
				onSuccess: () => {
					toast.success('Image removed successfully')
					query.refetch()
				},
				onError: () => {
					toast.error('Failed to remove image')
				},
			})
		} else {
			setNewImageUrls(prev => prev.filter(url => url !== imageUrl))
			toast.success('Image removed')
		}
	}

	return queryUI ? (
		queryUI
	) : (
		<motion.div
			className='min-h-screen bg-general'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className='bg-gradient-to-r from-main to-secondary text-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-8'>
					<div className='flex items-center gap-6'>
						<ReturnButton />
						<div className='flex-1'>
							<h1 className='text-3xl font-bold text-white'>
								Chi tiết dịch vụ
							</h1>
							<p className='text-white/80 mt-2 text-lg'>
								Quản lý thông tin và cài đặt dịch vụ
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-7xl mx-auto px-6 py-8'>
				<div className='space-y-8'>
					{/* Service Images Section */}
					<motion.div
						className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<div className='px-8 py-6 bg-gradient-to-r from-main/10 to-secondary/10 border-b border-gray-100'>
							<h2 className='text-xl font-bold text-gray-800 flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-main to-secondary rounded-[12px] flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-white'
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
								</div>
								Hình ảnh dịch vụ
							</h2>
						</div>
						<div className='p-8'>
							<div className='flex flex-col items-center space-y-8'>
								{' '}
								{serviceData?.imageUrls && serviceData.imageUrls.length > 0 ? (
									<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full'>
										{serviceData.imageUrls.map((img, index) => (
											<motion.div
												key={index}
												className='relative aspect-square rounded-[16px] overflow-hidden shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-main hover:border-opacity-30 transition-all duration-300 group'
												whileHover={{ scale: 1.02, y: -2 }}
												transition={{ duration: 0.2 }}
											>
												<CldImage
													src={typeof img === 'string' ? img : img.url}
													alt={`Service image ${index + 1}`}
													width={200}
													height={200}
													className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
												/>
												<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

												{/* Delete Button */}
												<motion.button
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
													className='absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 z-10'
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.95 }}
													disabled={deleteMediaMutation.isPending}
												>
													{deleteMediaMutation.isPending ? (
														<svg
															className='w-4 h-4 animate-spin'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
															/>
														</svg>
													) : (
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
																d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
															/>
														</svg>
													)}
												</motion.button>
											</motion.div>
										))}
									</div>
								) : (
									<div className='flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-[16px] w-full bg-gradient-to-br from-gray-50 to-gray-100'>
										<div className='w-20 h-20 bg-gradient-to-br from-main/20 to-secondary/20 rounded-[16px] flex items-center justify-center mb-6'>
											<svg
												className='w-10 h-10 text-gray-400'
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
										</div>
										<p className='text-gray-600 text-lg font-semibold mb-2'>
											Chưa có hình ảnh
										</p>
										<p className='text-gray-400 text-sm'>
											Tải lên hình ảnh để giới thiệu dịch vụ của bạn
										</p>
									</div>
								)}
								<CloudinaryButton
									text={
										serviceData?.imageUrls && serviceData.imageUrls.length > 0
											? 'Thêm hình ảnh'
											: 'Tải lên hình ảnh'
									}
									onUploaded={handleImageUpload}
									className='px-8 py-4 bg-gradient-to-r from-main to-secondary hover:from-secondary hover:to-main text-white rounded-[12px] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
								/>
								{/* Show new images that will be added */}
								{newImageUrls.length > 0 && (
									<div className='w-full'>
										<div className='flex items-center gap-3 mb-6'>
											<div className='w-8 h-8 bg-gradient-to-br from-accent/20 to-accent/30 rounded-[8px] flex items-center justify-center'>
												<svg
													className='w-4 h-4 text-accent'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M12 6v6m0 0v6m0-6h6m-6 0H6'
													/>
												</svg>
											</div>
											<p className='text-base font-semibold text-accent'>
												Hình ảnh mới sẽ được thêm:
											</p>
										</div>{' '}
										<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
											{newImageUrls.map((url, index) => (
												<motion.div
													key={index}
													className='relative aspect-square rounded-[16px] overflow-hidden shadow-lg border-2 border-accent/30 hover:shadow-xl transition-all duration-300 group'
													whileHover={{ scale: 1.02, y: -2 }}
													transition={{ duration: 0.2 }}
												>
													<CldImage
														src={url}
														alt={`New image ${index + 1}`}
														width={200}
														height={200}
														className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
													/>
													<div className='absolute top-3 right-3 bg-gradient-to-r from-accent to-accent/80 text-white rounded-[8px] w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg'>
														+
													</div>
													<div className='absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

													{/* Delete Button for New Images */}
													<motion.button
														onClick={e => {
															e.stopPropagation()
															handleRemoveImage('', url)
														}}
														className='absolute top-3 left-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 z-10'
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.95 }}
													>
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
																d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
															/>
														</svg>
													</motion.button>
												</motion.div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</motion.div>

					{/* Service Information */}
					<motion.div
						className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<div className='px-8 py-6 bg-gradient-to-r from-secondary/10 to-main/10 border-b border-gray-100'>
							<h2 className='text-xl font-bold text-gray-800 flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-secondary to-main rounded-[12px] flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>
								Thông tin dịch vụ
							</h2>
						</div>
						<div className='p-8'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
								{/* Service Name */}
								<div className='space-y-3'>
									<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide'>
										Tên dịch vụ
									</label>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<EditableField<Service>
											name='name'
											value={serviceData?.name ?? ''}
											onChange={handleChange}
											editingField={editingField}
											handleFieldSave={handleFieldSave}
											toggleFieldEdit={toggleFieldEdit}
											className='w-full'
										/>
									</div>
								</div>

								{/* Service Price */}
								<div className='space-y-3'>
									<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide'>
										Giá dịch vụ (VND)
									</label>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<EditableField
											name='price'
											type='number'
											value={serviceData?.price ?? 0}
											onChange={handleChange}
											editingField={editingField}
											handleFieldSave={handleFieldSave}
											toggleFieldEdit={toggleFieldEdit}
											className='w-full'
										/>
										{editingField !== 'price' && serviceData?.price && (
											<div className='mt-3 p-3 bg-gradient-to-r from-main/10 to-secondary/10 rounded-[8px] border border-main/20'>
												<p className='text-sm font-semibold text-gray-700'>
													Định dạng:{' '}
													<span className='text-main'>
														{new Intl.NumberFormat('vi-VN', {
															style: 'currency',
															currency: 'VND',
														}).format(serviceData.price)}
													</span>
												</p>
											</div>
										)}
									</div>
								</div>

								{/* Service Description */}
								<div className='lg:col-span-2 space-y-3'>
									<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide'>
										Mô tả dịch vụ
									</label>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<EditableField
											name='description'
											type='textarea'
											value={serviceData?.description ?? ''}
											onChange={handleChange}
											editingField={editingField}
											handleFieldSave={handleFieldSave}
											toggleFieldEdit={toggleFieldEdit}
											className='w-full'
										/>
									</div>
								</div>

								{/* Service Status */}
								{serviceData && (
									<div className='lg:col-span-2 space-y-3'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide'>
											Trạng thái
										</label>
										<div className='flex items-center space-x-4'>
											<div
												className={`inline-flex items-center px-6 py-3 rounded-[12px] text-sm font-bold shadow-md ${
													serviceData.isDeleted
														? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300'
														: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300'
												}`}
											>
												<div
													className={`w-3 h-3 rounded-full mr-3 shadow-sm ${
														serviceData.isDeleted
															? 'bg-red-500'
															: 'bg-green-500'
													}`}
												/>
												{serviceData.isDeleted
													? 'Không hoạt động'
													: 'Đang hoạt động'}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}

export default ServiceDetailPage
