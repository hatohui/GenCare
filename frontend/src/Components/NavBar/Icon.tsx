import { COLOR_ON_SCROLL, COLOR_ON_TOP, NAV_TITLE } from '@/Constants/NavBar'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export type LogoProp = {
	className?: string
	onTop: boolean
}

const Logo = ({ className, onTop }: LogoProp) => {
	const router = useRouter()

	return (
		<motion.div
			className='center-all gap-1 cursor-pointer select-none'
			animate={onTop ? 'onTop' : 'animate'}
			variants={{
				onTop: { scale: 1, opacity: 1, color: 'var(--color-main)' },
				animate: {
					scale: 1,
					opacity: 1,
					color: COLOR_ON_SCROLL,
				},
			}}
			onClick={() => router.push('/')}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
			whileHover={{}}
		>
			<motion.div
				className={`rounded-full rounded-br-none w-10 h-7 ${className}`}
				initial={{ scale: 0, opacity: 0 }}
				animate={onTop ? 'onTop' : 'animate'}
				variants={{
					onTop: {
						scale: 0.9,
						opacity: 1,
						backgroundColor: COLOR_ON_TOP,
					},
					animate: {
						scale: 0.9,
						opacity: 1,
						backgroundColor: COLOR_ON_SCROLL,
					},
				}}
				transition={{ duration: 0.5, ease: 'easeInOut' }}
			/>
			<p className='font-sans pt-[2px] text-shadow-md'>{NAV_TITLE}</p>
		</motion.div>
	)
}

export default Logo
