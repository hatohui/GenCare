import z from 'zod/v4'

export interface Service {
	id: string
	name: string
	description: string
	price: number
	createdAt: Date
	updatedAt?: Date | null
	isDeleted: boolean
	deletedBy?: string | null
	createdBy?: string | null
	imageUrls?: Array<{ id: string; url: string }>
}

export const updateServiceSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().positive('Price must be greater than 0'),
	isDeleted: z.boolean(),
	deletedBy: z.string().optional().nullable(),
	createdBy: z.string().optional().nullable(),
	imageUrls: z
		.array(
			z.object({
				id: z.string(),
				url: z.url('Each image must be a valid URL'),
			})
		)
		.optional(),
})

export type UpdateServiceApiRequest = z.infer<typeof updateServiceSchema>
