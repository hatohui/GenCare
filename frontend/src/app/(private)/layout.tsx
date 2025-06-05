'use client'
import React from 'react'
import Sidenav from '@/Components/Dashboard/Sidenav'
import useAccountStore from '@/Hooks/useToken'
import { redirect } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
	const accountStore = useAccountStore()
	const accessToken = accountStore.accessToken

	if (!accessToken) redirect('/login?error=invalid_token')
	return (
		<div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
			<div className='w-full flex-none md:w-64'>
				<Sidenav />
			</div>
			<main className='flex-grow p-6 md:overflow-y-auto md:p-12'>
				{children}
			</main>
		</div>
	)
}
