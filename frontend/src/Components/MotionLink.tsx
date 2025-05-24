import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

const MotionLink = motion(Link)

interface MotionLinkProps {
	href: string
	children: React.ReactNode
	className?: string
	[key: string]: any
}

const AnimatedLink = ({
	href,
	children,
	className,
	...props
}: MotionLinkProps) => {
	return (
		<MotionLink
			href={href}
			className={className}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			{...props}
		>
			{children}
		</MotionLink>
	)
}

export default AnimatedLink
