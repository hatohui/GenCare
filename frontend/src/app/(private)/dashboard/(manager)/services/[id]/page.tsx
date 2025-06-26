'use client'

import { useServiceById, useUpdateService } from '@/Services/service-services'
import './style.css'
import { useEditableField } from '@/Hooks/Form/useEditableField'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'
import EditableField from '@/Components/Management/EditableField'
import {
	Service,
	UpdateServiceApiRequest,
	updateServiceSchema,
} from '@/Interfaces/Service/Types/Service'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'

const ServiceDetailPage = () => {
	const params = useParams()
	const serviceId = typeof params.id === 'string' ? params.id : undefined
	const updateServiceMutation = useUpdateService()
	const query = useServiceById(serviceId ?? '')
	const router = useRouter()

	const {
		localData: serviceData,
		editingField,
		handleChange,
		toggleFieldEdit,
		handleFieldSave,
		setLocalData,
		onSave,
	} = useEditableField({
		query,
		onSave: async updatedData => {
			const updatedServiceDTO: UpdateServiceApiRequest = {
				name: updatedData.name,
				description: updatedData.description,
				price: updatedData.price,
				isDeleted: updatedData.isDeleted,
				imageUrls: updatedData.imageUrls?.map(image => image.url),
			}

			const result = updateServiceSchema.safeParse(updatedServiceDTO)

			if (result.success && serviceId) {
				await updateServiceMutation.mutateAsync({
					id: serviceId,
					data: result.data,
				})
			}
		},
	})

	const queryUI = useQueryUIState({
		query,
	})

	const handleUpload = async (url: string) => {
		if (!serviceData) return

		const updatedData = {
			...serviceData,
			imageUrls: [
				...new Set(
					(serviceData.imageUrls ?? []).map(image => ({
						id: image.id,
						url: image.url,
					}))
				),
				{ id: '', url },
			],
		}

		const updateServiceDTO = {
			...serviceData,
			imageUrls: [
				{
					id: '',
					url,
				},
			],
		}

		setLocalData(updatedData)
		await onSave(updateServiceDTO)
	}

	if (queryUI) return queryUI

	if (!serviceData) {
		return (
			<div className='flex justify-center items-center h-screen bg-general text-main'>
				<div className='text-lg font-medium animate-pulse'>
					No service data available...
				</div>
			</div>
		)
	}

	console.log(serviceData)

	return (
		<div>
			<div className='max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 px-6 sm:px-10 py-8'>
				{/* Back Button */}
				<button
					onClick={() => router.back()}
					className='mb-3 flex items-center font-medium text-sm'
				>
					<span className='text-lg mr-1'>←</span> Back
				</button>

				<div className='flex justify-around'>
					<div>
						{/* Title */}
						<h1 className='text-4xl font-bold text-accent border-b pb-4 mb-6'>
							Service Details
						</h1>

						<div className='flex flex-col md:flex-row gap-10'>
							{/* Left Side: Info Form */}
							<div className='space-y-6'>
								{/* Name & Price */}
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
									<div className='flex flex-col space-y-1'>
										<label className='text-sm font-medium text-main'>
											Name
										</label>
										<EditableField<Service>
											name='name'
											value={serviceData.name ?? ''}
											onChange={handleChange}
											toggleFieldEdit={toggleFieldEdit}
											handleFieldSave={handleFieldSave}
											editingField={editingField}
										/>
									</div>

									<div className='flex flex-col space-y-1'>
										<label className='text-sm font-medium text-main'>
											Price
										</label>
										<EditableField
											name='price'
											type='number'
											value={serviceData.price ?? 0}
											onChange={handleChange}
											toggleFieldEdit={toggleFieldEdit}
											handleFieldSave={handleFieldSave}
											editingField={editingField}
										/>
									</div>
								</div>

								{/* Description */}
								<div className='flex flex-col space-y-1'>
									<label className='text-sm font-medium text-main'>
										Description
									</label>
									<EditableField
										name='description'
										type='textarea'
										value={serviceData.description ?? ''}
										onChange={handleChange}
										toggleFieldEdit={toggleFieldEdit}
										handleFieldSave={handleFieldSave}
										editingField={editingField}
									/>
								</div>

								{/* Upload Button */}
								<div className='flex flex-col space-y-2'>
									<label className='text-sm font-medium text-main'>
										Images
									</label>
									<CloudinaryButton
										className='w-fit bg-accent text-white font-medium px-4 py-2 rounded-md hover:brightness-110 transition-all'
										text='Upload Image'
										onUploaded={handleUpload}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='w-1 main-gradient-bg' />
					{/* Right Side: Image Gallery */}
					<div className='space-y-4 px-5'>
						<h2 className='text-lg font-semibold text-main border-b pb-1'>
							Image Preview
						</h2>

						<div className='grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1'>
							{serviceData.imageUrls?.map((url, i) => (
								<div
									key={i}
									className='relative group aspect-square overflow-hidden rounded-xl border border-gray-200 shadow-md transition-shadow hover:shadow-xl'
								>
									<CldImage
										src={url.url}
										alt={`preview-img-${i}`}
										width={800}
										height={800}
										sizes='100vw'
										className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
									/>
									<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all' />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ServiceDetailPage
