'use client'
import LoadingPage from '@/Components/Loading'
import { useAccountStore } from '@/Hooks/useAccount'
import {
	isAllowedRole,
	PermissionLevel,
} from '@/Utils/Permissions/isAllowedRole'
import { forbidden } from 'next/navigation'
import React from 'react'

const Layout = ({
	children,
	consultants,
}: {
	children: React.ReactNode
	consultants: React.ReactNode
}) => {
	const { isLoading, data } = useAccountStore()

	if (isLoading) return <LoadingPage />

	if (!isAllowedRole(data?.role.name, PermissionLevel.member)) forbidden()

	return (
		<>
			<div>{children}</div>
			<div>{consultants}</div>
		</>
	)
}

export default Layout
