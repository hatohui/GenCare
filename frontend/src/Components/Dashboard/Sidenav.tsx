'use client'

import NavLinks from './NavLink'
import { useLogoutAccount } from '@/Services/auth-service'
import { useRouter } from 'next/navigation'
import Logo from '../Logo'
import { ExitSVG } from '../SVGs'

export default function SideNav() {
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()

	const handleLogout = (e: React.FormEvent) => {
		e.preventDefault()

		logout(undefined, {
			onSuccess: () => {
				router.push('/login?error=logged_out')
			},
			onError: () => {
				alert('Something wrong happened')
			},
		})
	}

	return (
		<div className='flex h-full flex-col px-4 py-4 md:px-2 bg-main'>
			<div className='md:flex justify-center items-center pointer-events-none rounded-md hidden mb-20'>
				<Logo className='mr-2' withLabel />
			</div>
			<div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
				<NavLinks />
				<div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
				<button
					onClick={handleLogout}
					className='flex grow items-center bg-accent justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
				>
					<div className='hidden md:block'>Sign Out</div>
					<ExitSVG className='block md:hidden' />
				</button>
			</div>
		</div>
	)
}
