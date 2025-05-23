import Link from 'next/link'
import { NavComponentProps } from '../NavBar'
import { motion } from 'motion/react'

const UserActionButton = ({ className, onTop }: NavComponentProps) => {
	return (
		<motion.div
			className={`gap-2 pl-2 items-center text-accent ${className}`}
			animate={onTop ? 'onTop' : 'animate'}
			variants={{
				animate: {
					scale: 0.86,
					fontWeight: 'var(--font-weight-bold)',
					border: '3px',
				},
				onTop: { scale: 0.8, fontWeight: 'var(--font-weight-medium)' },
			}}
			transition={{ duration: 0.2 }}
		>
			<Link
				id='login'
				className='rounded-full hover:opacity-90 p-1 pr-3 duration-200 transition-all cursor-pointer select-none text-center flex'
				href='/login'
				role='navigation'
			>
				<label className='pointer-events-none saturate-[0.9]'>Đăng Nhập</label>
			</Link>
			{/* <button className='bg-blue-500 rounded-full p-1 cursor-pointer hover:brightness-75'>
				<svg
					className='stroke-white size-5'
					fill='none'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<circle cx='12' cy='7' r='4'></circle>
					<path d='M5.5 21a6.5 6.5 0 0113 0'></path>
				</svg>
			</button> */}
		</motion.div>
	)
}

export default UserActionButton
