'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data } = useAccountStore()

	if (data?.role.name === 'consultant' || data?.role.name === 'admin')
		return <>{children}</>
}

export default Layout
