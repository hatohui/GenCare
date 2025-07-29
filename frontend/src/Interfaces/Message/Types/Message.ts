export type Message = {
	id: string
	conversationId: string
	createdBy: string
	createdAt: string
	updatedBy?: string
	updatedAt?: string
	deletedAt?: string
	deletedBy?: string
	isDeleted: boolean
	content: string
}
