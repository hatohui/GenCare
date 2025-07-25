'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
	useUnassignedConversations,
	useJoinConversationAsConsultant,
	useEndConversation,
} from '@/Services/chat-service'
import useChat from '@/Hooks/Chat/useChat'
import useToken from '@/Hooks/Auth/useToken'
import { toast } from 'react-hot-toast'
import { useGetMe } from '@/Services/account-service'
import ConsultantConversationHistory from './ConsultantConversationHistory'
import {
	RefreshCw,
	User,
	Clock,
	Calendar,
	MessageCircle,
	Rocket,
	Stethoscope,
	Loader2,
	Info,
	Coffee,
	History,
	UserPlus,
} from 'lucide-react'

interface ConsultantChatProps {
	className?: string
}

interface UnassignedConversation {
	conversationId: string
	memberId: string
	memberFirstName?: string
	memberLastName?: string
	memberEmail?: string
	startAt: string
	status: boolean
}

const ConsultantChat: React.FC<ConsultantChatProps> = ({ className }) => {
	const [selectedConversationId, setSelectedConversationId] = useState<
		string | null
	>(null)
	const [inputMessage, setInputMessage] = useState('')
	const [isInChat, setIsInChat] = useState(false)
	const [activeView, setActiveView] = useState<'unassigned' | 'history'>(
		'unassigned'
	)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const { accessToken } = useToken()
	const { data: userData } = useGetMe()
	const { data: unassignedConversations, refetch: refetchUnassigned } =
		useUnassignedConversations()
	const joinConversationMutation = useJoinConversationAsConsultant()
	const endConversationMutation = useEndConversation()

	const { messages, connected, sendMessage, isLoading } = useChat(
		selectedConversationId || '',
		useCallback(() => {
			// Handle conversation ended event
			toast('The conversation has been ended by the other participant', {
				icon: <Info className='w-4 h-4' />,
			})
			setSelectedConversationId(null)
			setIsInChat(false)
			refetchUnassigned()
		}, [refetchUnassigned])
	)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleJoinConversation = async (conversationId: string) => {
		if (!accessToken || !userData?.id) {
			toast.error('Please login to join conversations')
			return
		}

		try {
			await joinConversationMutation.mutateAsync(conversationId)
			setSelectedConversationId(conversationId)
			setIsInChat(true)
			toast.success('Joined conversation successfully!')
			refetchUnassigned() // Refresh the list
		} catch (error) {
			toast.error('Failed to join conversation')
			console.error('Failed to join conversation:', error)
		}
	}

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!inputMessage.trim() || !selectedConversationId) return

		await sendMessage(inputMessage)
		setInputMessage('')
	}

	const handleEndConversation = async () => {
		if (!selectedConversationId) return

		try {
			await endConversationMutation.mutateAsync(selectedConversationId)
			setSelectedConversationId(null)
			setIsInChat(false)
			toast.success('Conversation ended')
			refetchUnassigned() // Refresh the list
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

	const formatConversationTime = (dateString: string) => {
		return new Date(dateString).toLocaleString()
	}

	if (!isInChat) {
		return (
			<div className={`${className} h-full flex`}>
				{/* Sidebar */}
				<div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
					{/* Header */}
					<div className='p-4 border-b border-gray-200'>
						<h2 className='text-lg font-bold text-main flex items-center space-x-2'>
							<Stethoscope className='w-5 h-5 text-accent' />
							<span>Consultant Dashboard</span>
						</h2>
						<p className='text-xs text-gray-500 mt-1'>
							Manage patient conversations
						</p>
					</div>

					{/* View Toggle */}
					<div className='p-3 border-b border-gray-200'>
						<div className='flex bg-gray-100 rounded-lg p-1'>
							<button
								onClick={() => setActiveView('unassigned')}
								className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
									activeView === 'unassigned'
										? 'bg-accent text-white shadow-sm'
										: 'text-gray-600 hover:text-main'
								}`}
							>
								<UserPlus className='w-4 h-4' />
								<span>New Requests</span>
								{unassignedConversations?.length > 0 && (
									<span className='bg-secondary text-white text-xs px-1.5 py-0.5 rounded-full'>
										{unassignedConversations.length}
									</span>
								)}
							</button>
							<button
								onClick={() => setActiveView('history')}
								className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
									activeView === 'history'
										? 'bg-accent text-white shadow-sm'
										: 'text-gray-600 hover:text-main'
								}`}
							>
								<History className='w-4 h-4' />
								<span>History</span>
							</button>
						</div>
					</div>

					{/* Content Area */}
					<div className='flex-1 overflow-hidden'>
						{activeView === 'unassigned' ? (
							<div className='h-full flex flex-col'>
								{/* Refresh Button */}
								<div className='p-3 border-b border-gray-200'>
									<button
										onClick={() => refetchUnassigned()}
										className='w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm'
									>
										<RefreshCw className='w-4 h-4' />
										<span>Refresh</span>
									</button>
								</div>

								{/* Unassigned Conversations */}
								<div className='flex-1 overflow-y-auto p-3'>
									{!unassignedConversations ||
									unassignedConversations.length === 0 ? (
										<div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
											<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
												<Coffee className='w-8 h-8 text-gray-400' />
											</div>
											<div>
												<p className='text-sm font-medium text-gray-600'>
													All caught up!
												</p>
												<p className='text-xs text-gray-500 mt-1'>
													No users need assistance right now.
												</p>
											</div>
										</div>
									) : (
										<div className='space-y-3'>
											{unassignedConversations.map(
												(conversation: UnassignedConversation) => (
													<div
														key={conversation.conversationId}
														className='border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all bg-white'
													>
														<div className='flex items-start space-x-3'>
															<div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
																<User className='w-4 h-4 text-blue-600' />
															</div>
															<div className='flex-1 min-w-0'>
																<div className='flex items-center space-x-2 mb-1'>
																	<span className='text-sm font-medium text-gray-800'>
																		Patient Request
																	</span>
																	<span className='px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded-full font-medium'>
																		<div className='flex items-center gap-1'>
																			<Clock className='w-3 h-3' />
																			<span>Waiting</span>
																		</div>
																	</span>
																</div>
																<p className='text-xs text-gray-500 mb-2'>
																	<div className='flex items-center gap-1'>
																		<Calendar className='w-3 h-3' />
																		<span>
																			{formatConversationTime(
																				conversation.startAt
																			)}
																		</span>
																	</div>
																</p>
																<div className='text-xs text-gray-600 bg-gray-50 p-2 rounded-md mb-2'>
																	<div className='flex items-center gap-2'>
																		<MessageCircle className='w-3 h-3' />
																		<span>
																			User is waiting for medical consultation
																		</span>
																	</div>
																</div>
																<button
																	onClick={() =>
																		handleJoinConversation(
																			conversation.conversationId
																		)
																	}
																	disabled={joinConversationMutation.isPending}
																	className='w-full px-3 py-2 bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg hover:from-accent/90 hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium'
																>
																	{joinConversationMutation.isPending ? (
																		<div className='flex items-center justify-center space-x-2'>
																			<Loader2 className='w-3 h-3 animate-spin' />
																			<span>Joining...</span>
																		</div>
																	) : (
																		<div className='flex items-center justify-center space-x-2'>
																			<Rocket className='w-3 h-3' />
																			<span>Join Chat</span>
																		</div>
																	)}
																</button>
															</div>
														</div>
													</div>
												)
											)}
										</div>
									)}
								</div>
							</div>
						) : (
							<ConsultantConversationHistory
								onSelectConversation={conversationId => {
									setSelectedConversationId(conversationId)
									setIsInChat(true)
								}}
								selectedConversationId={selectedConversationId}
								className='h-full'
							/>
						)}
					</div>
				</div>

				{/* Main Content Area */}
				<div className='flex-1 flex items-center justify-center bg-gray-50'>
					<div className='text-center space-y-4'>
						<div className='w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto'>
							<Stethoscope className='w-10 h-10 text-accent' />
						</div>
						<div>
							<h3 className='text-xl font-semibold text-main mb-2'>
								Welcome to Consultant Dashboard
							</h3>
							<p className='text-gray-600 max-w-md'>
								Monitor patient requests and manage your conversation history.
								Join new conversations or continue existing ones from the
								sidebar.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`${className} flex flex-col h-[600px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200`}
		>
			{/* Header */}
			<div className='bg-gradient-to-r from-accent to-accent/90 text-white p-4 flex justify-between items-center'>
				<div className='flex items-center space-x-3'>
					<div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
						<User className='w-5 h-5' />
					</div>
					<div>
						<h3 className='font-semibold'>Patient Consultation</h3>
						<div className='flex items-center space-x-1'>
							<div
								className={`w-2 h-2 rounded-full ${
									connected ? 'bg-green-300' : 'bg-red-300'
								}`}
							></div>
							<span className='text-sm opacity-90'>
								{connected ? 'Connected' : 'Connecting...'}
							</span>
						</div>
					</div>
				</div>
				<div className='flex space-x-2'>
					<button
						onClick={() => {
							setSelectedConversationId(null)
							setIsInChat(false)
						}}
						className='px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-sm transition-colors font-medium'
					>
						← Dashboard
					</button>
					<button
						onClick={handleEndConversation}
						disabled={endConversationMutation.isPending}
						className='px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-lg text-sm transition-colors font-medium text-white'
					>
						{endConversationMutation.isPending ? 'Ending...' : 'End Chat'}
					</button>
				</div>
			</div>

			{/* Messages Area */}
			<div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
				{messages.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
						<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
							<MessageCircle className='w-8 h-8 text-green-600' />
						</div>
						<div>
							<p className='text-gray-600 font-medium'>
								Ready to help this patient
							</p>
							<p className='text-sm text-gray-500 mt-1'>
								Start the conversation by sending a professional greeting
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
							<div className='flex items-end space-x-2 max-w-[80%]'>
								{message.createdBy !== userData?.id && (
									<div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0'>
										<User className='w-4 h-4' />
									</div>
								)}
								<div
									className={`px-4 py-3 rounded-2xl shadow-sm ${
										message.createdBy === userData?.id
											? 'bg-green-500 text-white rounded-br-md'
											: 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
									}`}
								>
									<p className='break-words leading-relaxed'>
										{message.content}
									</p>
									<p
										className={`text-xs mt-2 ${
											message.createdBy === userData?.id
												? 'text-green-100'
												: 'text-gray-500'
										}`}
									>
										{formatMessageTime(message.createdAt)}
									</p>
								</div>
								{message.createdBy === userData?.id && (
									<div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0'>
										<Stethoscope className='w-4 h-4' />
									</div>
								)}
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className='border-t border-gray-200 p-4 bg-white'>
				<form onSubmit={handleSendMessage} className='flex space-x-3'>
					<div className='flex-1 relative'>
						<input
							type='text'
							value={inputMessage}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setInputMessage(e.target.value)
							}
							placeholder='Type your response...'
							disabled={isLoading}
							className='w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-all'
						/>
						<div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
							<Stethoscope className='w-5 h-5' />
						</div>
					</div>
					<button
						type='submit'
						disabled={!inputMessage.trim() || isLoading}
						className='px-6 py-3 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl hover:from-accent/90 hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl'
					>
						{isLoading ? (
							<div className='flex items-center space-x-2'>
								<Loader2 className='w-4 h-4 animate-spin' />
								<span>Sending</span>
							</div>
						) : (
							<div className='flex items-center space-x-1'>
								<span>Send</span>
								<span>→</span>
							</div>
						)}
					</button>
				</form>
			</div>
		</div>
	)
}

export default ConsultantChat
