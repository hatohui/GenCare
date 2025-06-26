import clsx from 'clsx'
import React from 'react'
const ChatArea = ({
	messages,
}: {
	messages: { text: string; from: string }[]
}) => {
	return (
		<div className='flex-1 overflow-y-auto space-y-3 px-4 py-6 scroll-bar'>
			{messages.map((message, index) => {
				const isUser = message.from === 'You'

				return (
					<div
						key={index}
						className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}
					>
						<div
							className={clsx(
								'max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-2xl shadow-sm',
								isUser
									? 'bg-accent text-white rounded-br-none'
									: 'bg-gray-100 text-gray-800 rounded-bl-none'
							)}
						>
							<p className='text-sm whitespace-pre-line'>{message.text}</p>
							<div
								className={clsx(
									'mt-1 flex items-center gap-1 text-xs',
									isUser
										? 'justify-end text-white/70'
										: 'justify-start text-gray-500'
								)}
							>
								<span>
									{new Date().toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
								{isUser && (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 text-white/80'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path
											fillRule='evenodd'
											d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
											clipRule='evenodd'
										/>
									</svg>
								)}
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default ChatArea
