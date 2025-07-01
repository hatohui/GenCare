'use client'

import React from 'react'
import { motion } from 'motion/react'

interface BackgroundCirclesProps {
	className?: string
	circleCount?: number
	dotCount?: number
	zIndex?: string
	circleSize?: number
	dotSize?: number
	animationDuration?: number
	delayMultiplier?: number
}

const BackgroundCircles: React.FC<BackgroundCirclesProps> = ({
	className = '',
	circleCount = 6,
	dotCount = 8,
	zIndex = 'z-0',
	circleSize = 30,
	dotSize = 6,
	animationDuration = 15,
	delayMultiplier = 1.5,
}) => {
	const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)

		const handleChange = (e: MediaQueryListEvent) => {
			setPrefersReducedMotion(e.matches)
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	// Adjust counts for reduced motion
	const adjustedCircleCount = prefersReducedMotion
		? Math.max(2, circleCount / 2)
		: circleCount
	const adjustedDotCount = prefersReducedMotion
		? Math.max(4, dotCount / 2)
		: dotCount

	return (
		<div className={`fixed inset-0 pointer-events-none ${zIndex} ${className}`}>
			{/* Floating Background Circles */}
			{[...Array(adjustedCircleCount)].map((_, i) => (
				<motion.div
					key={i}
					className='absolute rounded-full bg-gradient-to-br from-blue-300/60 to-blue-400/50'
					style={{
						width: `${80 + i * circleSize}px`,
						height: `${80 + i * circleSize}px`,
						left: `${10 + i * 12}%`,
						top: `${20 + i * 8}%`,
						willChange: 'transform, opacity',
					}}
					animate={
						prefersReducedMotion
							? {
									opacity: [0.4, 0.6, 0.4],
							  }
							: {
									y: [0, -120, 0],
									x: [0, 60, 0],
									rotate: [0, 180, 360],
									scale: [1, 1.3, 1],
									opacity: [0.4, 0.8, 0.4],
							  }
					}
					transition={
						prefersReducedMotion
							? {
									duration: 4,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: i * 0.5,
							  }
							: {
									duration: animationDuration + i * 2,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: i * delayMultiplier,
							  }
					}
				/>
			))}

			{/* Smaller floating dots */}
			{[...Array(adjustedDotCount)].map((_, i) => (
				<motion.div
					key={`dot-${i}`}
					className='absolute rounded-full bg-blue-400/70'
					style={{
						width: `${12 + (i % 3) * dotSize}px`,
						height: `${12 + (i % 3) * dotSize}px`,
						left: `${5 + i * 8}%`,
						top: `${10 + i * 6}%`,
						willChange: 'transform, opacity',
					}}
					animate={
						prefersReducedMotion
							? {
									opacity: [0.3, 0.6, 0.3],
							  }
							: {
									y: [0, -100, 0],
									x: [0, 40, 0],
									opacity: [0.3, 0.9, 0.3],
									scale: [1, 1.6, 1],
							  }
					}
					transition={
						prefersReducedMotion
							? {
									duration: 3,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: i * 0.3,
							  }
							: {
									duration: 12 + i * 1.5,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: i * 0.8,
							  }
					}
				/>
			))}
		</div>
	)
}

export default BackgroundCircles
