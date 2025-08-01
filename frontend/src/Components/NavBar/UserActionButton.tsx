import { NavComponentProps } from '@/Interfaces/NavBar/Types/NavBarComponents'
import MotionLink from '../MotionLink'
import clsx from 'clsx'
import { UserSVG } from '../SVGs'
import { useRouter } from 'next/navigation'
import { useLogoutAccount } from '@/Services/auth-service'
import useToken from '@/Hooks/Auth/useToken'
import { toast } from 'react-hot-toast'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { useLocale } from '@/Hooks/useLocale'

const UserActionButton = ({ className, onTop }: NavComponentProps) => {
	const tokenStore = useToken()
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()
	const { t } = useLocale()

	const handleLogout = (e: React.FormEvent) => {
		e.preventDefault()

		logout(undefined, {
			onSuccess: () => {
				router.push('/login')
				toast.success(t('feedback.logoutSuccess'))
			},
			onError: () => {
				console.error('Logout failed')
				toast.error(t('feedback.logoutFailed'))
			},
		})
	}

	return tokenStore.accessToken ? (
		<div className={clsx('flex gap-2', className)}>
			{/* Direct App/Dashboard Button */}
			<button
				className={clsx(
					'rounded-full px-4 py-1 duration-200 cursor-pointer select-none',
					'text-center flex gap-2 items-center',
					'bg-main hover:bg-accent',
					'shadow-md hover:shadow-lg',
					'text-white font-medium',
					'transition-all ease-in-out'
				)}
				onClick={() => {
					const role = getRoleFromToken(tokenStore.accessToken!)
					if (role === 'member' || role === 'consultant') {
						router.push('/app')
					} else {
						router.push('/dashboard')
					}
				}}
				aria-label={t('nav.goToApp')}
			>
				<span className='pointer-events-none whitespace-nowrap'>
					{t('nav.goToApp')}
				</span>
			</button>
			{/* Logout Button */}
			<button
				className={clsx(
					'rounded-full px-2 py-1 duration-200 cursor-pointer select-none',
					'text-center flex gap-2 items-center',
					'bg-accent',
					'shadow-md hover:shadow-lg',
					'text-white font-medium',
					'transition-all ease-in-out'
				)}
				onClick={handleLogout}
			>
				<label className='pointer-events-none whitespace-nowrap'>
					{t('auth.logout')}
				</label>
				{onTop && <UserSVG className='size-5 text-white' />}
			</button>
		</div>
	) : (
		<MotionLink
			id='login'
			className={clsx(
				'rounded-full px-4 py-2 duration-200 cursor-pointer select-none text-center flex gap-2 items-center bg-accent text-white',
				className
			)}
			href='/login'
			role='navigation'
			whileHover={{ scale: 0.85, filter: 'brightness(1.2) contrast(1.1)' }}
			transition={{ duration: 0.2 }}
		>
			<label className='pointer-events-none'>{t('auth.login')}</label>
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
