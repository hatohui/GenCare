import { motion } from 'motion/react'
import { useFormStatus } from 'react-dom'

const SubmitButton = ({
	buttonClass,
	label,
}: {
	buttonClass: string
	label: string
}) => {
	const { pending } = useFormStatus()

	return (
		<motion.button
			type='submit'
			className={buttonClass}
			disabled={pending}
			animate={{ scale: pending ? 0.95 : 1 }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			aria-busy={pending}
			aria-disabled={pending}
		>
			{label}
		</motion.button>
	)
}

export default SubmitButton
