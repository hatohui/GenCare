'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { useLocale } from '@/Hooks/useLocale'

const BackToTop = () => {
	const { t } = useLocale()
	const [isVisible, setIsVisible] = useState(false)
	const [isAnimating, setIsAnimating] = useState(false)

	// Show button when page is scrolled up to given distance
	const toggleVisibility = () => {
		if (window.scrollY > 300) {
			setIsVisible(true)
		} else {
			setIsVisible(false)
		}
	}

	// Set the scroll event listener
	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility)
		return () => {
			window.removeEventListener('scroll', toggleVisibility)
		}
	}, [])

	// Scroll to top handler
	const scrollToTop = () => {
		setIsAnimating(true)
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
		// Reset animation after scroll completes (typically 1-1.5 seconds)
		setTimeout(() => setIsAnimating(false), 1500)
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					initial={{ opacity: 0, scale: 0, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0, y: 20 }}
					transition={{
						type: 'spring',
						stiffness: 260,
						damping: 20,
					}}
					onClick={scrollToTop}
					className='fixed bottom-8 right-8 z-50 group'
					aria-label='Scroll to top'
				>
					{/* Main button with gradient background */}
					<motion.div
						whileHover={{
							scale: 1.1,
							transition: { duration: 0.3, ease: 'easeInOut' },
						}}
						whileTap={{ scale: 0.9 }}
						className='relative w-14 h-14 bg-gradient-to-br from-main to-secondary rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group-hover:from-secondary group-hover:to-main'
					>
						{/* Animated background glow */}
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
							className='absolute inset-0 bg-gradient-to-br from-accent/30 to-main/30 rounded-full blur-md'
						/>

						{/* Arrow icon */}
						<motion.svg
							className='w-6 h-6 text-accent relative z-10'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							animate={
								isAnimating
									? {
											y: [0, -200],
											opacity: [1, 0],
											scale: [1, 0.8],
											rotate: [0, -10],
									  }
									: {
											y: [2, -2, 2],
									  }
							}
							transition={
								isAnimating
									? {
											duration: 1.2,
											ease: 'easeInOut',
									  }
									: {
											duration: 2,
											repeat: Infinity,
											ease: 'easeInOut',
									  }
							}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2.5}
								d='M12 19V5M5 12l7-7 7 7'
							/>
						</motion.svg>

						{/* Hover effect ring */}
						<motion.div
							initial={{ scale: 0, opacity: 0 }}
							whileHover={{ scale: 1.2, opacity: 1 }}
							transition={{ duration: 0.3 }}
							className='absolute inset-0 border-2 border-accent/50 rounded-full'
						/>
					</motion.div>

					{/* Tooltip */}
					<motion.div
						initial={{ opacity: 0, x: 10 }}
						whileHover={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.2 }}
						className='absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200'
					>
						{t('common.back_to_top')}
						{/* Arrow pointing to button */}
						<div className='absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent' />
					</motion.div>
				</motion.button>
			)}
		</AnimatePresence>
	)
}

export default BackToTop
