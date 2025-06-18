'use client'
import StatusLight from '@/Components/StatusLight'
import { useServiceById } from '@/Services/service-services'
import './style.css'
import { useEditable } from '@/Hooks/Form/useEditable'
import { useQueryUIState } from '@/Hooks/UI/useQueryUIState'
import { useParams } from 'next/navigation'

const ServiceDetailPage = () => {
	const params = useParams()
	const serviceId = typeof params.id === 'string' ? params.id : undefined

	const query = useServiceById(serviceId ?? '')

	const {
		data: service,
		localData: serviceData,
		isEditing,
		handleChange,
		toggleEdit,
		handleSave,
	} = useEditable({
		query: query,
	})

	const queryUI = useQueryUIState({
		query: query,
	})

	return queryUI ? (
		queryUI
	) : (
		<div className='center-all h-full w-full'>
			<div className='flex flex-col min-w-2xl gap-4 p-4'>
				<div className='text-4xl font-semibold'>Service Details</div>
				<table className='w-full'>
					<tbody>
						<tr>
							<td className='p-2 font-semibold'>Name:</td>
							<td className='p-2'>
								<input
									name='name'
									type='text'
									value={serviceData?.name ?? ''}
									onChange={handleChange}
									readOnly={!isEditing}
									className='w-full p-2 bg-gray-100 rounded-md border-none read-only:bg-gray-300'
								/>
							</td>
						</tr>
						<tr>
							<td className='p-2 font-semibold'>Description:</td>
							<td className='p-2'>
								<textarea
									name='description'
									value={serviceData?.description ?? ''}
									onChange={handleChange}
									readOnly={!isEditing}
									className='w-full p-2 bg-gray-100 rounded-md border-none resize-none read-only:bg-gray-300'
								/>
							</td>
						</tr>
						<tr>
							<td className='p-2 font-semibold'>Price:</td>
							<td className='p-2'>
								<input
									name='price'
									type='text'
									value={
										serviceData?.price?.toLocaleString('en-US', {
											style: 'currency',
											currency: 'VND',
										}) ?? ''
									}
									onChange={handleChange}
									readOnly={!isEditing}
									className='w-full p-2 bg-gray-100 rounded-md border-none read-only:bg-gray-300'
								/>
							</td>
						</tr>
						<tr>
							<td className='p-2 font-semibold'>Created At:</td>
							<td className='p-2'>
								<input
									type='text'
									value={service?.createdAt?.toLocaleString() ?? ''}
									readOnly
									className='inactive-area'
								/>
							</td>
						</tr>
						<tr>
							<td className='p-2 font-semibold'>Updated At:</td>
							<td className='p-2'>
								<input
									type='text'
									value={service?.updatedAt?.toLocaleString() ?? 'N/A'}
									readOnly
									className='inactive-area'
								/>
							</td>
						</tr>
						<tr>
							<td className='p-2 font-semibold'>Status:</td>
							<td className='p-2 center-all gap-3'>
								<StatusLight
									status={service?.isDeleted ? 'INACTIVE' : 'ACTIVE'}
								/>
								<p>{service?.isDeleted ? 'Inactive' : 'Active'}</p>
							</td>
						</tr>
					</tbody>
				</table>
				{serviceData?.imageUrl && (
					<div className='mt-4'>
						<img
							src={serviceData?.imageUrl}
							alt=''
							className='rounded-lg shadow-lg'
						/>
					</div>
				)}
				{isEditing ? (
					<div className='flex gap-4'>
						<button
							className='bg-gray-500 px-4 py-2 rounded-md shadow-md hover:bg-gray-600'
							onClick={toggleEdit}
						>
							Return
						</button>
						<button
							className='bg-green-500 px-4 py-2 rounded-md shadow-md hover:bg-green-600'
							onClick={handleSave}
						>
							Save
						</button>
					</div>
				) : (
					<div className='flex gap-4'>
						<button
							className='bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600'
							onClick={toggleEdit}
						>
							Edit
						</button>
						<button
							className='bg-red-500 px-4 py-2 rounded-md shadow-md hover:bg-red-600'
							onClick={() => console.log('Delete button clicked')}
						>
							Delete
						</button>
						<button
							className='bg-green-500 px-4 py-2 rounded-md shadow-md hover:bg-green-600'
							onClick={() => console.log('Restore button clicked')}
						>
							Restore
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default ServiceDetailPage
