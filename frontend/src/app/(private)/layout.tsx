'use client'
import React, { useEffect, useState } from 'react'
import Sidenav from '@/Components/Dashboard/Sidenav'
import { useAuthGuard } from '@/Hooks/Auth/useAuthGuard'
import { useRouter } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
	const [hydrated, setHydrated] = useState(false)
	const { isUserLoading, user } = useAuthGuard()
	const router = useRouter()

	useEffect(() => {
		setHydrated(true)
	}, [])

	if (!hydrated) {
		return null
	}

	if (isUserLoading) {
		return (
			<div className='h-screen w-screen animate-pulse center-all'>
				Đang xác minh người dùng...
			</div>
		)
	}

	if (!user) {
		router.push('/login')
		return null
	}

	return (
		<div className='flex flex-col md:flex-row h-screen florageBackground'>
			<Sidenav />
			<main className='flex-1 p-4 h-full scroll-smooth overflow-scroll'>
				{children}
			</main>
		</div>
	)
}
