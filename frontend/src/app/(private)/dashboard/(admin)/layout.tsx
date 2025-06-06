'use client'
import React from 'react'
import { useAccountStore } from '@/Hooks/useAccount'
import { forbidden } from 'next/navigation'
import { ADMIN_TEAM } from '@/Constants/Management'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data } = useAccountStore()

	if (!data) {
		return (
			<div className='h-screen w-screen animate-pulse center-all'>
				Getting account data....
			</div>
		)
	}

	if (!ADMIN_TEAM.includes(data.account.role)) {
		forbidden()
	}

	return <>{children}</>
}
