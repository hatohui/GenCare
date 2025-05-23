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
		</MotionLink>
	)
}

export default UserActionButton
