import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import SignUp from './SignUp'
import { Icon } from './Icon'

export const NavBar = () => {
	const [showNav, setShowNav] = useState(true)
	const [onTop, setOnTop] = useState(false)
	const lastScrollY = useRef(0)
	//

	useEffect(() => {
		function handleScroll() {
			const currentScrollY = window.scrollY

			// Add background once we scroll down some px (e.g. 10)
			if (currentScrollY > 100) {
				setOnTop(true)
			} else {
				setOnTop(false)
			}

			// Hide nav if scrolling down, show if scrolling up
			if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
				// scrolling down & past 50px => hide
				setShowNav(false)
			} else {
				// scrolling up => show
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
					initial={{ y: -80, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -80, opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
					className={`fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-between max-w-4xl px-4 py-2 rounded-full w-[90vw] z-50
            ${
							onTop
								? 'bg-linear-to-r/decreasing from-pink-400 to-white shadow-lg'
								: 'bg-transparent'
						}
          `}
					style={{ backdropFilter: onTop ? 'blur(8px)' : 'none' }}
				>
					<Icon />
					<SignUp />
				</motion.nav>
			)}
		</AnimatePresence>
	)
}
