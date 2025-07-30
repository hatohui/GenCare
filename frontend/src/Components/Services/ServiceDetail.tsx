import { useRouter } from 'next/navigation'
import AutoCarousel from '../AutoCarousel'
import useToken from '@/Hooks/Auth/useToken'
import FlorageBackground from '../Landing/FlorageBackground'
import ReturnButton from '../ReturnButton'
import { motion } from 'motion/react'
import Testimonials from '@/Constants/Testomonial'
import { CldImage } from 'next-cloudinary'
import { useLocale } from '@/Hooks/useLocale'

export default function ServiceDetail({
	id,
	name,
	price,
	description,
	imageUrls,
	createdAt,
	updatedAt,
}: {
	id: string
	name: string
	price: number
	description: string
	imageUrls?: Array<{ id: string; url: string }>
	createdAt?: string | Date | null
	updatedAt?: string | Date | null
	createdBy?: string | null
}) {
	const { t } = useLocale()
	const { accessToken } = useToken()
	const router = useRouter()

	const benefits = [
		{
			icon: (
				<svg
					className='w-7 h-7'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
					/>
				</svg>
			),
			title: t('service.expert_title'),
			desc: t('service.expert_description'),
		},
		{
			icon: (
				<svg
					className='w-7 h-7'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
					/>
				</svg>
			),
			title: t('service.security_title'),
			desc: t('service.security_description'),
		},
		{
			icon: (
				<svg
					className='w-7 h-7'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
					/>
				</svg>
			),
			title: t('service.care_title'),
			desc: t('service.care_description'),
		},
	]

	const handleAddToCart = () => {
		if (!accessToken) {
			router.push('/login')
			return
		}
		router.push(`/app/booking/${id}`)
	}

	return (
		<main className='relative min-h-screen bg-[#F7F7F7] text-gray-900 overflow-x-hidden'>
			<FlorageBackground />
			<div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 py-16 px-4 md:px-8 relative z-10'>
				<ReturnButton to='/service' className='absolute top-10 left-10' />
				{/* Left Panel */}
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className='space-y-8 flex flex-col justify-center'
				>
					<h1 className='text-4xl font-extrabold text-main mb-2'>{name}</h1>
					<p className='text-2xl text-accent font-semibold'>
						{price.toLocaleString('vi-VN', {
							style: 'currency',
							currency: 'VND',
						})}
					</p>
					<button
						className='bg-gradient-to-r from-accent to-pink-600/70 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition duration-300 hover:from-pink-600 hover:to-rose-500 hover:scale-105'
						onClick={handleAddToCart}
					>
						{t('action.book_now')}
					</button>
					<div className='flex flex-col gap-2 text-gray-500 text-sm'>
						{createdAt && (
							<span>
								{t('service.created_at')}:{' '}
								{new Date(createdAt).toLocaleDateString('vi-VN')}
							</span>
						)}
						{updatedAt && (
							<span>
								{t('service.updated_at')}:{' '}
								{new Date(updatedAt).toLocaleDateString('vi-VN')}
							</span>
						)}
					</div>
				</motion.div>
				{/* Right Panel */}
				<motion.div
					initial={{ opacity: 0, x: 30 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className='space-y-8'
				>
					{/* Image Section */}
					<div className='bg-gray-200 h-96 w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl p-2'>
						<AutoCarousel imageUrls={imageUrls} />
					</div>
					{/* Description Section */}
					<div className='bg-white p-8 rounded-2xl shadow-md text-lg text-gray-700'>
						<h2 className='text-xl font-semibold text-main mb-4'>
							{t('service.service_description')}
						</h2>
						<p className='text-gray-600 leading-relaxed'>{description}</p>
					</div>
				</motion.div>
			</div>
			{/* Benefits Section */}
			<section className='max-w-5xl mx-auto mt-10 mb-4 px-4'>
				<motion.h3
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-2xl font-bold text-secondary mb-6 text-center'
				>
					{t('service.why_choose_us')}
				</motion.h3>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{benefits.map((b, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className='bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition'
						>
							<div className='mb-3 text-accent'>{b.icon}</div>
							<div className='font-bold text-lg mb-1 text-main'>{b.title}</div>
							<div className='text-gray-600 text-sm'>{b.desc}</div>
						</motion.div>
					))}
				</div>
			</section>
			{/* Testimonials Section */}
			<section className='max-w-5xl mx-auto my-10 px-4'>
				<motion.h3
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-2xl font-bold text-secondary mb-6 text-center'
				>
					{t('service.client_testimonials')}
				</motion.h3>
				<div className='flex flex-wrap gap-6 justify-center'>
					{Testimonials.slice(0, 3).map((item, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className='bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center hover:shadow-xl transition'
						>
							<div className='w-16 h-16 rounded-full overflow-hidden mb-3 border-4 border-accent'>
								<CldImage
									src={item.avatar}
									alt={item.name}
									width={64}
									height={64}
									className='object-cover w-full h-full'
								/>
							</div>
							<div className='font-bold text-main mb-1'>{item.name}</div>
							<div className='text-gray-600 text-sm text-center mb-2'>
								{item.content}
							</div>
						</motion.div>
					))}
				</div>
			</section>
		</main>
	)
}
