'use client'
import React from 'react'
import Sidenav from '@/Components/Dashboard/Sidenav'
import { useAuthGuard } from '@/Hooks/Auth/useAuthGuard'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { isUserLoading } = useAuthGuard()

	if (isUserLoading) {
		return (
			<div className='h-screen w-screen animate-pulse center-all'>
				Đang xác minh người dùng...
			</div>
		)
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
