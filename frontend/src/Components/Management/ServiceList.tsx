import React from 'react'
import ItemCard from './ItemCard'
import { GetServiceByPageAdminResponse } from '@/Interfaces/Service/Schemas/service'

const ServiceList = ({
	data,
	handleDelete,
}: {
	data: GetServiceByPageAdminResponse
	handleDelete: (id: string) => void
}) => {
	return (
		<>
			<div className='flex-1 overflow-y-auto'>
				<div className='flex flex-col gap-3 px-2 py-1' role='list'>
					{data.services && data.services.length === 0 ? (
						<div className='w-full h-full center-all'>No data found</div>
					) : (
						data?.services.map((service, key) => (
							<ItemCard
								id={service.id}
								delay={key}
								key={service.id}
								label={service.name}
								secondaryLabel={service.description}
								status={service.isDeleted ? 'FAILED' : 'SUCCESS'}
								thirdLabel={service.price.toString()}
								path='/dashboard/services/'
								handleDelete={handleDelete}
							/>
						))
					)}
				</div>
			</div>
		</>
	)
}

export default ServiceList
