export interface CreateConversationRequest {
	memberId: string
	firstMessage: string
	mediaUrls?: string[]
}

export interface CreateConversationResponse {
	conversationId: string
	messageId: string
	content: string
	createdAt: string
}
