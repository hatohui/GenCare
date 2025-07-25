'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
	useCreateConversation,
	useEndConversation,
	useUserConversationHistory,
} from '@/Services/chat-service'
import useChat from '@/Hooks/Chat/useChat'
import useToken from '@/Hooks/Auth/useToken'
import { toast } from 'react-hot-toast'
import { useGetMe } from '@/Services/account-service'
import ConversationHistory from './ConversationHistory'
import {
	MessageCircle,
	Plus,
	Clock,
	Stethoscope,
	Send,
	Loader2,
	User,
	AlertCircle,
} from 'lucide-react'

interface UserChatProps {
	className?: string
}

const UserChat: React.FC<UserChatProps> = ({ className }) => {
	const [conversationId, setConversationId] = useState<string | null>(null)
	const [inputMessage, setInputMessage] = useState('')
	const [isConversationStarted, setIsConversationStarted] = useState(false)
	const [selectedConversationId, setSelectedConversationId] = useState<
		string | null
	>(null)
	const [currentConversationData, setCurrentConversationData] = useState<{
		staffName?: string
		staffId?: string
		staffAvatarUrl?: string
		status: boolean
	} | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const { accessToken } = useToken()
	const { data: userData } = useGetMe()
	const { data: conversationHistory } = useUserConversationHistory()
	const createConversationMutation = useCreateConversation()
	const endConversationMutation = useEndConversation()

	const handleConversationEnded = useCallback(() => {
		// Handle conversation ended by other party
		setIsConversationStarted(false)
		toast('The consultant has ended the conversation', {
			icon: 'i',
		})
	}, [])

	const { messages, connected, sendMessage, isLoading } = useChat(
		conversationId || '',
		handleConversationEnded
	)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleStartConversation = async () => {
		if (!accessToken || !userData?.id) {
			toast.error('Please login to start a conversation')
			return
		}

		if (!inputMessage.trim()) {
			toast.error('Please enter a message to start the conversation')
			return
		}

		try {
			const response = await createConversationMutation.mutateAsync({
				memberId: userData.id,
				firstMessage: inputMessage,
				mediaUrls: [],
			})

			const newConversationId = response.data.conversationId
			setConversationId(newConversationId)
			setSelectedConversationId(newConversationId)
			setIsConversationStarted(true)
			setInputMessage('')
			toast.success('Conversation started! Waiting for a consultant...')
		} catch (error) {
			toast.error('Failed to start conversation')
			console.error('Failed to create conversation:', error)
		}
	}

	const handleSelectConversation = (selectedId: string) => {
		setConversationId(selectedId)
		setSelectedConversationId(selectedId)
		setIsConversationStarted(true)

		// Find and set the conversation data
		const conversation = conversationHistory?.find(
			(conv: any) => conv.conversationId === selectedId
		)
		if (conversation) {
			setCurrentConversationData({
				staffName: conversation.staffName,
				staffId: conversation.staffId,
				staffAvatarUrl: conversation.staffAvatarUrl,
				status: conversation.status,
			})
		}
	}

	const handleStartNewConversation = () => {
		setConversationId(null)
		setSelectedConversationId(null)
		setIsConversationStarted(false)
		setInputMessage('')
		setCurrentConversationData(null)
	}

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!inputMessage.trim() || !conversationId) return

		await sendMessage(inputMessage)
		setInputMessage('')
	}

	const handleEndConversation = async () => {
		if (!conversationId) return

		try {
			await endConversationMutation.mutateAsync(conversationId)
			setIsConversationStarted(false)
			toast.success('Conversation ended')
		} catch (error) {
			toast.error('Failed to end conversation')
			console.error('Failed to end conversation:', error)
		}
	}

	const formatMessageTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const isConversationEnded = Boolean(
		currentConversationData && !currentConversationData.status
	)

	return (
		<div
			className={`${className} flex h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200`}
		>
			{/* Left Sidebar - Conversation History */}
			<div className='w-80 border-r border-gray-200 flex flex-col'>
				{/* Sidebar Header */}
				<div className='p-4 border-b border-gray-200 bg-gray-50'>
					<div className='flex items-center justify-between'>
						<h3 className='font-semibold text-gray-800'>Messages</h3>
						<button
							onClick={handleStartNewConversation}
							className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
							title='Start new conversation'
						>
							<Plus className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* Conversation List */}
				<div className='flex-1 overflow-y-auto'>
					<ConversationHistory
						onSelectConversation={handleSelectConversation}
						selectedConversationId={selectedConversationId}
						className='w-full'
					/>
				</div>
			</div>

			{/* Right Side - Chat Area */}
			<div className='flex-1 flex flex-col'>
				{!isConversationStarted ? (
					/* New Conversation Form */
					<div className='flex-1 flex items-center justify-center p-8'>
						<div className='max-w-md w-full space-y-6'>
							<div className='text-center'>
								<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
									<MessageCircle className='w-8 h-8 text-blue-600' />
								</div>
								<h2 className='text-xl font-semibold text-gray-800 mb-2'>
									Start a New Conversation
								</h2>
								<p className='text-gray-600'>
									Describe your health concern and get connected with our
									qualified healthcare consultants
								</p>
							</div>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										How can we help you today?
									</label>
									<textarea
										value={inputMessage}
										onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
											setInputMessage(e.target.value)
										}
										placeholder='Describe your symptoms, concerns, or questions...'
										className='w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all'
										rows={4}
										disabled={createConversationMutation.isPending}
									/>
								</div>

								<button
									onClick={handleStartConversation}
									disabled={
										createConversationMutation.isPending || !inputMessage.trim()
									}
									className='w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
								>
									{createConversationMutation.isPending ? (
										<div className='flex items-center justify-center space-x-2'>
											<Loader2 className='w-4 h-4 animate-spin' />
											<span>Starting...</span>
										</div>
									) : (
										'Start Conversation'
									)}
								</button>
							</div>
						</div>
					</div>
				) : (
					/* Active Conversation */
					<>
						{/* Chat Header */}
						<div className='p-4 border-b border-gray-200 bg-gray-50'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-3'>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											!currentConversationData?.staffId
												? 'bg-yellow-500'
												: currentConversationData.status
												? 'bg-green-500'
												: 'bg-gray-500'
										}`}
									>
										{currentConversationData?.staffAvatarUrl ? (
											<img
												src={currentConversationData.staffAvatarUrl}
												alt={
													currentConversationData.staffName || 'Staff Avatar'
												}
												className='w-full h-full rounded-full object-cover'
												onError={e => {
													// Hide the image and show fallback
													e.currentTarget.style.display = 'none'
													e.currentTarget.nextElementSibling?.setAttribute(
														'style',
														'display: block'
													)
												}}
											/>
										) : null}
										<span
											className={`text-white text-lg ${
												currentConversationData?.staffAvatarUrl ? 'hidden' : ''
											}`}
											style={
												currentConversationData?.staffAvatarUrl
													? { display: 'none' }
													: {}
											}
										>
											{!currentConversationData?.staffId ? (
												<Clock className='w-5 h-5' />
											) : (
												<Stethoscope className='w-5 h-5' />
											)}
										</span>
									</div>
									<div>
										<h3 className='font-semibold text-gray-800'>
											{currentConversationData?.staffName ||
												(currentConversationData?.staffId
													? 'Healthcare Consultant'
													: 'Waiting for Consultant')}
										</h3>
										<div className='flex items-center space-x-1'>
											<div
												className={`w-2 h-2 rounded-full ${
													!currentConversationData?.staffId
														? 'bg-yellow-400'
														: connected
														? 'bg-green-400'
														: 'bg-gray-400'
												}`}
											></div>
											<span className='text-xs text-gray-600'>
												{isConversationEnded
													? 'This conversation has been closed'
													: !currentConversationData?.staffId
													? 'Waiting for assignment...'
													: connected
													? 'Online'
													: 'Connecting...'}
											</span>
										</div>
									</div>
								</div>
								{!isConversationEnded && (
									<button
										onClick={handleEndConversation}
										disabled={endConversationMutation.isPending}
										className='px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'
									>
										End Chat
									</button>
								)}
							</div>
						</div>

						{/* Messages Area */}
						<div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
							{messages.length === 0 ? (
								<div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
									<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
										<Clock className='w-8 h-8 text-blue-600' />
									</div>
									<div>
										<p className='text-gray-600 font-medium'>
											Waiting for a consultant to join...
										</p>
										<p className='text-sm text-gray-500 mt-1'>
											Your message will be delivered once they connect
										</p>
									</div>
								</div>
							) : (
								messages.map(message => (
									<div
										key={message.messageId}
										className={`flex ${
											message.createdBy === userData?.id
												? 'justify-end'
												: 'justify-start'
										}`}
									>
										<div className='flex items-end space-x-2 max-w-[70%]'>
											{message.createdBy !== userData?.id && (
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
														!currentConversationData?.staffId
															? 'bg-yellow-500'
															: currentConversationData.status
															? 'bg-green-500'
															: 'bg-gray-500'
													}`}
												>
													{currentConversationData?.staffAvatarUrl ? (
														<img
															src={currentConversationData.staffAvatarUrl}
															alt={
																currentConversationData.staffName ||
																'Staff Avatar'
															}
															className='w-full h-full rounded-full object-cover'
															onError={e => {
																// Hide the image and show fallback
																e.currentTarget.style.display = 'none'
																e.currentTarget.nextElementSibling?.setAttribute(
																	'style',
																	'display: block'
																)
															}}
														/>
													) : null}
													<span
														className={`text-white text-sm font-medium ${
															currentConversationData?.staffAvatarUrl
																? 'hidden'
																: ''
														}`}
														style={
															currentConversationData?.staffAvatarUrl
																? { display: 'none' }
																: {}
														}
													>
														{currentConversationData?.staffName ? (
															currentConversationData.staffName
																.split(' ')
																.map(n => n[0])
																.join('')
																.toUpperCase()
																.slice(0, 2)
														) : !currentConversationData?.staffId ? (
															<Clock className='w-4 h-4' />
														) : (
															<Stethoscope className='w-4 h-4' />
														)}
													</span>
												</div>
											)}
											<div
												className={`px-4 py-3 rounded-2xl shadow-sm ${
													message.createdBy === userData?.id
														? 'bg-blue-500 text-white rounded-br-md'
														: 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
												}`}
											>
												<p className='break-words leading-relaxed'>
													{message.content}
												</p>
												<p
													className={`text-xs mt-2 ${
														message.createdBy === userData?.id
															? 'text-blue-100'
															: 'text-gray-500'
													}`}
												>
													{formatMessageTime(message.createdAt)}
												</p>
											</div>
											{message.createdBy === userData?.id && (
												<div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0'>
													<User className='w-4 h-4' />
												</div>
											)}
										</div>
									</div>
								))
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Area */}
						<div
							className={`border-t border-gray-200 p-4 bg-white ${
								isConversationEnded ? 'opacity-50' : ''
							}`}
						>
							{isConversationEnded ? (
								<div className='text-center py-3'>
									<div className='flex items-center justify-center mb-3'>
										<AlertCircle className='w-5 h-5 text-gray-500 mr-2' />
										<p className='text-gray-500 text-sm'>
											This conversation has ended
										</p>
									</div>
									<button
										onClick={handleStartNewConversation}
										className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2 mx-auto'
									>
										<Plus className='w-4 h-4' />
										<span>Start a new chat</span>
									</button>
								</div>
							) : (
								<form onSubmit={handleSendMessage} className='flex space-x-3'>
									<div className='flex-1 relative'>
										<input
											type='text'
											value={inputMessage}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												setInputMessage(e.target.value)
											}
											placeholder='Type your message...'
											disabled={isLoading || isConversationEnded}
											className='w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50'
										/>
										<div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
											<MessageCircle className='w-5 h-5' />
										</div>
									</div>
									<button
										type='submit'
										disabled={
											!inputMessage.trim() || isLoading || isConversationEnded
										}
										className='px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2'
									>
										{isLoading ? (
											<>
												<Loader2 className='w-4 h-4 animate-spin' />
												<span>Sending</span>
											</>
										) : (
											<>
												<Send className='w-4 h-4' />
												<span>Send</span>
											</>
										)}
									</button>
								</form>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default UserChat
