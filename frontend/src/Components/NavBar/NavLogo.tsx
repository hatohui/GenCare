import { COLOR_ON_SCROLL } from '@/Constants/NavBar'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Logo from '../Logo'

export type LogoProp = {
	className?: string
	onTop: boolean
}

const NavLogo = ({ onTop }: LogoProp) => {
	const router = useRouter()

	return (
		<motion.div
			className='flex items-center h-fit justify-center gap-2 cursor-pointer select-none'
			animate={onTop ? 'onTop' : 'scroll'}
			variants={{
				onTop: {
					scale: 1,
					opacity: 1,
					color: 'var(--color-main)',
				},
				scroll: {
					scale: 1,
					opacity: 1,
					color: COLOR_ON_SCROLL,
				},
			}}
			onClick={() => router.push('/')}
			transition={{ duration: 0.4, ease: 'easeOut' }}
		>
			<Logo withLabel />
		</motion.div>
	)
}

export default NavLogo
