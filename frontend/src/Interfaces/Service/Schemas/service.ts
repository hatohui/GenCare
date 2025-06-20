import { Service } from '../Types/Service'

//!Requests
export type GetServiceWithIdRequest = {
	id: string
}
// requires auth header
export type CreateServiceApiRequest = Omit<
	Service,
	'id' | 'updatedAt' | 'deletedAt' | 'isDeleted' | 'createdAt'
>
export type DeleteServiceApiRequest = {
	id: string
}

//! RESPONSES
export type GetServiceWithIdResponse = Service
export type CreateServiceApiResponse = Service
export type DeleteServiceApiResponse = Service
export type UpdateServiceApiResponse = Service

export type GetServiceByPageResponse = {
	totalCount: number
	services: Pick<
		Service,
		'id' | 'name' | 'description' | 'price' | 'imageUrls'
	>[]
}

export type GetServiceByPageAdminResponse = {
	totalCount: number
	services: Pick<
		Service,
		'id' | 'name' | 'description' | 'price' | 'imageUrls' | 'isDeleted'
	>[]
}
