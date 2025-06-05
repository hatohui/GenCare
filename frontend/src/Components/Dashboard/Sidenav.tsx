'use client'

import NavLinks from './NavLink'
import { useLogoutAccount } from '@/Services/auth-service'
import { useRouter } from 'next/navigation'
import Logo from '../Logo'
import { ExitSVG } from '../SVGs'
import { useState } from 'react'

export default function SideNav() {
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()
	const [isOpen, setIsOpen] = useState()

	const handleLogout = (e: React.FormEvent) => {
		e.preventDefault()

		logout(undefined, {
			onSuccess: () => {
				router.push('/login')
			},
			onError: () => {
				alert('Something wrong happened')
			},
		})
	}

	return (
		<div className='flex md:h-screen flex-col px-6 py-4 md:px-2 bg-gradient-to-b from-main to-secondary'>
			<div className='md:flex justify-center items-center pointer-events-none text-white rounded-md hidden mb-20'>
				<Logo className='mr-[4px]' withLabel />
			</div>
			<div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
				<NavLinks />
				<div className='hidden w-full grow bg-general rounded-md opacity-25 md:block'></div>
				<button
					onClick={handleLogout}
					className='flex h-[48px] grow items-center bg-accent justify-center gap-2 rounded-md text-white p-3 text-semibold transition duration-150 font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
				>
					<div className='hidden w-full text-center md:block'>Sign Out</div>
					<ExitSVG className='block md:hidden' />
				</button>
			</div>
		</div>
	)
}
