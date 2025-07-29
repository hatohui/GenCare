import { useEffect, useRef, useState, useCallback } from 'react'
import {
	ChatSignalRClient,
	SignalRMessage,
	useSendMessage,
	useDeleteMessage,
	useMessagesByConversation,
} from '@/Services/chat-service'
import useToken from '@/Hooks/Auth/useToken'

const useChat = (conversationId: string, onConversationEnded?: () => void) => {
	const { accessToken: token } = useToken()
	const [messages, setMessages] = useState<SignalRMessage[]>([])
	const [connected, setConnected] = useState(false)
	const clientRef = useRef<ChatSignalRClient | null>(null)
	const previousConversationIdRef = useRef<string>('')
	const refetchMessagesRef = useRef<(() => void) | null>(null)
	const connectionAttemptRef = useRef<number>(0)
	const maxConnectionAttempts = 5

	const sendMessageMutation = useSendMessage()
	const deleteMessageMutation = useDeleteMessage()

	useEffect(() => {
		if (conversationId !== previousConversationIdRef.current) {
			setMessages([])
			connectionAttemptRef.current = 0 // Reset connection attempts for new conversation
			previousConversationIdRef.current = conversationId
		}
	}, [conversationId])

	const { data: existingMessages, refetch: refetchMessages } =
		useMessagesByConversation(conversationId)

	useEffect(() => {
		refetchMessagesRef.current = refetchMessages
	}, [refetchMessages])

	useEffect(() => {
		if (existingMessages?.length) {
			const formattedMessages = existingMessages.map((msg: any) => ({
				messageId: msg.id,
				content: msg.content,
				createdBy: msg.createdBy,
				createdAt: msg.createdAt,
				media:
					msg.mediaUrls?.map((url: string) => ({
						url,
						type: 'image',
					})) || [],
			}))
			setMessages(prev => {
				if (prev.length === 0 || formattedMessages.length > prev.length) {
					return formattedMessages
				}
				return prev
			})
		}
	}, [existingMessages])

	useEffect(() => {
		if (!token || !conversationId) return

		const client = new ChatSignalRClient(conversationId, token)
		clientRef.current = client

		client.onReceiveMessage((msg: SignalRMessage) => {
			setMessages(prev => {
				if (prev.some(m => m.messageId === msg.messageId)) return prev
				return [...prev, msg]
			})
		})

		client.onDeleteMessage(messageId => {
			setMessages(prev => prev.filter(m => m.messageId !== messageId))
		})

		client.onConversationEnded(() => {
			onConversationEnded?.()
		})

		let isMounted = true

		const startConnection = async () => {
			if (connectionAttemptRef.current >= maxConnectionAttempts) {
				console.warn(
					`Max connection attempts (${maxConnectionAttempts}) reached for conversation ${conversationId}`
				)
				return
			}

			connectionAttemptRef.current++

			try {
				await client.start()
				if (isMounted && client.isConnected) {
					setConnected(true)
					await client.joinConversation(conversationId)
					refetchMessagesRef.current?.()
					connectionAttemptRef.current = 0 // Reset on successful connection
				}
			} catch (error) {
				console.error(
					`Failed to start chat connection (attempt ${connectionAttemptRef.current}):`,
					error
				)
				if (isMounted) {
					setConnected(false)
					// Exponential backoff for retry
					if (connectionAttemptRef.current < maxConnectionAttempts) {
						const retryDelay = Math.min(
							1000 * Math.pow(2, connectionAttemptRef.current - 1),
							10000
						)
						setTimeout(() => {
							if (isMounted) {
								startConnection()
							}
						}, retryDelay)
					}
				}
			}
		}

		startConnection()

		return () => {
			isMounted = false
			setConnected(false)
			client.stop().catch(err => console.error('Error stopping client:', err))
		}
	}, [token, conversationId, onConversationEnded])

	const sendMessage = useCallback(
		async (content: string, mediaUrls: string[] = []) => {
			if (!token || !conversationId) return
			try {
				await sendMessageMutation.mutateAsync({
					conversationId,
					content,
					mediaUrls,
				})
			} catch (err) {
				console.error('Send message failed', err)
			}
		},
		[token, conversationId, sendMessageMutation]
	)

	const deleteMessage = useCallback(
		async (messageId: string) => {
			if (!token) return
			try {
				await deleteMessageMutation.mutateAsync(messageId)
			} catch (err) {
				console.error('Delete message failed', err)
			}
		},
		[token, deleteMessageMutation]
	)

	return {
		messages,
		connected: connected && clientRef.current?.isConnected,
		sendMessage,
		deleteMessage,
		client: clientRef.current,
		isLoading: sendMessageMutation.isPending || deleteMessageMutation.isPending,
		connectionState: clientRef.current?.connectionState,
	}
}

export default useChat
