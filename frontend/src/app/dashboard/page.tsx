'use client'

import useAccountStore from '@/Hooks/useToken'
import React from 'react'

const DashBoard = () => {
	const loggedInAccount = useAccountStore().account

	if (!loggedInAccount) return <div>bugged</div>

	return (
		<div>
			<div> Account id: {loggedInAccount.id}</div>
			<div>
				Account Name: {loggedInAccount.lastName} {loggedInAccount.firstName}
			</div>
		</div>
	)
}

export default DashBoard
