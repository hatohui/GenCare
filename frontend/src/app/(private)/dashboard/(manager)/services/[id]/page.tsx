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
import Image from 'next/image'
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
			// Convert new image URLs to the expected format
			const imageUrlsFormatted =
				newImageUrls.length > 0
					? newImageUrls.map((url, index) => ({ id: `new-${index}`, url }))
					: updatedData.imageUrls

			const updatedServiceDTO: UpdateServiceApiRequest = {
				name: updatedData.name,
				description: updatedData.description,
				price: updatedData.price,
				isDeleted: updatedData.isDeleted,
				imageUrls: imageUrlsFormatted,
			}

			const result = updateServiceSchema.safeParse(updatedServiceDTO)

			if (!result.success) {
			} else {
				updateServiceMutation.mutate(
					{ id: serviceId ?? '', data: result.data },
					{
						onSuccess: () => {},
						onError: () => {},
					}
				)
			}
		},
	})

	const queryUI = useQueryUIState({
		query: query,
	})

	const handleImageUpload = (url: string) => {
		setNewImageUrls(prev => [...prev, url])
	}

	return queryUI ? (
		queryUI
	) : (
		<motion.div
			className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className='max-w-4xl mx-auto'>
				<ReturnButton />

				<motion.div
					className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-6'
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					{/* Header */}
					<div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6'>
						<h1 className='text-2xl font-bold text-white mb-2'>
							Chi tiết dịch vụ
						</h1>
						<p className='text-blue-100 text-sm'>
							Quản lý thông tin dịch vụ của hệ thống
						</p>
					</div>

					<div className='p-8'>
						{/* Service Image Section */}
						<motion.div
							className='mb-8 text-center'
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<div className='relative inline-block'>
								{serviceData?.imageUrls && serviceData.imageUrls.length > 0 ? (
									<div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
										{serviceData.imageUrls.map((img, index) => (
											<div
												key={index}
												className='relative w-32 h-32 rounded-xl overflow-hidden shadow-md'
											>
												<Image
													src={typeof img === 'string' ? img : img.url}
													alt={`Service image ${index + 1}`}
													fill
													className='object-cover'
													sizes='128px'
												/>
											</div>
										))}
									</div>
								) : (
									<div className='w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-inner'>
										<svg
											className='w-12 h-12 text-gray-400'
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
								)}

								<CloudinaryButton
									text={
										serviceData?.imageUrls && serviceData.imageUrls.length > 0
											? 'Thay đổi hình ảnh'
											: 'Tải lên hình ảnh'
									}
									onUploaded={handleImageUpload}
									className='px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors shadow-md'
								/>
							</div>
						</motion.div>

						{/* Service Information */}
						<div className='grid gap-6'>
							<motion.div
								className='group'
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								<label className='block text-sm font-semibold text-slate-700 mb-2'>
									Tên dịch vụ
								</label>
								<div className='bg-slate-50 border border-slate-200 rounded-lg p-4 group-hover:border-blue-300 transition-colors'>
									<EditableField<Service>
										name='name'
										value={serviceData?.name ?? ''}
										onChange={handleChange}
										editingField={editingField}
										handleFieldSave={handleFieldSave}
										toggleFieldEdit={toggleFieldEdit}
									/>
								</div>
							</motion.div>

							<motion.div
								className='group'
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<label className='block text-sm font-semibold text-slate-700 mb-2'>
									Giá dịch vụ
								</label>
								<div className='bg-slate-50 border border-slate-200 rounded-lg p-4 group-hover:border-blue-300 transition-colors'>
									<EditableField
										name='price'
										type='number'
										value={
											editingField === 'price'
												? serviceData?.price?.toString() ?? 'Chưa có thông tin'
												: new Intl.NumberFormat('vi-VN', {
														style: 'currency',
														currency: 'VND',
												  }).format(serviceData?.price ?? 0)
										}
										onChange={handleChange}
										editingField={editingField}
										handleFieldSave={handleFieldSave}
										toggleFieldEdit={toggleFieldEdit}
									/>
								</div>
							</motion.div>

							<motion.div
								className='group'
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.5 }}
							>
								<label className='block text-sm font-semibold text-slate-700 mb-2'>
									Mô tả dịch vụ
								</label>
								<div className='bg-slate-50 border border-slate-200 rounded-lg p-4 group-hover:border-blue-300 transition-colors'>
									<EditableField
										name='description'
										type='textarea'
										value={serviceData?.description ?? ''}
										onChange={handleChange}
										editingField={editingField}
										handleFieldSave={handleFieldSave}
										toggleFieldEdit={toggleFieldEdit}
									/>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	)
}

export default ServiceDetailPage
