'use client'
import { useAccountStore } from '@/Hooks/useAccount'
import { forbidden } from 'next/navigation'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data, isLoading } = useAccountStore()

	if (!isLoading && !isAllowedRole(data?.role.name, PermissionLevel.staff)) {
		forbidden()
	}

	return <>{children}</>
}
