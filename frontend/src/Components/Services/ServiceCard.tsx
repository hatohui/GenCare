'use client'

import React from 'react'
import { motion } from 'motion/react'
import useToken from '@/Hooks/Auth/useToken'
import { Service } from '@/Interfaces/Service/Types/Service'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CldImage } from 'next-cloudinary'
import LocalizedCurrency from '@/Components/LocalizedCurrency'
import { useLocale } from '@/Hooks/useLocale'

interface ServiceCardProps {
	service: Pick<Service, 'id' | 'name' | 'description' | 'price' | 'imageUrls'>
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
	const { accessToken } = useToken()
	const router = useRouter()
	const { t } = useLocale()

	const handleBookNow = () => {
		try {
			// Validate service data
			if (!service.id || !service.name || !service.price) {
				console.error('Invalid service data')
				toast.error(t('feedback.invalid_service'))
				return
			}

			// Check authentication
			if (!accessToken) {
				toast.error(t('feedback.login_required'))
				router.push('/login')
				return
			}

			// Navigate to booking page
			router.push(`/app/booking/${service.id}`)
		} catch (error) {
			console.error('Error navigating to booking:', error)
			toast.error(t('feedback.error'))
		}
	}

	const handleViewDetails = () => {
		try {
			router.push(`/service/${service.id}`)
		} catch (error) {
			console.error('Error navigating to service details:', error)
			toast.error(t('feedback.error'))
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -8, scale: 1.02 }}
			className='group bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl h-full flex flex-col'
		>
			{/* Service Image */}
			<div className='relative overflow-hidden'>
				{service.imageUrls && service.imageUrls.length > 0 ? (
					<CldImage
						src={service.imageUrls[0].url}
						alt={service.name}
						width={500}
						height={500}
						className='w-full h-[240px] object-cover group-hover:scale-110 transition-all duration-700'
					/>
				) : (
					<div className='w-full h-[240px] bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
						<span className='text-white text-lg font-semibold text-center px-4'>
							{service.name}
						</span>
					</div>
				)}

				{/* Price Badge */}
				<div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-main px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-main/10'>
					<LocalizedCurrency amount={service.price} />
				</div>
			</div>

			{/* Service Content */}
			<div className='p-6 flex-1 flex flex-col'>
				<div className='flex-1 flex flex-col'>
					<h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-main transition-colors duration-300'>
						{service.name}
					</h3>
					<p className='text-gray-600 mb-6 text-sm line-clamp-3 flex-1 leading-relaxed'>
						{service.description}
					</p>

					{/* Action Buttons */}
					<div className='flex gap-3 mt-auto'>
						<button
							onClick={handleViewDetails}
							className='flex-1 px-6 py-3 border-2 border-main/30 text-main rounded-[30px] hover:bg-main/5 hover:border-main transition-all duration-300 font-medium text-sm'
						>
							{t('action.view_details')}
						</button>
						<button
							onClick={handleBookNow}
							className='flex-1 px-6 py-3 bg-accent text-white rounded-[30px] hover:bg-accent/90 hover:shadow-lg transition-all duration-300 font-medium text-sm'
						>
							{t('action.book_now')}
						</button>
					</div>
				</div>
			</div>

			{/* Subtle Hover Gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-main/0 to-secondary/0 group-hover:from-main/5 group-hover:to-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-[24px]'></div>
		</motion.div>
	)
}

export default ServiceCard
export { ServiceCard }
