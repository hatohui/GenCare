'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const ApplicationPage = () => {
	const router = useRouter()

	return (
		<main className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='bg-white shadow-lg rounded-xl p-8 max-w-lg w-full space-y-6'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-800'>Welcome back 👋</h1>
					<p className='text-gray-500 mt-2'>
						You&apos;re now logged in. What do you want to do next?
					</p>
				</div>

				<div className='flex flex-col gap-4'>
					<button
						onClick={() => router.push('/dashboard')}
						className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition'
					>
						Go to Dashboard
					</button>

					<button
						onClick={() => router.push('/profile')}
						className='w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition'
					>
						View Profile
					</button>
				</div>

				<p className='text-center text-sm text-gray-400'>
					Need help?{' '}
					<a
						href='/support'
						className='underline hover:text-blue-600 transition'
					>
						Contact support
					</a>
				</p>
			</div>
		</main>
	)
}

export default ApplicationPage
