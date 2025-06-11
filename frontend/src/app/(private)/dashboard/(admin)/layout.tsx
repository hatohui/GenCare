'use client'
import React from 'react'
import { useAccountStore } from '@/Hooks/useAccount'
import { forbidden } from 'next/navigation'
import { ADMIN_TEAM } from '@/Constants/Management'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data } = useAccountStore()

	console.log('data in dashboard statistic: ', data)

	if (!data?.account.role || !ADMIN_TEAM.includes(data.account.role)) {
		forbidden()
	}

	return <>{children}</>
}
