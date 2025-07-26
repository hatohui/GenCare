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

export interface ViewConversationByIdResponse {
	conversationId: string
	staffId?: string
	memberId: string
	startAt: string
	status: boolean
}
