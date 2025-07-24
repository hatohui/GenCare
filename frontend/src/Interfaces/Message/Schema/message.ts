export type CreateMessageRequest = {
	conversationId: string
	content: string
	mediaUrls?: string[]
}

export type CreateMessageResponse = {
	id: string
	content: string
	createdAt: string
	createdBy: string
	mediaUrls: string[]
}
