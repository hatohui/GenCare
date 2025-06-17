'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const AccountDetailPage = () => {
	const { id } = useParams()
	const router = useRouter()

	if (!id) {
		router.push('/dashboard/accounts')
		return <div>Loading...</div>
	}

	return <div className='h-full w-full center-all'>Current id: {id}</div>
}

export default AccountDetailPage
