import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import SignUp from './SignUp'
import { Icon } from './Icon'
import MobileMenu from './MobileMenu'

export const NavBar = () => {
	const [showNav, setShowNav] = useState(true)
	const [onTop, setOnTop] = useState(false)
	const lastScrollY = useRef(0)

	useEffect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY

			if (currentScrollY > 100) {
				setOnTop(true)
			} else {
				setOnTop(false)
			}

			if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
				setShowNav(false)
			} else {
				setShowNav(true)
			}

			lastScrollY.current = currentScrollY
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<AnimatePresence>
			{showNav && (
				<motion.nav
					key='navbar'
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
						},
					}}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
					className='fixed top-4 left-1/2 transform -translate-x-1/2 duration-300 flex items-center justify-between max-w-4xl px-4 py-2 rounded-full w-[90vw] z-50'
				>
					<Icon />
					<SignUp className='hidden md:block' />
					<MobileMenu className='block md:hidden inset-0' />
					<div
						className={`absolute transition-opacity rounded-full duration-200 inset-0 w-full h-full bg-linear-to-r/decreasing from-pink-400 to-white shadow-lg -z-30 ${
							onTop ? 'opacity-100' : 'opacity-0'
						}`}
					/>
				</motion.nav>
			)}
		</AnimatePresence>
	)
}
