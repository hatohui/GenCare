import React from 'react'
import LogoutButton from '../Auth/LogoutButton'
import { useRouter } from 'next/navigation'

const Popup = () => {
	const router = useRouter()
	return (
		<div className='absolute min-w-56 bottom-2 z-[999] right-0 p-0 bg-white border border-gray-200 rounded-2xl shadow-2xl translate-x-full'>
			{/* Arrow */}
			<div className='absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 shadow-md z-10'></div>
			<div className='flex flex-col gap-2 p-4'>
				<button
					onClick={() => router.push('/app/profile')}
					className='flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200'
				>
					{/* Account Icon */}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-5 text-blue-500'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z'
						/>
					</svg>
					<span>Account Settings</span>
				</button>
				<button className='flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-green-50 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200'>
					{/* Help Icon */}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-5 text-green-500'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
						/>
					</svg>
					<span>Get Help</span>
				</button>
				<div className='border-t border-gray-100 my-2'></div>
				<div className='flex justify-center pt-1'>
					<LogoutButton />
				</div>
			</div>
		</div>
	)
}

export default Popup
