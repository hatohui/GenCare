'use client'
import { motion } from 'framer-motion'
import React from 'react'
import { MobileMenu } from './MobileMenu'
import { NavComponentProps } from './NavBar'

const MobileButton = ({
	className,
	isOpened,
	setOpened,
}: NavComponentProps & MobileMenu) => {
	return (
		<>
			<button
				className={`${className} relative size-8 flex items-center justify-center touch-manipulation z-50`}
				id='icon'
				onClick={() => setOpened(!isOpened)}
				onTouchEnd={() => setOpened(!isOpened)}
				aria-expanded={isOpened}
				aria-label={isOpened ? 'Close menu' : 'Open menu'}
				aria-controls='mobile-menu'
			>
				<motion.svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 26 25'
					strokeWidth={1.5}
					stroke='var(--color-main)'
					className='size-8 absolute inset-0'
					initial='hide'
					animate={isOpened ? 'hide' : 'show'}
					variants={{
						hide: { opacity: 0 },
						show: { opacity: 1, zIndex: 50 },
					}}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
					/>
				</motion.svg>
			</button>
		</>
	)
}

export default MobileButton
