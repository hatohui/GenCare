import React from 'react'
import LogoutButton from '../Auth/LogoutButton'
import { useRouter } from 'next/navigation'

const Popup = () => {
	const router = useRouter()
	return (
		<div className='absolute min-w-42  bottom-1 z-[999] right-0 p-4 bg-white border rounded shadow-md translate-x-full'>
			<button
				onClick={() => router.push('/app/profile')}
				className='flex items-center p-2 mb-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-blue-100 rounded hover:bg-blue-200'
			>
				Account Settings
			</button>
			<button className='flex gap-3 justify-center items-center w-full p-2 mb-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-green-100 rounded hover:bg-green-200'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='size-6'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
					/>
				</svg>
				<span>Get Help</span>
			</button>
			<div className='center-all'>
				<LogoutButton />
			</div>
		</div>
	)
}

export default Popup
