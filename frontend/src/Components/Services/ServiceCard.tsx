'use client'

import { motion } from 'motion/react'
import MotionLink from '../MotionLink'
import Image from 'next/image'
import useToken from '@/Hooks/useToken'
import { useRouter } from 'next/navigation'

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
	imageUrl,
}: ServiceCardProps) => {
	const { accessToken } = useToken()
	const router = useRouter()

	const handleAddToCart = () => {
		// Logic to add the service to the cart
		if (!id || !name || !price) {
			console.error('Invalid service data')
			return
		}
		if (!accessToken) {
			console.error('User not logged in')
			router.push('/login')
			return
		}

		router.push(`/app/booking/${id}`)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -8, scale: 1.02 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className='group relative bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100'
		>
			{/* Image Section */}
			<div className='relative h-48 overflow-hidden'>
				{imageUrl ? (
					<div className='h-full bg-gradient-to-br from-main/20 to-secondary/20 flex items-center justify-center'>
						<motion.div
							animate={{
								rotate: 360,
								transition: { repeat: Infinity, duration: 2, ease: 'linear' },
							}}
							className='w-12 h-12 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent'
						/>
					</div>
				) : (
					<Image
						src='/images/gencarelogo.png'
						alt='gencare-logo'
						width={400}
						height={300}
						className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-300'
					/>
				)}

				{/* Price Badge */}
				<div className='absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-[30px] text-sm font-semibold shadow-lg'>
					{price.toLocaleString('vi-VN')} VND
				</div>
			</div>

			{/* Content Section */}
			<div className='p-6'>
				<h3 className='text-xl font-bold mb-3 text-secondary group-hover:text-main transition-colors duration-300 line-clamp-2'>
					{name}
				</h3>

				<p className='text-gray-600 mb-6 line-clamp-3 leading-relaxed'>
					{description}
				</p>

				{/* Action Buttons */}
				<div className='flex gap-3'>
					<MotionLink
						whileTap={{ scale: 0.95 }}
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
						className='flex-1 bg-general text-secondary px-4 py-3 rounded-[30px] font-medium text-sm hover:bg-secondary hover:text-white transition-all duration-300 text-center'
						href={`/service/${id}`}
					>
						Chi tiết
					</MotionLink>

					<motion.button
						whileTap={{ scale: 0.95 }}
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
						onClick={handleAddToCart}
						className='flex-1 bg-gradient-to-r from-accent to-accent/80 text-white px-4 py-3 rounded-[30px] font-medium text-sm hover:from-accent/90 hover:to-accent transition-all duration-300 shadow-lg hover:shadow-xl'
					>
						Đặt ngay
					</motion.button>
				</div>
			</div>

			{/* Hover Effect Overlay */}
			<div className='absolute inset-0 bg-gradient-to-br from-main/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
		</motion.div>
	)
}
