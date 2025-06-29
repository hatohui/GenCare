'use client'
import React from 'react'
import { motion } from 'framer-motion'

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
	return (
		<motion.div
			className='flex p-4 gap-2'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
		>
			<motion.input
				ref={inputRef}
				type='text'
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				className='flex-1 px-4 py-2 rounded-md border border-secondary transition duration-200 bg-general'
				onKeyDown={e => {
					if (e.key === 'Enter') {
						sendMessage()
					}
				}}
			/>
			<motion.button
				onClick={sendMessage}
				disabled={isPending}
				className='px-4 py-2 rounded-md bg-gradient-to-r from-main to-secondary text-white disabled:brightness-75'
				whileHover={isPending ? {} : { scale: 1.05 }}
				whileTap={isPending ? {} : { scale: 0.95 }}
				transition={{ duration: 0.2 }}
			>
				Send
			</motion.button>
		</motion.div>
	)
}

export default ChatControl
