import { NAV_OPTIONS } from '@/Constants/NavBar'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export type MobileMenu = {
	isOpened: boolean
	setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileMenu = ({ isOpened, setOpened }: MobileMenu) => {
	const path = usePathname()
	return (
		<AnimatePresence>
			{isOpened && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className='md:hidden flex flex-col overflow-hidden fixed top-0 left-0 w-screen h-screen bg-white/5 backdrop-blur-lg shadow-lg z-50'
					id='mobile-menu'
				>
					<div
						className='absolute right-6 top-4 '
						onClick={() => setOpened(!isOpened)}
						onTouchEnd={() => setOpened(!isOpened)}
						aria-expanded={isOpened}
						aria-label={isOpened ? 'Close menu' : 'Open menu'}
						aria-controls='mobile-menu'
					>
						<motion.svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 26 26'
							strokeWidth={1.5}
							stroke='var(--color-main)'
							className='size-8'
							initial='hide'
							animate={isOpened ? 'hide' : 'show'}
							variants={{
								hide: { opacity: 1, zIndex: 50 },
								show: { opacity: 0 },
							}}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18 18 6M6 6l12 12'
							/>
						</motion.svg>
					</div>
					<div className='h-[10%] w-full'></div>
					<nav className='w-full text-center'>
						{NAV_OPTIONS.map((button, index) => (
							<Link
								key={index}
								href={button.to}
								onClick={() => setOpened(!isOpened)}
								className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors ${
									button.to === path
										? 'bg-gray-700 text-white pointer-events-none'
										: 'hover:bg-gray-100'
								}`}
							>
								{button.label}
							</Link>
						))}
						<Link
							href='/login'
							className='block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors'
						>
							Login
						</Link>
					</nav>
					<div className='h-[10%] w-full'></div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

//

export default MobileMenu
