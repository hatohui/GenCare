// app/page.tsx
import Image from 'next/image'
import { ServiceCardProps } from './ServiceCard'

export default function ServiceDetail({
	name,
	price,
	description,
	imageUrl = '',
}: ServiceCardProps) {
	return (
		<main className=' bg-[#F7F7F7] text-gray-900 px-6 py-8'>
			<div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8'>
				{/* Left Panel */}
				<div className='md:col-span-1 space-y-4'>
					<h1 className='text-xl font-bold'>{name}</h1>
					<p className='text-rose-500 font-semibold'>{price}</p>
					<button className='bg-accent text-white px-4 py-2 rounded-full text-sm font-medium'>
						Booking
					</button>
					<div className='pt-4'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-15 h-15'
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
				<div className='col-span-2 space-y-6'>
					<div className='bg-gray-200 h-64 w-full flex items-center justify-center text-xl font-bold rounded-lg'>
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
				</div>
				<div className=' h-64 w-full flex items-center justify-center text-xl font-bold rounded-lg col-span-3'>
					{description}
				</div>
			</div>
		</main>
	)
}
