'use client'

import React from 'react'
import { useConsultantConversationHistory } from '@/Services/chat-service'
import { useLocale } from '@/Hooks/useLocale'
import { format } from 'date-fns'
import { User, MessageCircle } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

interface ConsultantConversationHistoryProps {
	onSelectConversation?: (conversationId: string) => void
	selectedConversationId?: string | null
	className?: string
}

interface ConsultantConversationHistoryItem {
	conversationId: string
	staffId?: string
	memberId: string
	memberName?: string
	memberAvatarUrl?: string
	startAt: string
	status: boolean
}

const ConsultantConversationHistory: React.FC<
	ConsultantConversationHistoryProps
> = ({ onSelectConversation, selectedConversationId, className }) => {
	const { t } = useLocale()
	const {
		data: conversations,
		isLoading,
		error,
	} = useConsultantConversationHistory()

	const formatDate = (dateString: string) => {
		try {
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

	const getStatusIcon = (status: boolean) => {
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
					<p className='text-xs mt-1'>{t('chat.no_patient_conversations')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className={`${className}`}>
			<div className='space-y-1 p-2'>
				{conversations.map(
					(conversation: ConsultantConversationHistoryItem) => (
						<div
							key={conversation.conversationId}
							onClick={() => {
								onSelectConversation?.(conversation.conversationId)
							}}
							className={`p-3 rounded-lg cursor-pointer transition-colors border ${
								selectedConversationId === conversation.conversationId
									? 'bg-green-50 border-green-200'
									: 'hover:bg-gray-50 border-transparent hover:border-gray-200'
							}`}
						>
							<div className='flex items-start space-x-3'>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
										conversation.status ? 'bg-green-500' : 'bg-gray-500'
									}`}
								>
									{conversation.memberAvatarUrl ? (
										<CldImage
											src={conversation.memberAvatarUrl}
											width={40}
											height={40}
											alt={conversation.memberName || 'Patient Avatar'}
											className='w-10 h-10 rounded-full object-cover'
											style={{ objectFit: 'cover' }}
										/>
									) : (
										<User className='w-4 h-4 text-white' />
									)}
								</div>

								<div className='flex-1 min-w-0'>
									<div className='flex items-center justify-between mb-1'>
										<span className='text-sm font-medium text-gray-800 truncate'>
											{conversation.memberName || t('chat.patient')}
										</span>
										<span className='text-xs text-gray-500'>
											{formatDate(conversation.startAt)}
										</span>
									</div>

									<div className='flex items-center space-x-2 mb-1'>
										<span className='text-sm'>
											{getStatusIcon(conversation.status)}
										</span>
										<span
											className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
												conversation.status
											)}`}
										>
											{getStatusText(conversation.status)}
										</span>
									</div>

									<p className='text-xs text-gray-500 truncate'>
										ID: {conversation.conversationId.slice(0, 8)}...
									</p>
								</div>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	)
}

export default ConsultantConversationHistory
