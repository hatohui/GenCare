'use client'

import React from 'react'
import { useUserConversationHistory } from '@/Services/chat-service'
import { useLocale } from '@/Hooks/useLocale'
import { Clock, MessageCircle, Stethoscope } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

interface ConversationHistoryProps {
	onSelectConversation?: (conversationId: string) => void
	selectedConversationId?: string | null
	className?: string
	filterByStatus?: boolean // true for active, false for ended, undefined for all
	showPendingOnly?: boolean // true to show only pending (no staff assigned) conversations
}

interface ConversationHistoryItem {
	conversationId: string
	staffId?: string
	staffName?: string
	staffAvatarUrl?: string
	memberId: string
	startAt: string
	status: boolean
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
	onSelectConversation,
	selectedConversationId,
	className,
	filterByStatus,
	showPendingOnly,
}) => {
	const { t } = useLocale()
	const { data: conversations, isLoading, error } = useUserConversationHistory()

	// Filter conversations based on status
	const filteredConversations =
		conversations?.filter((conversation: ConversationHistoryItem) => {
			// Show only pending conversations (no staff assigned)
			if (showPendingOnly) {
				return !conversation.staffId
			}

			// Don't show pending conversations when not in pending tab
			if (!showPendingOnly && !conversation.staffId) {
				return false
			}

			if (filterByStatus === undefined) return true // Show all (with staff)

			// For active tab: show conversations that have staff assigned and are active
			if (filterByStatus === true) {
				return conversation.staffId && conversation.status
			}

			// For ended tab: show conversations that are ended (have staff assigned but status is false)
			if (filterByStatus === false) {
				return conversation.staffId && !conversation.status
			}

			return true
		}) || []

	const formatDate = (dateString: string) => {
		try {
			// Ensure the date string is treated as UTC by appending 'Z' if not present
			const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z'
			const utcDate = new Date(utcString)
			return format(utcDate, 'MMM dd, HH:mm')
		} catch {
			return t('common.invalid_date')
		}
	}

	const getStatusColor = (status: boolean) => {
		if (status) {
			return 'bg-green-100 text-green-800'
		} else {
			return 'bg-gray-100 text-gray-800'
		}
	}

	const getStatusIcon = (status: boolean, hasStaff: boolean) => {
		if (!hasStaff) {
			return <Clock className='w-3 h-3' />
		}
		return status ? (
			<div className='w-3 h-3 rounded-full bg-green-500'></div>
		) : (
			<div className='w-3 h-3 rounded-full bg-gray-500'></div>
		)
	}

	const getStatusText = (status: boolean) => {
		return status ? t('chat.active') : t('chat.ended')
	}

	if (isLoading) {
		return (
			<div className={`${className} p-4`}>
				<div className='flex items-center justify-center space-x-2 text-gray-500'>
					<div className='w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin'></div>
					<span className='text-sm'>{t('common.loading_conversations')}</span>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={`${className} p-4`}>
				<div className='text-center text-gray-500'>
					<p className='text-sm'>{t('common.error_loading_conversations')}</p>
				</div>
			</div>
		)
	}

	if (!conversations || conversations.length === 0) {
		return (
			<div className={`${className} p-4`}>
				<div className='text-center text-gray-500'>
					<div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
						<MessageCircle className='w-6 h-6 text-gray-400' />
					</div>
					<p className='text-sm font-medium'>
						{t('chat.no_conversations_yet')}
					</p>
					<p className='text-xs mt-1'>{t('chat.start_first_conversation')}</p>
				</div>
			</div>
		)
	}

	if (filteredConversations.length === 0) {
		return (
			<div className={`${className} p-4`}>
				<div className='text-center text-gray-500'>
					<div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
						<MessageCircle className='w-6 h-6 text-gray-400' />
					</div>
					<p className='text-sm font-medium'>
						{showPendingOnly
							? t('chat.no_pending_conversations')
							: filterByStatus === true
							? t('chat.no_active_conversations')
							: filterByStatus === false
							? t('chat.no_ended_conversations')
							: t('chat.no_conversations_yet')}
					</p>
					<p className='text-xs mt-1'>
						{showPendingOnly
							? t('chat.start_new_conversation_to_see')
							: filterByStatus === true
							? t('chat.start_new_or_check_tabs')
							: filterByStatus === false
							? t('chat.complete_conversations_to_see')
							: t('chat.start_first_conversation')}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className={`${className}`}>
			<div className='space-y-1 p-2'>
				{filteredConversations.map((conversation: ConversationHistoryItem) => (
					<div
						key={conversation.conversationId}
						onClick={() => {
							onSelectConversation?.(conversation.conversationId)
						}}
						className={`p-3 rounded-lg cursor-pointer transition-colors border ${
							selectedConversationId === conversation.conversationId
								? 'bg-blue-50 border-blue-200'
								: 'hover:bg-gray-50 border-transparent hover:border-gray-200'
						}`}
					>
						<div className='flex items-start space-x-3'>
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
									!conversation.staffId
										? 'bg-yellow-500'
										: conversation.status
										? 'bg-green-500'
										: 'bg-gray-500'
								}`}
							>
								{conversation.staffAvatarUrl ? (
									<Image
										width={40}
										height={40}
										src={conversation.staffAvatarUrl}
										alt={conversation.staffName || 'Staff Avatar'}
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
									className={`text-white text-sm ${
										conversation.staffAvatarUrl ? 'hidden' : ''
									}`}
									style={conversation.staffAvatarUrl ? { display: 'none' } : {}}
								>
									{!conversation.staffId ? (
										<Clock className='w-4 h-4' />
									) : (
										<Stethoscope className='w-4 h-4' />
									)}
								</span>
							</div>

							<div className='flex-1 min-w-0'>
								<div className='flex items-center justify-between mb-1'>
									<span className='text-sm font-medium text-gray-800 truncate'>
										{conversation.staffName ||
											(conversation.staffId
												? t('chat.healthcare_consultant')
												: t('chat.waiting_for_consultant'))}
									</span>
									<span className='text-xs text-gray-500'>
										{formatDate(conversation.startAt)}
									</span>
								</div>

								<div className='flex items-center space-x-2 mb-1'>
									<span className='text-sm'>
										{!conversation.staffId ? (
											<Clock className='w-3 h-3' />
										) : (
											getStatusIcon(conversation.status, !!conversation.staffId)
										)}
									</span>
									<span
										className={`px-2 py-0.5 text-xs font-medium rounded-full ${
											!conversation.staffId
												? 'bg-yellow-100 text-yellow-800'
												: getStatusColor(conversation.status)
										}`}
									>
										{!conversation.staffId
											? t('chat.pending')
											: getStatusText(conversation.status)}
									</span>
								</div>

								<p className='text-xs text-gray-500 truncate'>
									ID: {conversation.conversationId.slice(0, 8)}...
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default ConversationHistory
