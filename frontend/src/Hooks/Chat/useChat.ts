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

	const sendMessageMutation = useSendMessage()
	const deleteMessageMutation = useDeleteMessage()

	useEffect(() => {
		if (conversationId !== previousConversationIdRef.current) {
			setMessages([])
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

		const client = new ChatSignalRClient(conversationId)
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
		client.start().then(() => {
			if (isMounted) {
				setConnected(true)
				client.joinConversation(conversationId)
				refetchMessagesRef.current?.()
			}
		})

		return () => {
			isMounted = false
			client.stop()
			setConnected(false)
		}
	}, [token, conversationId])

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
