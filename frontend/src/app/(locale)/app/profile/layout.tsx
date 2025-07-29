'use client'

import React from 'react'
import LoadingIcon from '@/Components/LoadingIcon'
import useToken from '@/Hooks/Auth/useToken'
import { forbidden } from 'next/navigation'

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// Add authentication guard for member access
	const { accessToken, isHydrated } = useToken()

	// Show loading while authentication is being verified
	if (!isHydrated) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>Đang xác minh người dùng...</p>
				</div>
			</div>
		)
	}

	if (!accessToken) forbidden()

	return <>{children}</>
}
