'use client'
import React from 'react'
import { LogoutSVG } from '../SVGs'
import { useLogoutAccount } from '@/Services/auth-service'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()

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
		<button
			onClick={handleLogout}
			className='center-all bg-accent p-2 gap-2 text-semibold transition duration-150 font-medium hover:bg-sky-100 hover:text-blue-600'
		>
			<LogoutSVG />

			<div className=' text-center'>Sign Out</div>
		</button>
	)
}

export default LogoutButton
