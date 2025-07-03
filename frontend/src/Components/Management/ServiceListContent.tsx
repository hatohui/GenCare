'use client'

import React from 'react'
import ItemCard from './ItemCard'
import { ServiceDTO } from '@/Interfaces/Service/Schemas/service'

interface ServiceListProps {
	services: ServiceDTO[]
	isLoading: boolean
	isError: boolean
	isFetching: boolean
	handleDelete: (id: string) => void
	handleRestore: (id: string, data: ServiceDTO) => void
	handleUpdate?: (id: string, data: any) => void
}

const ServiceListContent = ({
	services,
	isLoading,
	isError,
	isFetching,
	handleDelete,
	handleRestore,
	handleUpdate,
}: ServiceListProps) => {
	// Show loading state
	if (isFetching || isLoading) {
		return (
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='text-center'>
					<div className='animate-pulse text-lg font-medium text-slate-700'>
						Đang tải dữ liệu...
					</div>
				</div>
			</div>
		)
	}

	// Show error state
	if (isError) {
		return (
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='text-center text-red-500 font-medium'>
					Internal Server Error.
				</div>
			</div>
		)
	}

	// Show empty state
	if (services.length === 0) {
		return (
			<div className='flex-1 flex items-center justify-center pt-20'>
				<div className='text-center text-slate-500'>No data found.</div>
			</div>
		)
	}

	// Show content
	return (
		<div className='flex-1 flex flex-col min-h-0'>
			<div
				className='flex-1 overflow-y-auto min-h-0'
				style={{
					scrollbarWidth: 'thin',
					scrollbarColor: 'rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1)',
				}}
			>
				<div className='flex flex-col gap-2 px-4 py-2' role='list'>
					{services.map((service, key) => (
						<ItemCard<ServiceDTO>
							id={service.id}
							data={service}
							delay={key}
							key={service.id}
							label={service.name}
							secondaryLabel={service.description}
							status={service.isDeleted ? 'FAILED' : 'SUCCESS'}
							thirdLabel={`${service.price.toLocaleString('vi-VN')} VND`}
							fourthLabel=''
							path='/dashboard/services/'
							handleDelete={handleDelete}
							handleRestore={handleRestore}
							onUpdate={handleUpdate}
							isActive={service.isDeleted}
							enableModal={true}
							modalType='service'
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default ServiceListContent
