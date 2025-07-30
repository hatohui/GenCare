'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
	Calendar,
	ChevronDown,
} from 'lucide-react'
import { useLocale } from '@/Hooks/useLocale'
import { format } from 'date-fns'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'

interface UserChatProps {
	className?: string
}

const UserChat: React.FC<UserChatProps> = ({ className }) => {
	const { t } = useLocale()
	const router = useRouter()
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
	const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active')
	const [showPending, setShowPending] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const { accessToken } = useToken()
	const { data: userData } = useGetMe()
	const { data: conversationHistory } = useUserConversationHistory()
	const createConversationMutation = useCreateConversation()
	const endConversationMutation = useEndConversation()

	const handleConversationEnded = useCallback(() => {
		setIsConversationStarted(false)
		toast(t('chat.conversation_ended_by_consultant'), {
			icon: 'ℹ️',
		})
	}, [t])

	const handleConsultantJoined = useCallback(() => {
		toast.success(t('chat.consultant_joined'))
	}, [t])

	const { messages, connected, sendMessage, isLoading } = useChat(
		conversationId || '',
		handleConversationEnded,
		handleConsultantJoined
	)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleStartConversation = async () => {
		if (!accessToken || !userData?.id) {
			toast.error(t('chat.please_login'))
			return
		}

		if (!inputMessage.trim()) {
			toast.error(t('chat.enter_message_first'))
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
			setActiveTab('active')
			toast.success(t('chat.conversation_started'))
		} catch (error) {
			toast.error(t('chat.failed_to_start'))
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
		} else {
			// If conversation not found, set fallback data
			setCurrentConversationData({
				staffName: undefined,
				staffId: undefined,
				staffAvatarUrl: undefined,
				status: true, // Assume active by default
			})
		}
	}

	const handleStartNewConversation = () => {
		setConversationId(null)
		setSelectedConversationId(null)
		setIsConversationStarted(false)
		setInputMessage('')
		setCurrentConversationData(null)
		setActiveTab('active') // Switch to active tab when starting new conversation
	}

	// Add key handler for Enter key
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (
				inputMessage.trim() &&
				conversationId &&
				!isLoading &&
				!isConversationEnded
			) {
				// Create a synthetic form event
				const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
				handleSendMessage(syntheticEvent)
			}
		}
	}

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!inputMessage.trim() || !conversationId) return

		await sendMessage(inputMessage)
		setInputMessage('')

		// Focus back on input after sending message
		setTimeout(() => {
			inputRef.current?.focus()
		}, 100)
	}

	const handleEndConversation = async () => {
		if (!conversationId) return

		try {
			await endConversationMutation.mutateAsync(conversationId)
			setIsConversationStarted(false)
			toast.success(t('chat.conversation_ended_successfully'))
		} catch (error) {
			toast.error(t('chat.failed_to_end'))
			console.error('Failed to end conversation:', error)
		}
	}

	const formatMessageTime = (dateString: string) => {
		try {
			// Ensure the date string is treated as UTC by appending 'Z' if not present
			const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z'
			const utcDate = new Date(utcString)
			return format(utcDate, 'HH:mm')
		} catch {
			return '--:--'
		}
	}

	const handleBookConsultant = useCallback(() => {
		// Redirect to consultant profile page
		if (currentConversationData?.staffId) {
			router.push(`/app/consultants/${currentConversationData.staffId}`)
		} else {
			toast.error(t('chat.no_consultant_assigned'))
		}
	}, [currentConversationData?.staffId, router, t])

	// Get pending conversations count
	const getPendingCount = useCallback(() => {
		return (
			conversationHistory?.filter((conv: any) => !conv.staffId)?.length || 0
		)
	}, [conversationHistory])

	const isConversationEnded = Boolean(
		currentConversationData && !currentConversationData.status
	)

	// Auto-focus input when conversation starts
	useEffect(() => {
		if (isConversationStarted && !isConversationEnded) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		}
	}, [isConversationStarted, isConversationEnded])

	return (
		<div
			className={`${className} flex h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200`}
		>
			{/* Left Sidebar - Conversation History */}
			<div className='w-80 border-r border-gray-200 flex flex-col'>
				{/* Sidebar Header */}
				<div className='p-4 border-b border-gray-200 bg-gray-50'>
					<div className='flex items-center justify-between mb-3'>
						<h3 className='font-semibold text-gray-800'>
							{t('chat.messages')}
						</h3>
						<button
							onClick={handleStartNewConversation}
							className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
							title={t('chat.start_new_conversation')}
						>
							<Plus className='w-5 h-5' />
						</button>
					</div>

					{/* Tab Toggle */}
					<div className='flex bg-gray-200 rounded-lg p-1'>
						<button
							onClick={() => setActiveTab('active')}
							className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
								activeTab === 'active'
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							<MessageCircle className='w-3 h-3' />
							<span>{t('chat.active')}</span>
						</button>
						<button
							onClick={() => setActiveTab('ended')}
							className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
								activeTab === 'ended'
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							<Stethoscope className='w-3 h-3' />
							<span>{t('chat.ended')}</span>
						</button>
					</div>
				</div>

				{/* Conversation List */}
				<div className='flex-1 overflow-y-auto'>
					{activeTab === 'active' ? (
						<div className='flex flex-col h-full'>
							{/* Active Conversations */}
							<ConversationHistory
								onSelectConversation={handleSelectConversation}
								selectedConversationId={selectedConversationId}
								className='flex-shrink-0'
								filterByStatus={true}
								showPendingOnly={false}
							/>

							{/* Collapsible Pending Section */}
							{getPendingCount() > 0 && (
								<div className='border-t border-gray-200 flex-shrink-0'>
									<button
										onClick={() => setShowPending(!showPending)}
										className='w-full p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between'
									>
										<div className='flex items-center space-x-2'>
											<Clock className='w-4 h-4 text-gray-500' />
											<span>
												{t('chat.show_pending')} ({getPendingCount()})
											</span>
										</div>
										<div
											className={`transform transition-transform ${
												showPending ? 'rotate-180' : ''
											}`}
										>
											<ChevronDown className='w-4 h-4 text-gray-500' />
										</div>
									</button>

									{showPending && (
										<div className='border-t border-gray-100'>
											<ConversationHistory
												onSelectConversation={handleSelectConversation}
												selectedConversationId={selectedConversationId}
												className='max-h-48 overflow-y-auto'
												filterByStatus={undefined}
												showPendingOnly={true}
											/>
										</div>
									)}
								</div>
							)}
						</div>
					) : (
						/* Ended Conversations */
						<ConversationHistory
							onSelectConversation={handleSelectConversation}
							selectedConversationId={selectedConversationId}
							className='w-full'
							filterByStatus={false}
							showPendingOnly={false}
						/>
					)}
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
									{t('chat.start_new_conversation_title')}
								</h2>
								<p className='text-gray-600'>
									{t('chat.describe_health_concern')}
								</p>
							</div>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										{t('chat.how_can_we_help')}
									</label>
									<textarea
										value={inputMessage}
										onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
											setInputMessage(e.target.value)
										}
										placeholder={t('chat.describe_symptoms')}
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
											<span>{t('chat.starting')}</span>
										</div>
									) : (
										t('chat.start_conversation')
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
										className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
											!currentConversationData?.staffId
												? 'bg-yellow-500'
												: currentConversationData.status
												? 'bg-green-500'
												: 'bg-gray-500'
										}`}
									>
										{currentConversationData?.staffAvatarUrl ? (
											<CldImage
												src={currentConversationData.staffAvatarUrl}
												width={40}
												height={40}
												alt={
													currentConversationData.staffName || 'Staff Avatar'
												}
												className='w-10 h-10 rounded-full object-cover'
												style={{ objectFit: 'cover' }}
											/>
										) : (
											<span className='text-white text-lg'>
												{!currentConversationData?.staffId ? (
													<Clock className='w-5 h-5' />
												) : (
													<Stethoscope className='w-5 h-5' />
												)}
											</span>
										)}
									</div>
									<div>
										<h3 className='font-semibold text-gray-800'>
											{currentConversationData?.staffName ||
												(currentConversationData?.staffId
													? t('chat.healthcare_consultant')
													: t('chat.waiting_for_consultant'))}
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
													? t('chat.conversation_has_ended')
													: !currentConversationData?.staffId
													? t('chat.waiting_for_assignment')
													: connected
													? t('chat.online')
													: t('chat.connecting')}
											</span>
										</div>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									{/* Action Buttons - Only show if consultant is assigned and conversation is active */}
									{currentConversationData?.staffId && !isConversationEnded && (
										<button
											onClick={handleBookConsultant}
											className='px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center space-x-1'
											title={t('chat.book_this_consultant')}
										>
											<Calendar className='w-4 h-4' />
											<span className='hidden sm:inline'>
												{t('chat.book_consultant')}
											</span>
										</button>
									)}
									{!isConversationEnded && (
										<button
											onClick={handleEndConversation}
											disabled={endConversationMutation.isPending}
											className='px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'
										>
											{t('chat.end_chat')}
										</button>
									)}
								</div>
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
											{t('chat.waiting_consultant_to_join')}
										</p>
										<p className='text-sm text-gray-500 mt-1'>
											{t('chat.message_delivered_when_connect')}
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
													className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
														!currentConversationData?.staffId
															? 'bg-yellow-500'
															: currentConversationData.status
															? 'bg-green-500'
															: 'bg-gray-500'
													}`}
												>
													{currentConversationData?.staffAvatarUrl ? (
														<CldImage
															src={currentConversationData.staffAvatarUrl}
															width={32}
															height={32}
															alt={
																currentConversationData.staffName ||
																'Staff Avatar'
															}
															className='w-8 h-8 rounded-full object-cover'
															style={{ objectFit: 'cover' }}
														/>
													) : (
														<span className='text-white text-sm font-medium'>
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
													)}
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
												{/* Media attachments */}
												{message.media && message.media.length > 0 && (
													<div className='mt-2 space-y-2'>
														{message.media.map((mediaItem, index) => (
															<div
																key={index}
																className='flex items-center space-x-2'
															>
																{mediaItem.type === 'image' ? (
																	<Image
																		width={200}
																		height={200}
																		src={mediaItem.url}
																		alt='Attachment'
																		className='max-w-48 max-h-48 rounded-lg object-cover'
																		onError={e => {
																			e.currentTarget.style.display = 'none'
																		}}
																	/>
																) : (
																	<a
																		href={mediaItem.url}
																		target='_blank'
																		rel='noopener noreferrer'
																		className={`text-sm underline ${
																			message.createdBy === userData?.id
																				? 'text-blue-100 hover:text-white'
																				: 'text-blue-600 hover:text-blue-800'
																		}`}
																	>
																		📎 View attachment
																	</a>
																)}
															</div>
														))}
													</div>
												)}
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
											{t('chat.conversation_has_ended')}
										</p>
									</div>
									<button
										onClick={handleStartNewConversation}
										className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2 mx-auto'
									>
										<Plus className='w-4 h-4' />
										<span>{t('chat.start_new_chat')}</span>
									</button>
								</div>
							) : (
								<form onSubmit={handleSendMessage} className='flex space-x-3'>
									<div className='flex-1 relative'>
										<input
											ref={inputRef}
											type='text'
											value={inputMessage}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												setInputMessage(e.target.value)
											}
											onKeyDown={handleKeyDown}
											placeholder={t('chat.type_your_message')}
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
												<span>{t('chat.sending')}</span>
											</>
										) : (
											<>
												<Send className='w-4 h-4' />
												<span>{t('chat.send')}</span>
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
