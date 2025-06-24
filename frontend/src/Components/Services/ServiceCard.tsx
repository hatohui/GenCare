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
			initial={{ opacity: 0, x: -20, y: -10 }}
			animate={{ opacity: 1, x: 0, y: 0 }}
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className='bg-white rounded-2xl p-5 h-full shadow-md hover:shadow-lg transition-shadow duration-300'
		>
			{imageUrl ? (
				<div className='h-[300px] bg-gray-500 animate-pulse round center-all'>
					<motion.div
						animate={{
							rotate: 360,
							transition: { repeat: Infinity, duration: 2, ease: 'linear' },
						}}
						className={
							'w-[50px] h-[50px] rounded-full border-4  transform border-t-accent'
						}
					/>
				</div>
			) : (
				<Image
					src='/images/gencarelogo.png'
					alt='gencare-logo'
					width={1000}
					height={1000}
					className='h-[300px] object-cover'
				/>
			)}

			<div className='pt-3'>
				<h3 className='text-xl font-semibold mb-2'>{name}</h3>
				<p className='text-accent mb-2'>{price.toLocaleString('vi-VN')} VND</p>
				<p className='text-gray-600 mb-4 truncate '>{description}</p>
			</div>
			<div className='flex items-end justify-end mb-4 gap-4'>
				<MotionLink
					whileTap={{ scale: 0.95 }}
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}
					className='bg-general text-black px-4 py-2 rounded-full font-medium text-sm'
					href={`/service/${id}`}
				>
					Chi tiết
				</MotionLink>
				<button
					onClick={handleAddToCart}
					className='bg-accent text-white px-4 py-2 rounded-full font-medium text-sm'
				>
					Đặt ngay
				</button>
			</div>
		</motion.div>
	)
}
