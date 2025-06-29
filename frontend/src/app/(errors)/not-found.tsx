import ReturnButton from '@/Components/ReturnButton'
import Image from 'next/image'
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
			<ReturnButton to='/' />
		</main>
	)
}
