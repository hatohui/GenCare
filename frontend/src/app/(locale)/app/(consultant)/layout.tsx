'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'
import { useRouter } from 'next/navigation'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data } = useAccountStore()
	const router = useRouter()

	if (!isAllowedRole(data?.role.name, PermissionLevel.consultant)) {
		router.push('/403')
		return null
	}

	return <>{children}</>
}

export default Layout
