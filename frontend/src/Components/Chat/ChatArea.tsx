'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Content } from '@google/genai'
import { motion } from 'framer-motion'
import ChatMessage from './ChatMessage'
import ErrorMessage from './ErrorMessage'
import LoadingMessage from './LoadingMessage'
import ScrollButton from './ScrollButton'

const ChatArea = ({
	history,
	isPending,
	isError,
	userIcon,
	consultantIcon,
	withImage = true,
}: {
	history: Content[]
	isPending: boolean
	isError: boolean
	userIcon?: string
	consultantIcon?: string
	withImage: boolean
}) => {
	const chatContainerRef = useRef<HTMLDivElement>(null)
	const [showScrollButton, setShowScrollButton] = useState(false)
	const wasAtBottomRef = useRef(true)

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({
				top: chatContainerRef.current.scrollHeight,
				behavior: 'smooth',
			})
		}
	}

	const isAtBottom = () => {
		if (chatContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
			return scrollHeight - scrollTop - clientHeight < 10
		}
		return false
	}

	useEffect(() => {
		const handleScroll = () => {
			const atBottom = isAtBottom()
			setShowScrollButton(!atBottom)
			wasAtBottomRef.current = atBottom
		}

		const container = chatContainerRef.current
		container?.addEventListener('scroll', handleScroll)
		handleScroll()
		return () => container?.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		if (wasAtBottomRef.current && !isPending) {
			scrollToBottom()
		}
	}, [history, isPending])

	return (
		<div className='relative flex-1 scroll-bar overflow-scroll'>
			<motion.div
				ref={chatContainerRef}
				className='flex-1 overflow-y-auto space-y-5 px-3 sm:px-5 py-8 scroll-bar'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
			>
				{history.map((entry, index) => (
					<ChatMessage
						key={index}
						entry={entry}
						isUser={entry.role === 'user'}
						userIcon={userIcon}
						consultantIcon={consultantIcon}
						withImage={withImage}
					/>
				))}
				{isPending && <LoadingMessage consultantIcon={consultantIcon} />}
				{isError && <ErrorMessage />}
			</motion.div>
			{showScrollButton && <ScrollButton onClick={scrollToBottom} />}
		</div>
	)
}

export default ChatArea
