'use client'

import { useServiceById, useUpdateService } from '@/Services/service-services'
import './style.css'
import { useEditableField } from '@/Hooks/Form/useEditableField'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'
import EditableField from '@/Components/Management/EditableField'
import ReturnButton from '@/Components/ReturnButton'
import {
	Service,
	UpdateServiceApiRequest,
	updateServiceSchema,
} from '@/Interfaces/Service/Types/Service'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { CldImage } from 'next-cloudinary'

const ServiceDetailPage = () => {
	const params = useParams()
	const serviceId = typeof params.id === 'string' ? params.id : undefined
	const updateServiceMutation = useUpdateService()
	const query = useServiceById(serviceId ?? '')

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
				imageUrls: updatedData.imageUrls,
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
		const updatedData = serviceData
			? {
					...serviceData,
					imageUrls: Array.from(
						new Set([...(serviceData.imageUrls ?? []), url])
					),
			  }
			: null

		if (updatedData) {
			setLocalData(updatedData)
			await onSave(updatedData)
		}
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
		<div className='container mx-auto bg-general min-h-screen'>
			<div className='flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8'>
				<ReturnButton />

				{/* Left Form */}
				<div className='w-full md:w-2/3 space-y-8'>
					<h1 className='text-3xl sm:text-4xl font-bold text-accent border-b-2 border-gray-200 pb-3'>
						Service Details
					</h1>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div className='flex flex-col space-y-2'>
							<label className='text-main font-medium text-sm sm:text-base'>
								Name
							</label>
							<EditableField<Service>
								name='name'
								value={serviceData.name ?? ''}
								onChange={handleChange}
								toggleFieldEdit={toggleFieldEdit}
								handleFieldSave={handleFieldSave}
								editingField={editingField}
								className='rounded-lg border-gray-300 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 transition-all'
							/>
						</div>

						<div className='flex flex-col space-y-2'>
							<label className='text-main font-medium text-sm sm:text-base'>
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
								className='rounded-lg border-gray-300 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 transition-all'
							/>
						</div>
					</div>

					<div className='flex flex-col space-y-2'>
						<label className='text-main font-medium text-sm sm:text-base'>
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
							className='rounded-lg border-gray-300 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50 transition-all min-h-[120px]'
						/>
					</div>

					<div className='flex flex-col space-y-4'>
						<p className='text-main font-medium text-sm sm:text-base'>Images</p>

						<CloudinaryButton
							className='bg-secondary text-white px-5 py-2.5 rounded-lg hover:bg-main transition-all font-medium text-sm sm:text-base'
							text='Upload Image'
							onUploaded={handleUpload}
						/>
					</div>
				</div>

				{/* Right Gallery Preview */}
				<div className='hidden md:block w-full md:w-1/3 max-w-sm space-y-4'>
					<h2 className='text-xl font-semibold text-main'>Image Preview</h2>
					<div className='grid grid-cols-2 gap-3'>
						{serviceData.imageUrls?.map((url, i) => (
							<div
								key={i}
								className='aspect-square overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
							>
								<CldImage
									className='w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out'
									src={url}
									width={1000}
									height={1000}
									sizes='100vw'
									alt={`preview-img-${i}`}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ServiceDetailPage
