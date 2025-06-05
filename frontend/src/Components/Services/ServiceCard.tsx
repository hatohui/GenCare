import { motion } from 'motion/react'
import Link from 'next/link'

export type ServiceCardProps = {
	id: string
	name: string
	price: number
	description: string
	imageUrl?: string
}

export const ServiceCard = ({
	name,
	price,
	description,
	id,
}: ServiceCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className='bg-white rounded-2xl p-4  shadow-md hover:shadow-lg transition-shadow duration-300'
		>
			<h3 className='text-xl font-semibold mb-2'>{name}</h3>
			<p className='text-accent mb-2'>{price} VND</p>
			<p className='text-gray-600 mb-4 truncate '>{description}</p>
			<div className='flex items-center justify-end mb-4 gap-4'>
				<Link
					href={`/service/${id}`}
					className='bg-general text-black px-4 py-2 rounded-full font-medium text-sm'
				>
					Detail
				</Link>
				<button className='bg-accent text-white px-4 py-2 rounded-full font-medium text-sm'>
					Add to Cart
				</button>
			</div>
		</motion.div>
	)
}
