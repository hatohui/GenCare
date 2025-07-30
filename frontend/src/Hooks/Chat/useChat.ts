import { useEffect, useRef, useState, useCallback } from 'react'
import {
	ChatSignalRClient,
	SignalRMessage,
	useSendMessage,
	useDeleteMessage,
	useMessagesByConversation,
} from '@/Services/chat-service'
import useToken from '@/Hooks/Auth/useToken'

const useChat = (
	conversationId: string,
	onConversationEnded?: () => void,
	onConsultantJoined?: () => void
) => {
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
			connectionAttemptRef.current = 0
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

		client.onConsultantJoined(() => {
			onConsultantJoined?.()
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

				// Check if it's a timeout error and provide specific feedback
				const isTimeoutError =
					error instanceof Error &&
					(error.message.includes('timeout') ||
						error.message.includes('Server timeout'))

				if (isTimeoutError) {
					console.warn(
						'Connection timeout detected - may be due to network latency or server load'
					)
				}

				if (isMounted) {
					setConnected(false)
					// Exponential backoff for retry, with longer delays for timeout errors
					if (connectionAttemptRef.current < maxConnectionAttempts) {
						const baseDelay = isTimeoutError ? 3000 : 1000 // Longer delay for timeout errors
						const retryDelay = Math.min(
							baseDelay * Math.pow(2, connectionAttemptRef.current - 1),
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
