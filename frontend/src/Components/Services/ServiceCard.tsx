'use client'

import { motion } from 'motion/react'
import MotionLink from '../MotionLink'
import Image from 'next/image'
import useToken from '@/Hooks/useToken'
import { useRouter } from 'next/navigation'
import { Service } from '@/Interfaces/Service/Types/Service'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'

export const ServiceCard = ({
	name,
	price,
	description,
	id,
	imageUrls,
}: Pick<Service, 'id' | 'name' | 'description' | 'price' | 'imageUrls'>) => {
	const { accessToken } = useToken()
	const router = useRouter()

	const handleAddToCart = () => {
		try {
			// Validate service data
			if (!id || !name || !price) {
				console.error('Invalid service data')
				toast.error('Thông tin dịch vụ không hợp lệ')
				return
			}

			// Check authentication
			if (!accessToken) {
				toast.error('Vui lòng đăng nhập để đặt dịch vụ')
				router.push('/login')
				return
			}

			// Navigate to booking page
			router.push(`/app/booking/${id}`)
		} catch (error) {
			console.error('Error navigating to booking:', error)
			toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
		}
	}

	const handleViewDetails = () => {
		try {
			router.push(`/service/${id}`)
		} catch (error) {
			console.error('Error navigating to service details:', error)
			toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02, y: -5 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className='bg-white rounded-[30px] p-6 h-full shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100'
		>
			{/* Service Image */}
			<div className='relative mb-4 overflow-hidden rounded-[20px]'>
				{imageUrls && imageUrls.length > 0 ? (
					<CldImage
						src={imageUrls[0].url}
						width={400}
						height={250}
						alt={name}
						className='w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300'
					/>
				) : (
					<Image
						src='/images/gencarelogo.png'
						alt='gencare-logo'
						width={400}
						height={250}
						className='w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300'
					/>
				)}
				{/* Price Badge */}
				<div className='absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg'>
					{price.toLocaleString('vi-VN')} VND
				</div>
			</div>

			{/* Service Content */}
			<div className='flex-1 flex flex-col'>
				<h3 className='text-xl font-bold text-main mb-2 line-clamp-2'>
					{name}
				</h3>
				<p className='text-gray-600 mb-6 text-sm line-clamp-3 flex-1'>
					{description}
				</p>

				{/* Action Buttons */}
				<div className='flex gap-3 mt-auto'>
					<button
						onClick={handleViewDetails}
						className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-[20px] font-medium text-sm transition-colors duration-200'
					>
						Xem chi tiết
					</button>
					<button
						onClick={handleAddToCart}
						className='flex-1 bg-accent hover:bg-accent/90 text-white px-4 py-3 rounded-[20px] font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md'
					>
						Đặt ngay
					</button>
				</div>
			</div>
		</motion.div>
	)
}
