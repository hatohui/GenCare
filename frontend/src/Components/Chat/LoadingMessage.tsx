'use client'

import { motion } from 'motion/react'
import { CldImage } from 'next-cloudinary'
import FallBackUserImage from '../Profile/FallBackUserImage'
import { useLocale } from '@/Hooks/useLocale'

const LoadingMessage = ({ consultantIcon }: { consultantIcon?: string }) => {
	const { t } = useLocale()
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
			className='flex justify-start'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
		>
			<div className='flex items-start gap-2 sm:gap-3'>
				{consultantIcon ? (
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
				)}
				<motion.div
					className='max-w-[70%] sm:max-w-[60%] px-3 py-1.5 rounded-xl shadow-md bg-general/80 text-text rounded-bl-none'
					variants={bubbleVariants}
				>
					<motion.div
						className='flex items-center gap-2'
						variants={textVariants}
					>
						<svg
							className='animate-spin h-5 w-5 text-text'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
						>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'
							/>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
							/>
						</svg>
						<motion.p
							className='text-xs sm:text-sm text-text'
							variants={textVariants}
						>
							{t('chat.thinking')}
						</motion.p>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	)
}

export default LoadingMessage
