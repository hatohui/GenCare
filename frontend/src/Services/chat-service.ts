import { CreateConversationRequest } from '@/Interfaces/Chat/Conversation'
import axiosInstance from '@/Utils/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'

const chatApi = {
	createConversation: (conversationData: CreateConversationRequest) =>
		axiosInstance.post('/conversations', conversationData),

	getConnection: (conversationId: string) =>
		new signalR.HubConnectionBuilder()
			.withUrl(`/hubs/chat?conversationId=${conversationId}`)
			.build(),

	viewConversationById: (conversationId: string) =>
		axiosInstance.get(`/conversations/${conversationId}`).then(res => res.data),

	getAllConversations: () =>
		axiosInstance.get(`/conversations`).then(res => res.data),
}

export const useCreateConversation = () => {
	return useMutation({
		mutationFn: (conversationData: CreateConversationRequest) =>
			chatApi.createConversation(conversationData),
	})
}

export const useConnection = (conversationId: string) =>
	chatApi.getConnection(conversationId)

export const useAllConversations = () => {
	return useQuery({
		queryKey: ['allConversations'],
		queryFn: chatApi.getAllConversations,
	})
}

export default chatApi
