import { NavComponentProps } from '../NavBar'
import MotionLink from '../MotionLink'

const UserActionButton = ({ className, onTop }: NavComponentProps) => {
	return (
		<MotionLink
			id='login'
			className={`rounded-full px-4 py-2 duration-200 cursor-pointer select-none text-center flex gap-2 items-center ${className}`}
			href='/login'
			role='navigation'
			animate={onTop ? 'onTop' : 'animate'}
			variants={{
				animate: {
					filter: 'brightness(1)',
					scale: 0.8,
					fontWeight: 'var(--font-weight-bold)',
					backgroundColor: 'transparent',
					color: 'var(--color-accent)',
				},
				onTop: {
					filter: 'brightness(1) contrast(1.2)',
					scale: 0.8,
					color: 'white',
					fontWeight: 'var(--font-weight-bold)',
					backgroundColor: 'var(--color-accent)',
					textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
				},
			}}
			whileHover={{ scale: 0.85, filter: 'brightness(1.2) contrast(1.1)' }}
			transition={{ duration: 0.2 }}
		>
			<label className='pointer-events-none'>Đăng Nhập</label>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='currentColor'
				className='size-6'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
				/>
			</svg>
		</MotionLink>
	)
}

export default UserActionButton
