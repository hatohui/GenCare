'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'
import { forbidden } from 'next/navigation'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data } = useAccountStore()
	const role = data?.role.name

	if (!isAllowedRole(role, PermissionLevel.manager)) forbidden()

	return <>{children}</>
}

export default Layout
