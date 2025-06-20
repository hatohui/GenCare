'use client'
import { useServiceById, useUpdateService } from '@/Services/service-services'
import './style.css'
import { useEditableField } from '@/Hooks/Form/useEditable'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'
import EditableField from '@/Components/Management/EditableField'
import ReturnButton from '@/Components/ReturnButton'
import {
	Service,
	UpdateServiceApiRequest,
	updateServiceSchema,
} from '@/Interfaces/Service/Types/Service'

const ServiceDetailPage = () => {
	const params = useParams()
	const serviceId = typeof params.id === 'string' ? params.id : undefined
	const updateServiceMutation = useUpdateService(serviceId ?? '')
	const query = useServiceById(serviceId ?? '')

	const {
		localData: serviceData,
		editingField,
		handleChange,
		toggleFieldEdit,
		handleFieldSave,
	} = useEditableField({
		query: query,
		onSave: updatedData => {
			const updatedServiceDTO: UpdateServiceApiRequest = {
				name: updatedData.name,
				description: updatedData.description,
				price: updatedData.price,
				isDeleted: updatedData.isDeleted,
				imageUrls: updatedData.imageUrls,
			}

			const result = updateServiceSchema.safeParse(updatedServiceDTO)

			if (!result.success) {
			} else {
				updateServiceMutation.mutate(result.data, {
					onSuccess: () => {},
					onError: () => {},
				})
			}
		},
	})

	const queryUI = useQueryUIState({
		query: query,
	})

	return queryUI ? (
		queryUI
	) : (
		<div className='flex justify-center relative h-full bg-general shadow-2xl border-2 border-gray-500 rounded'>
			<ReturnButton />

			<div className='flex items-center h-full flex-col gap-4'>
				<div className='flex justify-between border-b-2' />

				<div className='text-4xl font-semibold'>Service Details</div>
				<div>
					<div className='table-row'>
						<label className='table-label'>Name:</label>
						<div className='table-data'>
							<EditableField<Service>
								name='name'
								value={serviceData?.name ?? ''}
								onChange={handleChange}
								editingField={editingField}
								handleFieldSave={handleFieldSave}
								toggleFieldEdit={toggleFieldEdit}
							/>
						</div>
					</div>
					<div className='table-row'>
						<label className='table-label'>Price:</label>
						<div className='table-data'>
							<EditableField
								name='price'
								type='number'
								value={
									editingField === 'price'
										? serviceData?.price?.toString() ?? ''
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
					</div>
					<div className='table-row'>
						<label className='table-label align-top'>Description:</label>
						<div className='table-data'>
							<EditableField
								name='description'
								className=''
								type='textarea'
								value={serviceData?.description ?? ''}
								onChange={handleChange}
								editingField={editingField}
								handleFieldSave={handleFieldSave}
								toggleFieldEdit={toggleFieldEdit}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ServiceDetailPage
