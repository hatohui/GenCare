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

	const sendMessageMutation = useSendMessage()
	const deleteMessageMutation = useDeleteMessage()

	// Fetch existing messages
	const { data: existingMessages } = useMessagesByConversation(conversationId)

	// Load existing messages when they're fetched
	useEffect(() => {
		if (existingMessages?.length) {
			const formattedMessages = existingMessages.map((msg: any) => ({
				messageId: msg.id,
				content: msg.content,
				createdBy: msg.createdBy,
				createdAt: msg.createdAt,
				media: msg.media || [],
			}))
			setMessages(formattedMessages)
		}
	}, [existingMessages])

	// Helper to add message with deduplication
	const addMessage = useCallback((msg: SignalRMessage) => {
		setMessages(prev => {
			if (prev.some(m => m.messageId === msg.messageId)) return prev
			return [...prev, msg]
		})
	}, [])

	const onConversationEndedCallback = useCallback(
		(endedConversationId: string) => {
			console.log('🔚 Conversation ended via SignalR:', endedConversationId)
			onConversationEnded?.()
		},
		[onConversationEnded]
	)

	useEffect(() => {
		if (!token || !conversationId) return

		const client = new ChatSignalRClient(token, conversationId)
		clientRef.current = client

		client.onReceiveMessage(addMessage)
		client.onDeleteMessage(messageId => {
			setMessages(prev => prev.filter(m => m.messageId !== messageId))
		})
		client.onConversationEnded(onConversationEndedCallback)

		let isMounted = true
		client.start().then(() => {
			if (isMounted) {
				setConnected(true)
				client.joinConversation(conversationId)
			}
		})

		return () => {
			isMounted = false
			client.onReceiveMessage(() => {}) // Remove handler
			client.onDeleteMessage(() => {})
			client.onConversationEnded(() => {})
			client.stop()
			setConnected(false)
			setMessages([])
		}
	}, [token, conversationId, addMessage, onConversationEndedCallback])

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
		connected,
		sendMessage,
		deleteMessage,
		client: clientRef.current,
		isLoading: sendMessageMutation.isPending || deleteMessageMutation.isPending,
	}
}

export default useChat
