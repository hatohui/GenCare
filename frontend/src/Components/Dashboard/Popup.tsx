import React from 'react'
import LogoutButton from '../Auth/LogoutButton'
import { useRouter } from 'next/navigation'

const Popup = () => {
	const router = useRouter()
	return (
		<div className='absolute  bottom-1 z-[999] right-0 p-4 bg-white border rounded shadow-md translate-x-1/2'>
			<button
				onClick={() => router.push('/app/profile')}
				className='flex items-center p-2 mb-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-blue-100 rounded hover:bg-blue-200'
			>
				Account Settings
			</button>
			<button className='flex items-center p-2 mb-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-green-100 rounded hover:bg-green-200'>
				Get Help
			</button>
			<LogoutButton />
		</div>
	)
}

export default Popup
