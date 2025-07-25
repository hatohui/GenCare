import { CreateConversationRequest } from '@/Interfaces/Chat/Conversation'
import axiosInstance from '@/Utils/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import { DEFAULT_API_URL } from '@/Constants/API'

// ==== Interfaces ====
export interface MediaItem {
	url: string
	type: string
}

export interface SignalRMessage {
	messageId: string
	content: string
	createdBy: string
	createdAt: string
	media: MediaItem[]
}

export interface SendMessageRequest {
	conversationId: string
	content: string
	mediaUrls?: string[]
}

// ==== SignalR Client ====
export class ChatSignalRClient {
	private connection: signalR.HubConnection
	private token: string
	private receiveMessageCallback?: (msg: SignalRMessage) => void
	private deleteMessageCallback?: (messageId: string) => void
	private conversationEndedCallback?: (conversationId: string) => void

	constructor(token: string, conversationId: string) {
		this.token = token

		// const url = `https://api.gencare.site/hubs/chat?conversationId=${conversationId}&access_token=${token}`
		const url = `http://localhost:8080/hubs/chat?conversationId=${conversationId}&access_token=${token}`

		this.connection = new signalR.HubConnectionBuilder()
			.withUrl(url)
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()

		this.registerEvents()
	}

	private registerEvents(): void {
		this.connection.on('ReceiveMessage', (message: SignalRMessage) => {
			this.receiveMessageCallback?.(message)
		})

		this.connection.on('DeleteMessage', (data: { messageId: string }) => {
			this.deleteMessageCallback?.(data.messageId)
		})

		this.connection.on('ConversationEnded', (data: { conversationId: string }) => {
			console.log('❌ Conversation ended:', data.conversationId)
			this.conversationEndedCallback?.(data.conversationId)
		})

		this.connection.on('JoinedConversation', (conversationId: string) => {
			console.log('✅ Joined conversation:', conversationId)
		})

		this.connection.on('JoinedGroup', (group: string) => {
			console.log('✅ Joined group:', group)
		})
	}

	async start(): Promise<void> {
		try {
			await this.connection.start()
			console.log('🔌 SignalR connected')
		} catch (err) {
			console.error('❌ SignalR connection failed:', err)
		}
	}

	async joinConversation(conversationId: string): Promise<void> {
		try {
			await this.connection.invoke('JoinConversation', conversationId)
		} catch (err) {
			console.error('❌ Failed to join conversation:', err)
		}
	}

	onReceiveMessage(callback: (msg: SignalRMessage) => void): void {
		this.receiveMessageCallback = callback
	}

	onDeleteMessage(callback: (messageId: string) => void): void {
		this.deleteMessageCallback = callback
	}

	onConversationEnded(callback: (conversationId: string) => void): void {
		this.conversationEndedCallback = callback
	}

	async stop(): Promise<void> {
		await this.connection.stop()
		console.log('🛑 SignalR disconnected')
	}
}

const chatApi = {
	createConversation: (conversationData: CreateConversationRequest) =>
		axiosInstance.post('/conversations', conversationData),

	sendMessage: (data: SendMessageRequest) =>
		axiosInstance.post('/messages', data),

	deleteMessage: (messageId: string) =>
		axiosInstance.delete(`/messages/${messageId}`),

	getConnection: (conversationId: string) =>
		new signalR.HubConnectionBuilder()
			.withUrl(
				`http://localhost:8080/hubs/chat?conversationId=${conversationId}`
			)
			.build(),

	viewConversationById: (conversationId: string) =>
		axiosInstance.get(`/conversations/${conversationId}`).then(res => res.data),

	getAllConversations: () =>
		axiosInstance.get(`/conversations`).then(res => res.data),

	getUnassignedConversations: () =>
		axiosInstance
			.get('/conversations/pending')
			.then(res => res.data.conversations),

	getUserConversationHistory: () =>
		axiosInstance.get('/conversations/history').then(res => res.data),

	joinConversationAsConsultant: (conversationId: string) =>
		axiosInstance.post(`/conversations/assign/${conversationId}`),

	endConversation: (conversationId: string) =>
		axiosInstance.post(`/conversations/${conversationId}/end`),

	getMessagesByConversation: (conversationId: string) =>
		axiosInstance
			.get(`/messages/conversation/${conversationId}`)
			.then(res => res.data),
}

export const useCreateConversation = () => {
	return useMutation({
		mutationFn: (conversationData: CreateConversationRequest) =>
			chatApi.createConversation(conversationData),
	})
}

export const useSendMessage = () => {
	return useMutation({
		mutationFn: (data: SendMessageRequest) => chatApi.sendMessage(data),
	})
}

export const useDeleteMessage = () => {
	return useMutation({
		mutationFn: (messageId: string) => chatApi.deleteMessage(messageId),
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

export const useUnassignedConversations = () => {
	return useQuery({
		queryKey: ['unassignedConversations'],
		queryFn: chatApi.getUnassignedConversations,
		refetchInterval: 5000, // Refetch every 5 seconds
	})
}

export const useJoinConversationAsConsultant = () => {
	return useMutation({
		mutationFn: (conversationId: string) =>
			chatApi.joinConversationAsConsultant(conversationId),
	})
}

export const useEndConversation = () => {
	return useMutation({
		mutationFn: (conversationId: string) =>
			chatApi.endConversation(conversationId),
	})
}

export const useUserConversationHistory = () => {
	return useQuery({
		queryKey: ['userConversationHistory'],
		queryFn: chatApi.getUserConversationHistory,
	})
}

export const useMessagesByConversation = (conversationId: string) => {
	return useQuery({
		queryKey: ['messages', conversationId],
		queryFn: () => chatApi.getMessagesByConversation(conversationId),
		enabled: !!conversationId,
	})
}

export default chatApi
