'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Forbidden = () => {
	const router = useRouter()

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push('/')
		}, 5000)

		return () => clearTimeout(timer)
	}, [router])

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-rose-200 p-4'>
			<div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
				<div className='text-center space-y-4'>
					<h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>

					<div className='pt-4 center-all'>
						<Link
							href='/'
							className='w-full bg-accent px-4 py-3 text-white hover:bg-accent/50 transition-colors duration-200'
						>
							Return to Main
						</Link>
					</div>

					<p className='text-sm text-gray-500 mt-4 animate-pulse'>
						You will be automatically redirected in 5 seconds...
					</p>
				</div>
			</div>
		</div>
	)
}

export default Forbidden
