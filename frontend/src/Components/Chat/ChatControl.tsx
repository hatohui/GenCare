'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/Hooks/useLocale'

const SendIcon = ({ className = '' }: { className?: string }) => (
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
			d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
		/>
	</svg>
)

const ChatControl = ({
	inputRef,
	inputValue,
	isPending,
	setInputValue,
	sendMessage,
}: {
	inputRef: React.RefObject<HTMLInputElement | null>
	inputValue: string
	isPending: boolean
	setInputValue: React.Dispatch<React.SetStateAction<string>>
	sendMessage: () => void
}) => {
	const { t } = useLocale()

	return (
		<motion.div
			className='flex p-4 gap-3'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
		>
			<motion.input
				ref={inputRef}
				type='text'
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				className='flex-1 px-4 py-2 rounded-full border border-gray-300 focus:border-main focus:outline-none transition-colors duration-200 text-sm'
				placeholder={t('chat.widget.placeholder')}
				disabled={isPending}
				onKeyDown={e => {
					if (e.key === 'Enter' && !isPending) {
						sendMessage()
					}
				}}
			/>
			<motion.button
				onClick={sendMessage}
				disabled={isPending || !inputValue.trim()}
				className='w-10 h-10 rounded-full bg-gradient-to-r from-main to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
				whileHover={isPending || !inputValue.trim() ? {} : { scale: 1.05 }}
				whileTap={isPending || !inputValue.trim() ? {} : { scale: 0.95 }}
				transition={{ duration: 0.2 }}
			>
				<SendIcon className='w-4 h-4' />
			</motion.button>
		</motion.div>
	)
}

export default ChatControl
