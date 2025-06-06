'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_TOP_AREA, NAV_TOP_OFFSET } from '@/Constants/NavBar'
import MobileButton from './MobileButton'
import Logo from './NavLogo'
import MobileMenu from './MobileMenu'
import NavButtons from './NavButtons'
import UserActionButton from './UserActionButton'

export type NavComponentProps = { className?: string; onTop: boolean }

const NavBar = () => {
	const [showNav, setShowNav] = useState(true)
	const [isOpened, setOpened] = useState(false)
	const [onTop, setOnTop] = useState(true)
	const lastScrollY = useRef(0)

	useEffect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY

			setOnTop(currentScrollY < NAV_TOP_AREA)
			setShowNav(
				!(
					currentScrollY > lastScrollY.current &&
					window.pageYOffset > NAV_TOP_OFFSET
				)
			)

			lastScrollY.current = currentScrollY
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<>
			<AnimatePresence>
				{showNav && (
					<motion.header
						className='fixed top-0 mt-[1%] left-1/2 overflow-clip -translate-x-1/2 px-4 py-2 rounded-full w-[98%] md:w-[90dvw] z-40 backdrop-blur-md'
						initial='hidden'
						animate={onTop ? 'onTop' : 'visible'}
						exit='exit'
						variants={{
							hidden: {
								y: -80,
								opacity: 0,
								filter: 'blur(8px)',
								backdropFilter: 'blur(0)',
							},
							visible: {
								y: 0,
								maxWidth: 'var(--container-4xl)',
								opacity: 1,
								scale: 1,
								filter: 'none',
								transition: { duration: 0.4, ease: 'easeInOut' },
								backdropFilter: 'blur(5px)',
							},
							exit: {
								y: -80,
								opacity: 0,
								filter: 'blur(8px)',
								backdropFilter: 'blur(5)',
								transition: { duration: 0.4, ease: 'easeInOut' },
							},
							onTop: {
								y: 0,
								opacity: 1,
								scale: 0.95,
								filter: 'none',
								maxWidth: '100dvw',
								transition: {
									type: 'spring',
									stiffness: 100,
									damping: 12,
									mass: 0.1,
									duration: 1,
									ease: 'easeInOut',
								},
								backdropFilter: 'blur(0px)',
							},
						}}
						role='banner'
						aria-label='Main navigation'
						itemScope
						itemType='http://schema.org/SiteNavigationElement'
					>
						<motion.div
							className='absolute rounded-full inset-0 bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-600/80 shadow-lg backdrop-blur-sm -z-30'
							animate={onTop ? 'onTop' : 'none'}
							variants={{
								onTop: {
									opacity: 0,
								},
								none: {
									opacity: 0.98,
								},
							}}
						/>

						{/* NavBar */}
						<nav
							className='flex items-center justify-between'
							key='navbar'
							role='navigation'
							aria-label='Primary navigation'
						>
							<Logo onTop={onTop} />
							<NavButtons
								className='hidden md:flex'
								onTop={onTop}
								aria-label='Navigation menu'
							/>
							<div role='group' aria-label='User actions'>
								<UserActionButton
									className='hidden md:flex'
									onTop={onTop}
									aria-label='User actions'
								/>
								<MobileButton
									className='block md:hidden inset-0'
									onTop={onTop}
									isOpened={isOpened}
									setOpened={setOpened}
									aria-label='Mobile menu'
									aria-expanded={isOpened}
								/>
							</div>
						</nav>
					</motion.header>
				)}
			</AnimatePresence>
			<MobileMenu
				isOpened={isOpened}
				setOpened={setOpened}
				aria-hidden={!isOpened}
			/>
		</>
	)
}

export default NavBar
