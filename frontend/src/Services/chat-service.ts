import { CreateConversationRequest } from '@/Interfaces/Chat/Conversation'
import axiosInstance from '@/Utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as signalR from '@microsoft/signalr'
import ConnectionHealthMonitor from '@/Utils/Chat/ConnectionHealthMonitor'

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
	private isStarted = false
	private isDestroyed = false
	private healthMonitor?: ConnectionHealthMonitor
	private healthChangeCallback?: (isHealthy: boolean) => void

	constructor(conversationId: string, accessToken?: string) {
		const url = `https://api.gencare.site/hubs/chat?conversationId=${conversationId}`

		this.connection = new signalR.HubConnectionBuilder()
			.withUrl(url, {
				accessTokenFactory: () => accessToken || '',
			})
			.withAutomaticReconnect({
				nextRetryDelayInMilliseconds: retryContext => {
					// Exponential backoff with max 30 seconds
					const delay = Math.min(
						1000 * Math.pow(2, retryContext.previousRetryCount),
						30000
					)
					console.log(
						`SignalR reconnect attempt ${
							retryContext.previousRetryCount + 1
						}, delay: ${delay}ms`
					)
					return delay
				},
			})
			.configureLogging(signalR.LogLevel.Warning) // Reduce logging to warnings only
			.build()

		this.healthMonitor = new ConnectionHealthMonitor(this.connection)
		this.registerEvents()
	}

	private registerEvents(): void {
		this.connection.on('ReceiveMessage', (message: SignalRMessage) => {
			if (!this.isDestroyed) {
				this.receiveMessageCallback?.(message)
			}
		})

		this.connection.on('DeleteMessage', (data: { messageId: string }) => {
			if (!this.isDestroyed) {
				this.deleteMessageCallback?.(data.messageId)
			}
		})

		this.connection.on(
			'ConversationEnded',
			(data: { conversationId: string }) => {
				if (!this.isDestroyed) {
					this.conversationEndedCallback?.(data.conversationId)
				}
			}
		)

		// Connection state handlers
		this.connection.onclose(error => {
			console.log('SignalR connection closed', error)
			this.isStarted = false
		})

		this.connection.onreconnecting(error => {
			console.log('SignalR reconnecting...', error)
		})

		this.connection.onreconnected(connectionId => {
			console.log('SignalR reconnected', connectionId)
		})
	}

	async start(): Promise<void> {
		if (this.isStarted || this.isDestroyed) {
			return
		}

		try {
			await this.connection.start()
			this.isStarted = true
			console.log('SignalR connection started successfully')

			// Start health monitoring
			this.healthMonitor?.start(this.healthChangeCallback)
		} catch (err) {
			console.error('SignalR connection failed:', err)
			this.isStarted = false
			throw err
		}
	}

	async joinConversation(conversationId: string): Promise<void> {
		if (!this.isStarted || this.isDestroyed) {
			throw new Error('Connection not started or destroyed')
		}

		try {
			await this.connection.invoke('JoinConversation', conversationId)
			console.log(`Joined conversation: ${conversationId}`)
		} catch (err) {
			console.error('Failed to join conversation:', err)
			throw err
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

	onHealthChange(callback: (isHealthy: boolean) => void): void {
		this.healthChangeCallback = callback
	}

	async stop(): Promise<void> {
		if (this.isDestroyed) {
			return
		}

		this.isDestroyed = true
		this.isStarted = false

		// Stop health monitoring
		this.healthMonitor?.stop()

		try {
			await this.connection.stop()
			console.log('SignalR connection stopped')
		} catch (err) {
			console.error('Error stopping SignalR connection:', err)
		}
	}

	get connectionState(): signalR.HubConnectionState {
		return this.connection.state
	}

	get isConnected(): boolean {
		return (
			this.connection.state === signalR.HubConnectionState.Connected &&
			this.isStarted &&
			!this.isDestroyed
		)
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
			.withAutomaticReconnect({
				nextRetryDelayInMilliseconds: retryContext => {
					// Exponential backoff with max 30 seconds
					const delay = Math.min(
						1000 * Math.pow(2, retryContext.previousRetryCount),
						30000
					)
					return delay
				},
			})
			.configureLogging(signalR.LogLevel.Warning)
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

// Removed useConnection hook to prevent multiple connection instances
// Use ChatSignalRClient directly in useChat hook instead

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
