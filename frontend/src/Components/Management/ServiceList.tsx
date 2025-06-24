import React from 'react'
import ItemCard from './ItemCard'
import {
	GetServiceByPageAdminResponse,
	ServiceDTO,
} from '@/Interfaces/Service/Schemas/service'

const ServiceList = ({
	data,
	handleDelete,
	handleRestore,
}: {
	data: GetServiceByPageAdminResponse
	handleDelete: (id: string) => void
	handleRestore: (id: string, data: ServiceDTO) => void
}) => {
	return (
		<>
			<div className='flex-1 overflow-y-auto'>
				<div className='flex flex-col gap-3 px-2 py-1' role='list'>
					{data.services && data.services.length === 0 ? (
						<div className='w-full h-full center-all'>No data found</div>
					) : (
						data?.services.map((service, key) => (
							<ItemCard<ServiceDTO>
								id={service.id}
								delay={key}
								data={service}
								key={service.id}
								label={service.name}
								secondaryLabel={service.description}
								status={service.isDeleted ? 'FAILED' : 'SUCCESS'}
								thirdLabel={service.price.toString()}
								path='/dashboard/services/'
								handleDelete={handleDelete}
								isActive={service.isDeleted}
								handleRestore={handleRestore}
							/>
						))
					)}
				</div>
			</div>
		</>
	)
}

export default ServiceList
