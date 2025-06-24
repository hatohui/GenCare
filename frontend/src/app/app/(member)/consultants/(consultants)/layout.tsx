'use client'
import LoadingPage from '@/Components/Loading'
import SearchBar from '@/Components/Management/SearchBar'
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
	actions,
}: {
	children: React.ReactNode
	consultants: React.ReactNode
	actions: React.ReactNode
}) => {
	const { isLoading, data } = useAccountStore()

	if (isLoading) return <LoadingPage />

	if (!isAllowedRole(data?.role.name, PermissionLevel.member)) forbidden()

	return (
		<div className='flex flex-col h-full w-full gap-4'>
			<div className=''>{actions}</div>
			<div className=''>{children}</div>
			<div className=''>{consultants}</div>
		</div>
	)
}

export default Layout
