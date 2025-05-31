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
export type EditServiceApiRequest = Omit<
	Service,
	'id' | 'createdAt' | 'updatedAt'
>

//! RESPONSES
export type GetServiceWithIdResponse = Service
export type CreateServiceApiResponse = Service
export type DeleteServiceApiResponse = Service
export type UpdateServiceApiResponse = Service
export type GetServiceApiByPageResponse = {
	page: number
	count: number
	payload: Pick<Service, 'id' | 'name' | 'description' | 'price'>[]
}
