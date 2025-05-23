'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
	const x = useMotionValue(-100)
	const y = useMotionValue(-100)
	const [isHovering, setIsHovering] = useState(false)

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			const px = e.clientX
			const py = e.clientY
			x.set(px)
			y.set(py)

			// detect if we're over an interactive element
			const el = document.elementFromPoint(px, py)
			setIsHovering(!!el?.closest('a, button, input, textarea, select'))
		}
		window.addEventListener('mousemove', onMove)
		return () => window.removeEventListener('mousemove', onMove)
	}, [x, y])

	return (
		<motion.div
			className='custom-cursor'
			style={{ x, y }}
			animate={{ scale: isHovering ? 2 : 1 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20 }}
		/>
	)
}
