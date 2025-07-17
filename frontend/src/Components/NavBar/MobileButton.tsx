'use client'
import { motion } from 'framer-motion'
import React from 'react'
import { MobileMenu } from './MobileMenu'
import { NavComponentProps } from '@/Interfaces/NavBar/Types/NavBarComponents'
import { useLocale } from '@/Hooks/useLocale'

const MobileButton = ({
	className,
	isOpened,
	setOpened,
	onTop,
}: NavComponentProps & MobileMenu) => {
	const { t } = useLocale()

	return (
		<>
			<button
				className={`${className} relative size-8 flex items-center justify-center touch-manipulation z-50`}
				id='icon'
				onClick={() => setOpened(!isOpened)}
				onTouchEnd={() => setOpened(!isOpened)}
				aria-expanded={isOpened}
				aria-label={isOpened ? t('nav.closeMenu') : t('nav.openMenu')}
				aria-controls='mobile-menu'
			>
				<motion.svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 26 25'
					strokeWidth={1.5}
					stroke={onTop ? 'var(--color-main)' : 'white'}
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
