'use client'
import React from 'react'
import { useAccountStore } from '@/Hooks/useAccount'
import { forbidden } from 'next/navigation'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data, isLoading } = useAccountStore()

	if (!isLoading && !isAllowedRole(data?.role.name, PermissionLevel.admin)) {
		forbidden()
	}

	return <>{children}</>
}
