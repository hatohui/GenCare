'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

interface ReturnButtonProps {
	to?: string
	variant?: 'default' | 'white' | 'ghost'
	className?: string
}

const ReturnButton: React.FC<ReturnButtonProps> = ({
	to,
	variant = 'default',
	className = '',
}) => {
	const router = useRouter()

	const getVariantClasses = () => {
		switch (variant) {
			case 'white':
				return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
			case 'ghost':
				return 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
			default:
				return 'bg-accent text-white hover:bg-accent/90'
		}
	}

	return (
		<motion.button
			onClick={() => {
				if (to) router.push(to)
				else router.back()
			}}
			className={`
				flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg 
				transition-all duration-200 hover:scale-105 hover:shadow-lg
				${getVariantClasses()}
				${className}
			`}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
		>
			<svg
				className='w-4 h-4'
				fill='none'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M15 19l-7-7 7-7'
				/>
			</svg>
			Back
		</motion.button>
	)
}

export default ReturnButton
