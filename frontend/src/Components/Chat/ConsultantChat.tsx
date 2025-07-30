'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
	useUnassignedConversations,
	useJoinConversationAsConsultant,
	useEndConversation,
	useConsultantConversationHistory,
} from '@/Services/chat-service'
import useChat from '@/Hooks/Chat/useChat'
import { toast } from 'react-hot-toast'
import { useGetMe } from '@/Services/account-service'
import ConsultantConversationHistory from './ConsultantConversationHistory'
import ConnectionStatus from './ConnectionStatus'
import {
	RefreshCw,
	User,
	Clock,
	MessageCircle,
	Stethoscope,
	Loader2,
	Coffee,
	History,
	Copy,
} from 'lucide-react'
import { useLocale } from '@/Hooks/useLocale'
import { format } from 'date-fns'
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'

interface ConsultantChatProps {
	className?: string
}

interface UnassignedConversation {
	conversationId: string
	memberId: string
	memberFirstName?: string
	memberLastName?: string
	memberEmail?: string
	memberAvatarUrl?: string
	startAt: string
	status: boolean
}

const ConsultantChat: React.FC<ConsultantChatProps> = ({ className }) => {
	const { t } = useLocale()
	const [selectedConversationId, setSelectedConversationId] = useState<
		string | null
	>(null)
	const [selectedConversationDetails, setSelectedConversationDetails] =
		useState<{
			memberName?: string
			memberAvatarUrl?: string
			memberId?: string
		} | null>(null)
	const [inputMessage, setInputMessage] = useState('')
	const [activeView, setActiveView] = useState<'waiting' | 'active' | 'ended'>(
		'waiting'
	)

	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const { data: userData } = useGetMe()

	const handleConversationEnded = useCallback(() => {
		setSelectedConversationId(null)
		setSelectedConversationDetails(null)
		toast(t('chat.conversation_ended'), {
			icon: 'ℹ️',
		})
	}, [t])

	const { messages, sendMessage, isLoading, connected, connectionState } =
		useChat(selectedConversationId || '', handleConversationEnded)

	const {
		data: unassignedConversations = [],
		isLoading: loadingConversations,
		refetch: refetchUnassigned,
	} = useUnassignedConversations()

	const { data: consultantHistory } = useConsultantConversationHistory()

	const joinConversationMutation = useJoinConversationAsConsultant()
	const endConversationMutation = useEndConversation()

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const formatMessageTime = useCallback((dateString: string) => {
		try {
			const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z'
			const utcDate = new Date(utcString)
			return format(utcDate, 'HH:mm')
		} catch {
			return '--:--'
		}
	}, [])

	const handleConversationSelect = useCallback(
		(conversationId: string) => {
			setSelectedConversationId(conversationId)
			// Switch to active tab when a conversation is selected
			setActiveView('active')

			// Find conversation details from history or unassigned conversations
			// consultantHistory is a direct array of conversations
			let conversation = null

			// First, try consultantHistory as a direct array (this should be the correct structure)
			if (Array.isArray(consultantHistory)) {
				conversation = consultantHistory.find(
					(c: any) => c.conversationId === conversationId
				)
			}

			// Fallback: try unassigned conversations
			if (!conversation) {
				conversation = unassignedConversations.find(
					(c: UnassignedConversation) => c.conversationId === conversationId
				)
			}

			if (conversation) {
				setSelectedConversationDetails({
					memberName:
						conversation.memberName ||
						(conversation.memberFirstName
							? `${conversation.memberFirstName} ${
									conversation.memberLastName || ''
							  }`.trim()
							: undefined) ||
						t('chat.patient'),
					memberAvatarUrl: conversation.memberAvatarUrl,
					memberId: conversation.memberId,
				})
			} else {
				// If conversation not found in current data, set fallback
				setSelectedConversationDetails({
					memberName: t('chat.patient'),
					memberAvatarUrl: undefined,
					memberId: undefined,
				})
			}
		},
		[consultantHistory, unassignedConversations, t]
	)

	const handleJoinConversation = useCallback(
		async (conversationId: string) => {
			try {
				await joinConversationMutation.mutateAsync(conversationId)
				setSelectedConversationId(conversationId)
				// Switch to active tab when joining a conversation
				setActiveView('active')

				// Set conversation details when joining
				const conversation = unassignedConversations.find(
					(c: UnassignedConversation) => c.conversationId === conversationId
				)
				if (conversation) {
					setSelectedConversationDetails({
						memberName: conversation.memberFirstName
							? `${conversation.memberFirstName} ${
									conversation.memberLastName || ''
							  }`.trim()
							: t('chat.patient'),
						memberAvatarUrl: conversation.memberAvatarUrl,
						memberId: conversation.memberId,
					})
				}

				toast.success(t('chat.successfully_joined'))
				await refetchUnassigned()
			} catch (error) {
				console.error('Failed to join conversation:', error)
				toast.error(t('chat.failed_to_join'))
			}
		},
		[joinConversationMutation, refetchUnassigned, unassignedConversations, t]
	)

	const handleEndConversation = useCallback(async () => {
		if (!selectedConversationId) return

		try {
			await endConversationMutation.mutateAsync(selectedConversationId)
			setSelectedConversationId(null)
			setSelectedConversationDetails(null)
			toast.success(t('chat.conversation_ended_successfully'))
			await refetchUnassigned()
		} catch (error) {
			console.error('Failed to end conversation:', error)
			toast.error(t('chat.failed_to_end'))
		}
	}, [selectedConversationId, endConversationMutation, refetchUnassigned, t])

	const handleSendMessage = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault()
			if (!inputMessage.trim() || !selectedConversationId) return

			try {
				await sendMessage(inputMessage)
				setInputMessage('')

				// Focus back on input after sending message
				setTimeout(() => {
					inputRef.current?.focus()
				}, 100)
			} catch (error) {
				console.error('Failed to send message:', error)
				toast.error(t('chat.failed_to_send'))
			}
		},
		[inputMessage, selectedConversationId, sendMessage, t]
	)

	// Add key handler for Enter key
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				if (inputMessage.trim() && selectedConversationId && !isLoading) {
					// Create a synthetic form event
					const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
					handleSendMessage(syntheticEvent)
				}
			}
		},
		[inputMessage, selectedConversationId, isLoading, handleSendMessage]
	)

	const formatUnassignedTime = useCallback(
		(dateString: string) => {
			try {
				// Ensure the date string is treated as UTC by appending 'Z' if not present
				const utcString = dateString.endsWith('Z')
					? dateString
					: dateString + 'Z'
				const date = new Date(utcString)
				const now = new Date()
				const diffInMinutes = Math.floor(
					(now.getTime() - date.getTime()) / 60000
				)

				if (diffInMinutes < 1) return t('chat.just_now')
				if (diffInMinutes < 60)
					return t('chat.minutes_ago').replace('{0}', diffInMinutes.toString())
				if (diffInMinutes < 1440)
					return t('chat.hours_ago').replace(
						'{0}',
						Math.floor(diffInMinutes / 60).toString()
					)
				return format(date, 'MMM dd, yyyy')
			} catch {
				return t('common.invalid_date')
			}
		},
		[t]
	)

	const copyMemberId = useCallback(async () => {
		if (selectedConversationDetails?.memberId) {
			try {
				await navigator.clipboard.writeText(
					selectedConversationDetails.memberId
				)
				toast.success(t('common.copied_to_clipboard'))
			} catch (error) {
				console.error('Failed to copy member ID:', error)
				toast.error(t('common.copy_failed'))
			}
		}
	}, [selectedConversationDetails?.memberId, t])

	// Auto-focus input when conversation is selected
	useEffect(() => {
		if (selectedConversationId) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		}
	}, [selectedConversationId])

	// Auto-focus input when conversation is selected
	useEffect(() => {
		if (selectedConversationId) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 100)
		}
	}, [selectedConversationId])

	return (
		<div
			className={`${className} flex h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200`}
		>
			{/* Left Sidebar */}
			<div className='w-1/3 border-r border-gray-200 flex flex-col'>
				{/* Sidebar Header */}
				<div className='p-4 border-b border-gray-200 bg-gradient-to-r from-main to-secondary  '>
					<div className='flex items-center justify-between mb-3'>
						<h2 className='text-lg font-semibold text-white flex items-center space-x-2'>
							<Stethoscope className='w-5 h-5' />
							<span>{t('chat.consultant_dashboard')}</span>
						</h2>
					</div>

					{/* View Toggle */}
					<div className='flex bg-white bg-opacity-20 rounded-lg p-1 space-x-1'>
						<button
							onClick={() => setActiveView('waiting')}
							className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
								activeView === 'waiting'
									? 'bg-white text-gray-700 shadow-sm'
									: 'text-gray-300 hover:bg-white hover:bg-opacity-10'
							}`}
						>
							<Clock className='w-3 h-3' />
							<span>{t('chat.waiting')}</span>
						</button>
						<button
							onClick={() => setActiveView('active')}
							className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
								activeView === 'active'
									? 'bg-white text-gray-700 shadow-sm'
									: 'text-gray-300 hover:bg-white hover:bg-opacity-10'
							}`}
						>
							<MessageCircle className='w-3 h-3' />
							<span>{t('chat.active')}</span>
						</button>
						<button
							onClick={() => setActiveView('ended')}
							className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
								activeView === 'ended'
									? 'bg-white text-gray-700 shadow-sm'
									: 'text-gray-300 hover:bg-white hover:bg-opacity-10'
							}`}
						>
							<History className='w-3 h-3' />
							<span>{t('chat.ended')}</span>
						</button>
					</div>
				</div>

				{/* Sidebar Content */}
				<div className='flex-1 overflow-hidden'>
					{activeView === 'waiting' ? (
						/* Waiting Patients - Unassigned Conversations */
						<div className='h-full flex flex-col'>
							<div className='p-4 border-b border-gray-200 bg-gray-50'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium text-gray-700'>
										{t('chat.waiting_patients')} (
										{unassignedConversations.length})
									</span>
									<button
										onClick={() => refetchUnassigned()}
										disabled={loadingConversations}
										className='p-1 text-gray-500 hover:text-gray-700 transition-colors'
									>
										<RefreshCw
											className={`w-4 h-4 ${
												loadingConversations ? 'animate-spin' : ''
											}`}
										/>
									</button>
								</div>
							</div>

							<div className='flex-1 overflow-y-auto'>
								{loadingConversations ? (
									<div className='flex items-center justify-center h-32'>
										<Loader2 className='w-6 h-6 animate-spin text-accent' />
									</div>
								) : unassignedConversations.length === 0 ? (
									<div className='flex flex-col items-center justify-center h-full p-6 text-center'>
										<div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3'>
											<Coffee className='w-6 h-6 text-green-600' />
										</div>
										<p className='text-gray-600 font-medium'>
											{t('chat.all_caught_up')}
										</p>
										<p className='text-sm text-gray-500 mt-1'>
											{t('chat.no_patients_waiting')}
										</p>
									</div>
								) : (
									<div className='space-y-1 p-2'>
										{unassignedConversations.map(
											(conversation: UnassignedConversation) => (
												<div
													key={conversation.conversationId}
													className={`p-3 bg-white border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
														selectedConversationId ===
														conversation.conversationId
															? 'border-blue-500 bg-blue-50'
															: 'border-gray-200'
													}`}
													onClick={() =>
														handleConversationSelect(
															conversation.conversationId
														)
													}
												>
													<div className='flex items-start justify-between mb-2'>
														<div className='flex items-center space-x-3'>
															<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden'>
																{conversation.memberAvatarUrl ? (
																	<CldImage
																		src={conversation.memberAvatarUrl}
																		width={40}
																		height={40}
																		alt={
																			(conversation.memberFirstName || '') +
																			' ' +
																			(conversation.memberLastName || '')
																		}
																		className='w-10 h-10 rounded-full object-cover'
																		style={{ objectFit: 'cover' }}
																	/>
																) : (
																	<User className='w-5 h-5 text-blue-600' />
																)}
															</div>
															<div>
																<p className='font-medium text-gray-900'>
																	{conversation.memberFirstName ||
																		t('chat.anonymous')}{' '}
																	{conversation.memberLastName ||
																		t('chat.patient')}
																</p>
																<p className='text-sm text-gray-600'>
																	{conversation.memberEmail ||
																		t('chat.no_email')}
																</p>
															</div>
														</div>
														<div className='text-right'>
															<div className='flex items-center space-x-1 text-sm text-gray-500'>
																<Clock className='w-3 h-3' />
																<span>
																	{formatUnassignedTime(conversation.startAt)}
																</span>
															</div>
															<div className='flex items-center space-x-1 text-xs text-orange-600 mt-1'>
																<div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
																<span>{t('chat.waiting')}</span>
															</div>
														</div>
													</div>

													<button
														onClick={e => {
															e.stopPropagation()
															handleJoinConversation(
																conversation.conversationId
															)
														}}
														disabled={joinConversationMutation.isPending}
														className='w-full mt-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50'
													>
														{joinConversationMutation.isPending
															? t('chat.joining')
															: t('chat.join_conversation')}
													</button>
												</div>
											)
										)}
									</div>
								)}
							</div>
						</div>
					) : activeView === 'active' ? (
						/* Active Conversations */
						<ConsultantConversationHistory
							className='h-full'
							onSelectConversation={handleConversationSelect}
							selectedConversationId={selectedConversationId}
						/>
					) : (
						/* Ended Conversations */
						<div className='h-full flex flex-col'>
							<div className='p-3 border-b border-gray-200 bg-gray-50'>
								<span className='text-sm font-medium text-gray-700'>
									{t('chat.ended_conversations')}
								</span>
							</div>
							<ConsultantConversationHistory
								className='flex-1'
								onSelectConversation={handleConversationSelect}
								selectedConversationId={selectedConversationId}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Right side: Chat Area */}
			<div className='flex-1 flex flex-col'>
				{selectedConversationId ? (
					/* Active Conversation */
					<>
						{/* Chat Header */}
						<div className='bg-gradient-to-r from-secondary to-main text-white p-4 flex justify-between items-center'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden'>
									{selectedConversationDetails?.memberAvatarUrl ? (
										<CldImage
											src={selectedConversationDetails.memberAvatarUrl}
											width={40}
											height={40}
											alt={selectedConversationDetails.memberName || 'Patient'}
											className='w-10 h-10 rounded-full object-cover'
											style={{ objectFit: 'cover' }}
										/>
									) : (
										<User className='w-5 h-5' />
									)}
								</div>
								<div>
									<div className='flex items-center space-x-2'>
										<h3 className='font-semibold'>
											{selectedConversationDetails?.memberName ||
												t('chat.patient_consultation')}
										</h3>
										{selectedConversationDetails?.memberId && (
											<button
												onClick={copyMemberId}
												className='p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors'
												title={t('common.copy_member_id')}
											>
												<Copy className='w-3 h-3' />
											</button>
										)}
									</div>
									<div className='flex items-center space-x-2'>
										<ConnectionStatus
											connected={connected || false}
											connectionState={connectionState}
											className='text-white'
										/>
									</div>
								</div>
							</div>
							<button
								onClick={handleEndConversation}
								disabled={endConversationMutation.isPending}
								className='px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-lg text-sm transition-colors font-medium text-white'
							>
								{endConversationMutation.isPending
									? t('chat.ending')
									: t('chat.end_chat')}
							</button>
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
											{t('chat.ready_to_help')}
										</p>
										<p className='text-sm text-gray-500 mt-1'>
											{t('chat.start_with_greeting')}
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
												<div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 overflow-hidden'>
													{selectedConversationDetails?.memberAvatarUrl ? (
														<CldImage
															src={selectedConversationDetails.memberAvatarUrl}
															width={32}
															height={32}
															alt={
																selectedConversationDetails.memberName ||
																'Patient'
															}
															className='w-8 h-8 rounded-full object-cover'
															style={{ objectFit: 'cover' }}
														/>
													) : (
														<User className='w-4 h-4' />
													)}
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
												{message.media && message.media.length > 0 && (
													<div className='mt-2 space-y-2'>
														{message.media.map((media: any, index: number) => (
															<div key={index} className='inline-block'>
																<Image
																	width={200}
																	height={200}
																	src={media.url || media}
																	alt={`Attachment ${index + 1}`}
																	className='max-w-xs rounded-lg shadow-sm border border-gray-200'
																	style={{ maxHeight: '200px' }}
																/>
															</div>
														))}
													</div>
												)}
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
										ref={inputRef}
										type='text'
										value={inputMessage}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setInputMessage(e.target.value)
										}
										onKeyDown={handleKeyDown}
										placeholder={t('chat.type_response')}
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
											<span>{t('chat.sending')}</span>
										</div>
									) : (
										<div className='flex items-center space-x-1'>
											<span>{t('chat.send')}</span>
											<span>→</span>
										</div>
									)}
								</button>
							</form>
						</div>
					</>
				) : (
					/* No conversation selected state */
					<div className='flex-1 flex items-center justify-center p-8'>
						<div className='text-center space-y-4'>
							<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
								<MessageCircle className='w-8 h-8 text-green-600' />
							</div>
							<div>
								<p className='text-gray-600 font-medium'>
									{t('chat.select_conversation')}
								</p>
								<p className='text-sm text-gray-500 mt-1'>
									{t('chat.choose_patient_conversation')}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ConsultantChat
