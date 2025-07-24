'use client'

import React from 'react'
import { useAuthGuard } from '@/Hooks/Auth/useAuthGuard'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'
import LoadingIcon from '@/Components/LoadingIcon'

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// Add authentication guard for member access
	const { isUserLoading } = useAuthGuard(PermissionLevel.member)

	// Show loading while authentication is being verified
	if (isUserLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>Đang xác minh người dùng...</p>
				</div>
			</div>
		)
	}

	return <>{children}</>
}
