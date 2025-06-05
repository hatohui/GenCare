'use client'

import useAccountStore from '@/Hooks/useToken'
import React from 'react'

const DashBoard = () => {
	const loggedInAccount = useAccountStore().account

	if (!loggedInAccount)
		return (
			<div className='h-full w-full center-all'>
				Logging you into dashboard...
			</div>
		)

	return (
		<div className='h-full w-full center-all flex-col'>
			<div> Account id: {loggedInAccount.id}</div>
			<div>
				{/* Account Name: {loggedInAccount.lastName} {loggedInAccount.firstName} */}
			</div>
		</div>
	)
}

export default DashBoard
