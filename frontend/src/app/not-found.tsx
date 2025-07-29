import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
	return (
		<main className='relative flex flex-col items-center justify-center h-screen bg-main text-white overflow-hidden'>
			<Image
				src='/images/404NotFound.png'
				alt='404'
				width={4000}
				height={4000}
				className='object-fill h-full'
			/>
			<Link
				href='/'
				className='absolute top-8 left-8 flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg backdrop-blur-sm text-white bg-accent hover:bg-accent/60 border border-white/20 transition-all duration-200 hover:scale-105 hover:shadow-lg'
			>
				<svg
					className='w-4 h-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 19l-7-7 7-7'
					/>
				</svg>
				Back
			</Link>
		</main>
	)
}
