import { motion } from 'framer-motion'

export const Icon = () => {
	return (
		<motion.div
			className='rounded-full rounded-br-none bg-white w-10 h-7'
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
			whileHover={{ scale: 1.2 }}
		/>
	)
}
