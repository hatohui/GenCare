// Shared animation variants for landing page components
// This helps reduce motion usage by reusing common animations

export const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: 'easeOut' },
}

export const fadeInLeft = {
	initial: { opacity: 0, x: -30 },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.6, ease: 'easeOut' },
}

export const fadeInRight = {
	initial: { opacity: 0, x: 30 },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.6, ease: 'easeOut' },
}

export const scaleIn = {
	initial: { opacity: 0, scale: 0.8 },
	animate: { opacity: 1, scale: 1 },
	transition: { duration: 0.5, ease: 'easeOut' },
}

export const cardVariants = {
	initial: { opacity: 0, y: 40 },
	whileInView: { opacity: 1, y: 0 },
	whileHover: { y: -6, scale: 1.02, transition: { duration: 0.1 } },
}

export const itemVariants = {
	initial: { opacity: 0, y: 20 },
	whileInView: { opacity: 1, y: 0 },
	whileHover: { y: -4, scale: 1.01, transition: { duration: 0.1 } },
}

export const iconVariants = {
	whileHover: { scale: 1.05, rotate: 3, transition: { duration: 0.1 } },
}

export const textVariants = {
	whileHover: { scale: 1.02, transition: { duration: 0.2 } },
}

export const buttonVariants = {
	whileHover: { scale: 1.03, transition: { duration: 0.2 } },
	whileTap: { scale: 0.97 },
}

export const floatingAnimation = {
	animate: {
		y: [0, -8, 0],
		transition: {
			duration: 4,
			repeat: Infinity,
			ease: 'easeInOut',
		},
	},
}

export const backgroundGlow = {
	animate: {
		scale: [1, 1.1, 1],
		opacity: [0.1, 0.15, 0.1],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: 'easeInOut',
		},
	},
}

// Stagger animation for lists
export const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
}

export const staggerItem = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 },
}
