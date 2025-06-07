'use client'

import { useParams } from 'next/navigation'
import React from 'react'

const AccountDetailPage = () => {
	const { id } = useParams()

	return <div className='h-full w-full center-all'>Current id: {id}</div>
}

export default AccountDetailPage
