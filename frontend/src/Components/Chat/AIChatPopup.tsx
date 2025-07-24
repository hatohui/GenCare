'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAiChat } from '@/Hooks/Chat/useAIChat'
import ChatArea from './ChatArea'
import ChatControl from './ChatControl'

const AIChatPopup = () => {
	const [open, setOpen] = useState(false)
	const {
		history,
		inputValue,
		setInputValue,
		inputRef,
		isPending,
		isError,
		sendMessage,
	} = useAiChat()

	return (
		<>
			{/* Floating Button */}
			<motion.button
				className='fixed bottom-6 right-6 z-[1000] bg-accent text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-200'
				onClick={() => setOpen(true)}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.95 }}
				aria-label='Open AI Chat'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-7 w-7'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.963 7.963 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
					/>
				</svg>
			</motion.button>

			{/* Chat Modal */}
			<AnimatePresence>
				{open && (
					<motion.div
						className='fixed inset-0 z-[1100] flex items-end justify-end pointer-events-none'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className='m-6 w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col h-[70vh] pointer-events-auto border border-gray-200 relative'
							initial={{ y: 100, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 100, opacity: 0 }}
							transition={{ duration: 0.25, ease: 'easeOut' }}
						>
							{/* Close Button */}
							<button
								className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10'
								onClick={() => setOpen(false)}
								aria-label='Close AI Chat'
							>
								×
							</button>
							{/* Chat Area */}
							<div className='flex flex-col flex-1 min-h-0'>
								<ChatArea
									history={history}
									isPending={isPending}
									isError={isError}
									userIcon={undefined}
									consultantIcon={undefined}
								/>
								<ChatControl
									inputRef={inputRef}
									inputValue={inputValue}
									isPending={isPending}
									setInputValue={setInputValue}
									sendMessage={sendMessage}
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

export default AIChatPopup
