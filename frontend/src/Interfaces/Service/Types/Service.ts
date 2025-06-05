export interface Service {
	id: string
	name: string
	description: string
	price: number
	createdAt: Date
	updatedAt: Date
	isDeleted: boolean
	imageUrl?: string
}
