'use client'
import React from 'react'
import { useAccountStore } from '@/Hooks/useAccount'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data } = useAccountStore()

	if (!data || data?.account.role !== 'admin') {
		return (
			<div className='h-screen w-screen animate-pulse center-all'>
				Verifying admin privileges...
			</div>
		)
	}

	return <>{children}</>
}
