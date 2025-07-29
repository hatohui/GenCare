import { CreateConversationRequest } from '@/Interfaces/Chat/Conversation'
import axiosInstance from '@/Utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import useToken from '@/Hooks/Auth/useToken'

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

export class ChatSignalRClient {
	private connection: signalR.HubConnection
	private receiveMessageCallback?: (msg: SignalRMessage) => void
	private deleteMessageCallback?: (messageId: string) => void
	private conversationEndedCallback?: (conversationId: string) => void

	constructor(conversationId: string) {
		const url = `https://api.gencare.site/hubs/chat?conversationId=${conversationId}`

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

		this.connection.on(
			'ConversationEnded',
			(data: { conversationId: string }) => {
				this.conversationEndedCallback?.(data.conversationId)
			}
		)

		// this.connection.on('JoinedConversation', (conversationId: string) => {})
		// this.connection.on('JoinedGroup', (group: string) => {})
	}

	async start(): Promise<void> {
		try {
			await this.connection.start()
		} catch (err) {
			console.error('SignalR connection failed:', err)
		}
	}

	async joinConversation(conversationId: string): Promise<void> {
		try {
			await this.connection.invoke('JoinConversation', conversationId)
		} catch (err) {
			console.error('Failed to join conversation:', err)
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
	}
}

const chatApi = {
	createConversation: (conversationData: CreateConversationRequest) =>
		axiosInstance.post('/conversations', conversationData),

	sendMessage: (data: SendMessageRequest) =>
		axiosInstance.post('/messages', data),

	deleteMessage: (messageId: string) =>
		axiosInstance.delete(`/messages/${messageId}`),

	getConnection: (conversationId: string, accessToken?: string) => {
		return new signalR.HubConnectionBuilder()
			.withUrl(
				`https://api.gencare.site/hubs/chat?conversationId=${conversationId}`,
				{ accessTokenFactory: () => accessToken || '' }
			)
			.build()
	},

	viewConversationById: (conversationId: string) =>
		axiosInstance.get(`/conversations/${conversationId}`).then(res => res.data),

	getAllConversations: () =>
		axiosInstance.get(`/conversations`).then(res => res.data.conversations),

	getUnassignedConversations: () =>
		axiosInstance
			.get('/conversations/pending')
			.then(res => res.data.conversations),

	getUserConversationHistory: () =>
		axiosInstance
			.get('/conversations/history')
			.then(res => res.data.conversations),

	getConsultantConversationHistory: () =>
		axiosInstance
			.get('/conversations/consultant/history')
			.then(res => res.data.conversations),

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
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (conversationData: CreateConversationRequest) =>
			chatApi.createConversation(conversationData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userConversationHistory'] })
			queryClient.invalidateQueries({
				queryKey: ['consultantConversationHistory'],
			})
		},
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

export const useConnection = (conversationId: string) => {
	const { accessToken } = useToken()
	return chatApi.getConnection(conversationId, accessToken || undefined)
}

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
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (conversationId: string) =>
			chatApi.endConversation(conversationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userConversationHistory'] })
			queryClient.invalidateQueries({
				queryKey: ['consultantConversationHistory'],
			})
		},
	})
}

export const useUserConversationHistory = () => {
	return useQuery({
		queryKey: ['userConversationHistory'],
		queryFn: chatApi.getUserConversationHistory,
	})
}

export const useConsultantConversationHistory = () => {
	return useQuery({
		queryKey: ['consultantConversationHistory'],
		queryFn: chatApi.getConsultantConversationHistory,
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
