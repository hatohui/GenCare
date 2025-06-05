import Image from 'next/image'
import { ServiceCardProps } from './ServiceCard'

export default function ServiceDetail({
	name,
	price,
	description,
	imageUrl = '',
}: ServiceCardProps) {
	return (
		<main className='bg-[#F7F7F7] text-gray-900 px-6 py-12'>
			<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12'>
				{/* Left Panel */}
				<div className='space-y-6'>
					<h1 className='text-3xl font-bold text-gray-800'>{name}</h1>
					<p className='text-2xl text-accent font-semibold'>{price}</p>
					<button className='bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full text-lg font-medium transition duration-300 hover:from-pink-600 hover:to-rose-500'>
						Booking
					</button>
					<div className='pt-6'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-16 h-16 text-gray-600 transition-transform duration-300 transform hover:scale-110'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M2.25 3h1.386a.75.75 0 01.727.57l.857 3.428m0 0L6.75 14.25h10.5l1.53-6.12m-13.59 0h13.59M6.75 14.25l-.384 1.536a.75.75 0 00.727.964h11.814a.75.75 0 00.727-.964l-.384-1.536M9 18.75h.008v.008H9v-.008zm6 0h.008v.008H15v-.008z'
							/>
						</svg>
					</div>
				</div>

				{/* Right Panel */}
				<div className='space-y-8'>
					{/* Image Section */}
					<div className='bg-gray-200 h-96 w-full flex items-center justify-center rounded-lg overflow-hidden shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl p-2'>
						{imageUrl ? (
							<Image
								src={imageUrl}
								alt={name}
								className='h-full w-full object-cover rounded-lg'
								width={500}
								height={500}
							/>
						) : (
							<p className='text-gray-500'>No Image Available</p>
						)}
					</div>

					{/* Description Section */}
					<div className='bg-white p-6 rounded-lg shadow-md text-lg text-gray-700'>
						<h2 className='text-xl font-semibold text-gray-800 mb-4'>
							Description
						</h2>
						<p className='text-gray-600 leading-relaxed'>{description}</p>
					</div>
				</div>
			</div>
		</main>
	)
}
