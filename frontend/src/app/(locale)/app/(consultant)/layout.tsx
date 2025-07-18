'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data } = useAccountStore()

	if (isAllowedRole(data?.role.name, PermissionLevel.consultant))
		return <>{children}</>
}

export default Layout
