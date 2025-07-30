import { useRouter } from 'next/navigation'
import AutoCarousel from '../AutoCarousel'
import useToken from '@/Hooks/Auth/useToken'
import ReturnButton from '../ReturnButton'
import { motion } from 'motion/react'
import Testimonials from '@/Constants/Testomonial'
import { CldImage } from 'next-cloudinary'
import { useLocale } from '@/Hooks/useLocale'
import LocalizedCurrency from '@/Components/LocalizedCurrency'

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
					className='w-8 h-8'
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
			color: 'from-blue-500 to-cyan-500',
		},
		{
			icon: (
				<svg
					className='w-8 h-8'
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
			color: 'from-green-500 to-emerald-500',
		},
		{
			icon: (
				<svg
					className='w-8 h-8'
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
			color: 'from-pink-500 to-rose-500',
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
		<main className='min-h-screen bg-gray-50'>
			{/* Hero Section */}
			<section className='bg-white border-b border-gray-200'>
				<div className='max-w-6xl mx-auto px-6 py-8'>
					<ReturnButton to='/service' className='mb-8' />

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
						{/* Service Info */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='order-2 lg:order-1'
						>
							<div className='mb-8'>
								<h1 className='text-4xl font-bold text-gray-900 mb-6 leading-tight'>
									{name}
								</h1>
								<div className='text-3xl font-bold text-main mb-8'>
									<LocalizedCurrency amount={price} />
								</div>
							</div>

							<button
								className='w-full bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 mb-8'
								onClick={handleAddToCart}
							>
								{t('action.book_now')}
							</button>

							{/* Service Metadata */}
							{(createdAt || updatedAt) && (
								<div className='space-y-2 text-sm text-gray-500 pt-6 border-t border-gray-200'>
									{createdAt && (
										<div>
											<span className='font-medium'>
												{t('service.created_at')}:
											</span>{' '}
											{new Date(createdAt).toLocaleDateString('vi-VN')}
										</div>
									)}
									{updatedAt && (
										<div>
											<span className='font-medium'>
												{t('service.updated_at')}:
											</span>{' '}
											{new Date(updatedAt).toLocaleDateString('vi-VN')}
										</div>
									)}
								</div>
							)}
						</motion.div>

						{/* Service Image */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className='order-1 lg:order-2'
						>
							<div className='aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg'>
								<AutoCarousel imageUrls={imageUrls} />
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Description Section */}
			<section className='py-16'>
				<div className='max-w-4xl mx-auto px-6'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='bg-white rounded-xl border border-gray-200 p-10 shadow-lg'
					>
						<h2 className='text-3xl font-bold text-main mb-6 flex items-center'>
							<span className='w-1 h-8 bg-main rounded mr-4'></span>
							{t('service.service_description')}
						</h2>
						<p className='text-gray-700 leading-relaxed text-lg'>
							{description}
						</p>
					</motion.div>
				</div>
			</section>
			{/* Benefits Section */}
			<section className='py-16 bg-white border-t border-gray-200'>
				<div className='max-w-6xl mx-auto px-6'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center mb-16'
					>
						<h3 className='text-3xl font-bold text-gray-900 mb-6'>
							{t('service.why_choose_us')}
						</h3>
						<p className='text-gray-600 max-w-2xl mx-auto text-lg'>
							Chúng tôi cam kết mang đến dịch vụ chất lượng cao với đội ngũ
							chuyên gia giàu kinh nghiệm
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{benefits.map((benefit, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
								className='bg-white text-center p-8 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
							>
								<div className='w-16 h-16 bg-main/10 rounded-xl flex items-center justify-center mb-6 text-main mx-auto'>
									{benefit.icon}
								</div>
								<h4 className='font-semibold text-xl mb-4 text-gray-900'>
									{benefit.title}
								</h4>
								<p className='text-gray-600 leading-relaxed'>{benefit.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className='py-16'>
				<div className='max-w-6xl mx-auto px-6'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center mb-16'
					>
						<h3 className='text-3xl font-bold text-gray-900 mb-6'>
							{t('service.client_testimonials')}
						</h3>
						<p className='text-gray-600 max-w-2xl mx-auto text-lg'>
							Hàng ngàn khách hàng đã tin tưởng và hài lòng với dịch vụ của
							chúng tôi
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{Testimonials.slice(0, 3).map((item, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
								className='bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'
							>
								<div className='flex items-center mb-6'>
									<div className='w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 mr-4'>
										<CldImage
											src={item.avatar}
											alt={item.name}
											width={56}
											height={56}
											className='object-cover w-full h-full'
										/>
									</div>
									<div>
										<h5 className='font-semibold text-gray-900 text-lg'>
											{item.name}
										</h5>
										<div className='flex text-yellow-400'>{'★'.repeat(5)}</div>
									</div>
								</div>
								<blockquote className='text-gray-600 leading-relaxed italic'>
									&ldquo;{item.content}&rdquo;
								</blockquote>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</main>
	)
}
