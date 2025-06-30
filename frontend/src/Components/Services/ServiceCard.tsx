'use client'

import React from 'react'
import { motion } from 'motion/react'
import useToken from '@/Hooks/Auth/useToken'
import { Service } from '@/Interfaces/Service/Types/Service'
import { useRouter } from 'next/navigation'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'
import AutoCarousel from '../AutoCarousel'

interface ServiceCardProps {
	service: Pick<Service, 'id' | 'name' | 'description' | 'price' | 'imageUrls'>
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
	const { accessToken } = useToken()
	const router = useRouter()

	const handleBookNow = () => {
		try {
			// Validate service data
			if (!service.id || !service.name || !service.price) {
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
			router.push(`/app/booking/${service.id}`)
		} catch (error) {
			console.error('Error navigating to booking:', error)
			toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
		}
	}

	const handleViewDetails = () => {
		try {
			router.push(`/service/${service.id}`)
		} catch (error) {
			console.error('Error navigating to service details:', error)
			toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -5 }}
			className='bg-white border border-gray-200 rounded-[30px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
		>
			{/* Service Image */}
			<div className='relative mb-4 overflow-hidden rounded-[20px]'>
				{service.imageUrls && service.imageUrls.length > 0 ? (
					<AutoCarousel imageUrls={service.imageUrls} />
				) : (
					<div className='w-full h-[250px] bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
						<span className='text-white text-lg font-semibold'>
							{service.name}
						</span>
					</div>
				)}

				{/* Price Badge */}
				<div className='absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg'>
					{service.price.toLocaleString('vi-VN')} VND
				</div>
			</div>

			{/* Service Content */}
			<div className='p-6'>
				<div className='flex-1 flex flex-col'>
					<h3 className='text-xl font-bold text-main mb-2 line-clamp-2'>
						{service.name}
					</h3>
					<p className='text-gray-600 mb-6 text-sm line-clamp-3 flex-1'>
						{service.description}
					</p>

					{/* Action Buttons */}
					<div className='flex gap-3'>
						<button
							onClick={handleViewDetails}
							className='flex-1 px-4 py-2 border border-main text-main rounded-[20px] hover:bg-main hover:text-white transition-colors font-medium'
						>
							Xem chi tiết
						</button>
						<button
							onClick={handleBookNow}
							className='flex-1 px-4 py-2 bg-main text-white rounded-[20px] hover:bg-main/90 transition-colors font-medium'
						>
							Đặt ngay
						</button>
					</div>
				</div>
			</div>

			{/* Hover Effect Overlay */}
			<div className='absolute inset-0 bg-gradient-to-br from-main/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
		</motion.div>
	)
}

export default ServiceCard
export { ServiceCard }
