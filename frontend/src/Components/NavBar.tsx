'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './NavBar/Icon'
import MobileMenu from './NavBar/MobileMenu'
import UserActionButton from './NavBar/UserActionButton'
import NavButtons from './NavBar/NavButtons'
import MobileButtons from './NavBar/MobileButtons'

export type NavComponentProps = { className?: string; onTop: boolean }

const NavBar = () => {
	const [showNav, setShowNav] = useState(true)
	const [isOpened, setOpened] = useState(false)
	const [onTop, setOnTop] = useState(true)
	const lastScrollY = useRef(0)

	useEffect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY

			setOnTop(currentScrollY < 100)
			setShowNav(
				!(currentScrollY > lastScrollY.current && window.pageYOffset > 450)
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
						className='fixed top-0 mt-[1%] left-1/2 overflow-clip -translate-x-1/2 max-w-4xl px-4 py-2 rounded-full w-[98%] md:w-[90dvw] z-40'
						initial='hidden'
						animate={onTop ? 'onTop' : 'visible'}
						exit='exit'
						variants={{
							hidden: { y: -80, opacity: 0 },
							visible: {
								y: 0,
								opacity: 1,
								backdropFilter: 'blur(8px)',
							},
							exit: { y: -80, opacity: 0 },
							onTop: {
								y: 0,
								opacity: 1,
								backdropFilter: 'none',
								scale: 0.9,
							},
						}}
						transition={{ duration: 0.4, ease: 'easeInOut' }}
						role='banner'
						aria-label='Main navigation'
					>
						{/*Nav Background */}
						<motion.div
							className='absolute rounded-full inset-0 bg-linear-to-r/decreasing from-main to-secondary shadow-lg -z-30'
							animate={onTop ? 'onTop' : 'none'}
							variants={{
								onTop: {
									opacity: 0,
								},
								none: {
									opacity: 1,
								},
							}}
						/>
						<nav
							className='flex items-center justify-between'
							key='navbar'
							role='navigation'
						>
							<Logo onTop={onTop} />
							<NavButtons className='hidden md:flex' onTop={onTop} />
							<div>
								<UserActionButton className='hidden md:flex' onTop={onTop} />
								<MobileMenu
									className='block md:hidden inset-0'
									onTop={onTop}
									isOpened={isOpened}
									setOpened={setOpened}
								/>
							</div>
						</nav>
					</motion.header>
				)}
			</AnimatePresence>
			<MobileButtons isOpened={isOpened} setOpened={setOpened} />
		</>
	)
}

export default NavBar
