'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocale } from '@/Hooks/useLocale'
import { useAiChat } from '@/Hooks/Chat/useAIChat'
import { useGetMe } from '@/Services/account-service'
import useToken from '@/Hooks/Auth/useToken'
import ChatArea from './ChatArea'
import ChatControl from './ChatControl'

// Chat bubble icon component
const ChatBubbleIcon = ({ className = '' }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth={2}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
		/>
	</svg>
)

// Close icon component
const CloseIcon = ({ className = '' }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth={2}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M6 18L18 6M6 6l12 12'
		/>
	</svg>
)

// Minimize icon component
const MinimizeIcon = ({ className = '' }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		viewBox='0 0 24 24'
		stroke='currentColor'
		strokeWidth={2}
	>
		<path strokeLinecap='round' strokeLinejoin='round' d='M20 12H4' />
	</svg>
)

const PopupChatWidget: React.FC = () => {
	const { t } = useLocale()
	const { accessToken } = useToken()
	const { data: userData } = useGetMe()
	const [isOpen, setIsOpen] = useState(false)
	const [isMinimized, setIsMinimized] = useState(false)
	const [hasNewMessage, setHasNewMessage] = useState(false)

	const {
		history,
		inputValue,
		setInputValue,
		inputRef,
		isPending,
		isError,
		sendMessage,
	} = useAiChat()

	// Don't show chat widget if user is not authenticated
	if (!accessToken) {
		return null
	}

	// Add welcome message when first opened
	useEffect(() => {
		if (isOpen && history.length === 0) {
			// Add a small delay to make the welcome message appear after the chat opens
			setTimeout(() => {
				setHasNewMessage(true)
			}, 500)
		}
	}, [isOpen, history.length])

	// Handle opening/closing chat
	const handleToggleChat = () => {
		if (isOpen) {
			setIsOpen(false)
			setIsMinimized(false)
		} else {
			setIsOpen(true)
			setIsMinimized(false)
			setHasNewMessage(false)
		}
	}

	// Handle minimize/maximize
	const handleMinimize = () => {
		setIsMinimized(!isMinimized)
	}

	// Chat widget button with notification dot
	const ChatButton = () => (
		<motion.button
			onClick={handleToggleChat}
			className='relative w-14 h-14 bg-gradient-to-r from-main to-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group'
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
		>
			<ChatBubbleIcon className='w-6 h-6' />

			{/* Notification dot */}
			{hasNewMessage && (
				<motion.div
					className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center'
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.2 }}
				>
					<span className='text-white text-xs font-bold'>!</span>
				</motion.div>
			)}

			{/* Tooltip */}
			<div className='absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
				{t('chat.widget.maximize')}
			</div>
		</motion.button>
	)

	// Chat window
	const ChatWindow = () => (
		<motion.div
			className='bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden'
			style={{ width: '380px', height: isMinimized ? '60px' : '500px' }}
			initial={{ opacity: 0, scale: 0.8, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.8, y: 20 }}
			transition={{ duration: 0.3 }}
		>
			{/* Header */}
			<div className='bg-gradient-to-r from-main to-secondary text-white px-4 py-3 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
						<ChatBubbleIcon className='w-4 h-4' />
					</div>
					<div>
						<h3 className='font-semibold text-sm'>{t('chat.widget.title')}</h3>
						{!isMinimized && (
							<p className='text-xs text-white/80'>
								{t('chat.widget.subtitle')}
							</p>
						)}
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<button
						onClick={handleMinimize}
						className='w-6 h-6 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors'
						title={
							isMinimized
								? t('chat.widget.maximize')
								: t('chat.widget.minimize')
						}
					>
						<MinimizeIcon className='w-4 h-4' />
					</button>
					<button
						onClick={handleToggleChat}
						className='w-6 h-6 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors'
						title={t('chat.widget.close')}
					>
						<CloseIcon className='w-4 h-4' />
					</button>
				</div>
			</div>

			{/* Chat content */}
			{!isMinimized && (
				<div className='flex flex-col h-full'>
					{/* Welcome message or chat history */}
					{history.length === 0 ? (
						<div className='flex-1 flex items-center justify-center p-6'>
							<div className='text-center'>
								<div className='w-16 h-16 bg-gradient-to-r from-main/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
									<ChatBubbleIcon className='w-8 h-8 text-main' />
								</div>
								<p className='text-sm text-gray-600 leading-relaxed'>
									{t('chat.widget.welcome')}
								</p>
							</div>
						</div>
					) : (
						<div className='flex-1 min-h-0'>
							<ChatArea
								history={history}
								isPending={isPending}
								isError={isError}
								userIcon={userData?.avatarUrl}
								consultantIcon=''
							/>
						</div>
					)}

					{/* Chat input */}
					<div className='border-t border-gray-200'>
						<ChatControl
							inputRef={inputRef}
							isPending={isPending}
							inputValue={inputValue}
							setInputValue={setInputValue}
							sendMessage={sendMessage}
						/>
					</div>
				</div>
			)}
		</motion.div>
	)

	return (
		<div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4'>
			<AnimatePresence mode='wait'>
				{isOpen && (
					<motion.div
						key='chat-window'
						initial={{ opacity: 0, scale: 0.8, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 20 }}
						transition={{ duration: 0.3 }}
					>
						<ChatWindow />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Always show the chat button */}
			<ChatButton />
		</div>
	)
}

export default PopupChatWidget
