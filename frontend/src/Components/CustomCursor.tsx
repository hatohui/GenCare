'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
	const x = useMotionValue(-100)
	const y = useMotionValue(-100)
	const [isHovering, setIsHovering] = useState(false)
	const [isClicking, setIsClicking] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () =>
			/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
				navigator.userAgent
			)

		setIsMobile(checkMobile())
	}, [])

	useEffect(() => {
		if (isMobile) return

		const onMove = (e: MouseEvent) => {
			const px = e.clientX
			const py = e.clientY
			x.set(px - 10)
			y.set(py - 10)

			const el = document.elementFromPoint(px, py)
			setIsHovering(!!el?.closest('a, button, input, textarea, select'))
		}

		const onDown = () => setIsClicking(true)
		const onUp = () => setIsClicking(false)

		window.addEventListener('mousemove', onMove)
		window.addEventListener('mousedown', onDown)
		window.addEventListener('mouseup', onUp)

		return () => {
			window.removeEventListener('mousemove', onMove)
			window.removeEventListener('mousedown', onDown)
			window.removeEventListener('mouseup', onUp)
		}
	}, [x, y, isMobile])

	if (isMobile) return null

	const scale = isClicking ? 0.7 : isHovering ? 2 : 1

	return (
		<motion.div
			className='custom-cursor'
			style={{ x, y }}
			animate={{ scale }}
			transition={{ type: 'spring', stiffness: 300, damping: 20 }}
		/>
	)
}
