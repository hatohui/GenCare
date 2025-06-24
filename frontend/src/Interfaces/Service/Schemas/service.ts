import { Service } from '../Types/Service'
import { z } from 'zod'

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

export type ServiceDTO = Pick<
	Service,
	'id' | 'name' | 'description' | 'price' | 'imageUrls' | 'isDeleted'
>

export type GetServiceByPageAdminResponse = {
	totalCount: number
	services: ServiceDTO[]
}

export const serviceSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().positive('Price must be greater than 0'),
})

export type ServiceFormSchema = z.infer<typeof serviceSchema>
