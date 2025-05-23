import { motion } from 'framer-motion'

export type IconProp = {
	className?: string
}

export const Icon = ({ className }: IconProp) => {
	return (
		<motion.div
			className={`rounded-full rounded-br-none bg-white w-10 h-7 ${className}`}
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
			whileHover={{ scale: 1.2 }}
		/>
	)
}
