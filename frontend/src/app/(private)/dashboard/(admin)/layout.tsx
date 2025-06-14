'use client'
import React from 'react'
import { useAccountStore } from '@/Hooks/useAccount'
import { forbidden } from 'next/navigation'
import { ADMIN_TEAM } from '@/Constants/Management'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data } = useAccountStore()

	if (!data?.role.name || !ADMIN_TEAM.includes(data.role.name)) {
		forbidden()
	}

	return <>{children}</>
}
