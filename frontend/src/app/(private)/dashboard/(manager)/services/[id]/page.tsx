'use client'
import {
	useDeleteService,
	useServiceById,
	useUpdateService,
} from '@/Services/service-services'
import './style.css'
import { useEditableField } from '@/Hooks/Form/useEditable'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'
import EditableField from '@/Components/Management/EditableField'
import { TrashCanSVG } from '@/Components/SVGs'

const ServiceDetailPage = () => {
	const params = useParams()
	const serviceId = typeof params.id === 'string' ? params.id : undefined

	const updateServiceMutation = useUpdateService(serviceId ?? '')
	const deleteService = useDeleteService(serviceId ?? '')

	const query = useServiceById(serviceId ?? '')

	const {
		localData: serviceData,
		editingField,
		handleChange,
		toggleFieldEdit,
		handleFieldSave,
	} = useEditableField({
		query: query,
		onSave: updatedData => updateServiceMutation.mutate(updatedData),
	})

	const queryUI = useQueryUIState({
		query: query,
	})

	return queryUI ? (
		queryUI
	) : (
		<div className='flex justify-center p-6 m-auto h-[90%] bg-general shadow-2xl border-2 border-gray-500 rounded w-[80%]'>
			<div className='flex flex-col gap-4 w-[80%]'>
				<div className='flex justify-between border-b-2 '>
					<button
						id={`delete_${serviceId}`}
						className='flex items-center gap-1 px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md'
						onClick={() => console.log('clicked')}
					>
						<label className='text-sm font-semibold'>Delete</label>
						<TrashCanSVG className='w-5 h-5' />
					</button>
				</div>

				<div className='text-4xl font-semibold'>Service Details</div>
				<div>
					<div className='table-row'>
						<label className='table-label'>Name:</label>
						<div className='table-data'>
							<EditableField
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
