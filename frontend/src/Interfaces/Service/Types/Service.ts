import z from 'zod/v4'

export interface Service {
	id: string
	name: string
	description: string
	price: number
	createdAt: Date
	updatedAt?: Date
	isDeleted: boolean
	imageUrls: {
		id?: string
		url: string
	}[]
}

export const updateServiceSchema = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	description: z.string().min(1, 'Description is required').optional(),
	price: z.coerce.number().positive('Price must be greater than 0').optional(),
	isDeleted: z.boolean().optional(),
	imageUrls: z.array(z.url('Each image must be a valid URL')).optional(),
})

export type UpdateServiceApiRequest = z.infer<typeof updateServiceSchema>
