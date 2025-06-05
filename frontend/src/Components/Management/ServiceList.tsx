import React from 'react'
import ItemCardHeader from './ItemCardHeader'
import ItemCard from './ItemCard'
import { GetServiceByPageResponse } from '@/Interfaces/Service/Schemas/service'

const ServiceList = ({
	data,
	handleDelete,
}: {
	data: GetServiceByPageResponse
	handleDelete: () => void
}) => {
	return (
		<>
			<ItemCardHeader
				label='Tên dịch vụ'
				secondaryLabel='Giá dịch vụ'
				thirdLabel='Ngày khởi tạo'
				fourthLabel='Tác vụ'
			/>

			<div className='flex-1 overflow-y-auto'>
				<div className='flex flex-col gap-3 px-2 py-1' role='list'>
					{data.payload && data.payload.length === 0 ? (
						<div className='w-full h-full center-all'>No data found</div>
					) : (
						data?.payload.map((service, key) => (
							<ItemCard
								id={service.id}
								delay={key}
								key={service.id}
								label={service.name}
								secondaryLabel={`${service.price}`}
								status={service.isDeleted ? 'FAILED' : 'SUCCESS'}
								date={service.description}
								path='/account/'
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
