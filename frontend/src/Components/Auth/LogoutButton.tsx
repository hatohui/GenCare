'use client'
import React from 'react'
import { LogoutSVG } from '../SVGs'
import { useLogoutAccount } from '@/Services/auth-service'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/Hooks/useLocale'

const LogoutButton = () => {
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()
	const { t } = useLocale()

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
			className='center-all bg-accent px-2 py-1 rounded w-full h-fit gap-2 text-semibold transition duration-150 font-medium hover:bg-sky-100 hover:text-blue-600'
		>
			<LogoutSVG />
			<div className='text-center'>{t('common.signout')}</div>
		</button>
	)
}

export default LogoutButton
