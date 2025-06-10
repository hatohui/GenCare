// app/not-found.js
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='relative flex flex-col items-center justify-center h-screen bg-main text-white overflow-hidden'>
			<Image
				src='/images/404NotFound.png'
				alt='404'
				width={4000}
				height={4000}
				className='object-fill h-full'
			/>
			<Link
				href='/'
				className='absolute top-6 left-6 bg-accent px-4 py-2 rounded-md text-general font-semibold hover:bg-accent/50 transition-colors duration-200'
			>
				Go Back
			</Link>
		</div>
	)
}
