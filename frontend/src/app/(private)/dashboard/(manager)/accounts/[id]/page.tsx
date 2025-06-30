'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const AccountDetailPage = () => {
	const params = useParams()
	const id = params?.id && typeof params.id === 'string' ? params.id : null
	const router = useRouter()

	if (!id) {
		router.push('/dashboard/accounts')
		return <div>Loading...</div>
	}

	return <div className='h-full w-full center-all'>Current id: {id}</div>
}

export default AccountDetailPage
