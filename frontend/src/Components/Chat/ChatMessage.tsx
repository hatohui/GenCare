'use client'
import { Content } from '@google/genai'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { CldImage } from 'next-cloudinary'
import FallBackUserImage from '../Profile/FallBackUserImage'

const ChatMessage = ({
	entry,
	isUser,
	userIcon,
	consultantIcon,
}: {
	entry: Content
	isUser: boolean
	userIcon?: string
	consultantIcon?: string
}) => {
	const text = entry.parts?.[0].text || ''
	const bubbleVariants = {
		initial: { opacity: 0, scale: 0.95, y: 10 },
		animate: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
		},
		exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
	}
	const textVariants = {
		initial: { opacity: 0, y: 8 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
		},
		exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
	}
	const iconVariants = {
		initial: { opacity: 0, scale: 0.8 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.2 },
		},
		exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
	}

	return (
		<motion.div
			className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
		>
			<div
				className={`flex gap-2 sm:gap-3 w-full items-start ${
					isUser ? 'justify-end' : 'justify-start'
				}`}
			>
				{!isUser &&
					(consultantIcon ? (
						<motion.div variants={iconVariants}>
							<CldImage
								src={consultantIcon}
								alt='Consultant Icon'
								className='w-8 h-8 sm:w-9 sm:h-9 rounded-full mt-1.5'
								width={36}
								height={36}
							/>
						</motion.div>
					) : (
						<motion.div variants={iconVariants}>
							<FallBackUserImage className='w-8 h-8 sm:w-9 sm:h-9 rounded-full mt-1.5' />
						</motion.div>
					))}
				<motion.div
					className={clsx(
						'px-3 py-1.5 max-w-[50%] rounded-xl shadow-md',
						isUser
							? 'bg-accent text-white rounded-br-none'
							: 'bg-general text-slate-950 rounded-bl-none'
					)}
					variants={bubbleVariants}
				>
					<motion.p
						className='text-xs sm:text-sm leading-relaxed whitespace-pre-line'
						variants={textVariants}
					>
						{text}
					</motion.p>
					<motion.div
						className={clsx(
							'mt-1 flex items-center gap-1.5 text-[10px]',
							isUser ? 'justify-end text-white/80' : 'justify-start text-text'
						)}
						variants={textVariants}
					>
						<span className='whitespace-nowrap'>
							{new Date().toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
						{isUser && (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-3.5 w-3.5 text-white/80'
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
					</motion.div>
				</motion.div>
				{isUser &&
					(userIcon ? (
						<motion.div variants={iconVariants}>
							<CldImage
								src={userIcon}
								alt='User icon'
								className='w-8 h-8 sm:w-9 sm:h-9 rounded-full mt-1.5'
								width={36}
								height={36}
							/>
						</motion.div>
					) : (
						<motion.div variants={iconVariants}>
							<FallBackUserImage className='w-8 h-8 sm:w-9 sm:h-9 rounded-full mt-1.5' />
						</motion.div>
					))}
			</div>
		</motion.div>
	)
}

export default ChatMessage
