'use client'

import { BookingButton } from '@/Components/Services/ServiceCart'
import { useEffect } from 'react'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import ServiceList from '@/Components/Services/ServiceList'
import SearchBar from '@/Components/Management/SearchBar'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { SearchSVG } from '@/Components/SVGs'
import { motion } from 'motion/react'

export default function Page() {
	const searchParams = useSearchParams()

	useEffect(() => {
		const sort = searchParams?.get('orderByPrice') || ''
		const search = searchParams?.get('search') || ''

		console.log(sort, search)
	}, [searchParams]) // triggers when the URL params change

	return (
		<section className='min-h-screen bg-gradient-to-b from-white to-general mt-20'>
			{/* Hero Section */}
			<section className='relative z-0 py-20 bg-gradient-to-r from-main to-secondary text-white overflow-hidden'>
				{/* Background overlay */}
				<div className='absolute top-0 left-0 z-10 florageBackground' />
				<div className='relative max-w-7xl mx-auto px-6 text-center'>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-4xl md:text-5xl font-bold mb-6'
					>
						Dịch Vụ{' '}
						<span className='bg-gradient-to-r from-yellow-300 to-accent bg-clip-text text-transparent'>
							Chăm Sóc Sức Khỏe
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-xl mb-8 max-w-3xl mx-auto'
					>
						Khám phá các dịch vụ y tế chất lượng cao với đội ngũ chuyên gia giàu
						kinh nghiệm
					</motion.p>
				</div>

				{/* FlorageBackground */}
				<FlorageBackground />
			</section>

			{/* Search and Filter Section */}
			<section className='py-8 bg-white border-b border-gray-100'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-center mb-12'
					>
						<h2 className='text-3xl md:text-4xl font-bold mb-4 text-secondary'>
							Dịch Vụ{' '}
							<span className='bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent'>
								Nổi Bật
							</span>
						</h2>
						<p className='text-gray-600 max-w-2xl mx-auto'>
							Chọn lựa từ các dịch vụ chăm sóc sức khỏe chất lượng cao, được
							thiết kế để đáp ứng mọi nhu cầu của bạn
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className='bg-general rounded-[30px] p-6 shadow-lg'
					>
						<div className='flex flex-col lg:flex-row gap-10 items-center'>
							<div className='relative flex-1 w-full'>
								<SearchSVG className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 z-10 size-7 ' />

								<SearchBar className='border-none  ml-15  pr-10 py-3 rounded-[30px] text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-main/20' />
							</div>
							<div className='flex gap-3'>
								<button
									className={clsx(
										'px-6 py-3 rounded-[30px] font-medium transition-all duration-300 border-2',
										{
											'bg-main text-white border-main':
												searchParams?.get('orderByPrice') === 'true',
											'bg-white text-main border-main/30 hover:bg-main/5':
												searchParams?.get('orderByPrice') !== 'true',
										}
									)}
									onClick={() => {
										const params = new URLSearchParams(
											searchParams ? searchParams : ''
										)
										if (params.has('orderByPrice')) {
											params.delete('orderByPrice')
										} else {
											params.set('orderByPrice', 'true')
										}
										window.location.search = params.toString()
									}}
								>
									{searchParams?.get('orderByPrice') === 'true' ? '✓' : '⚡'}{' '}
									Sắp xếp theo giá
								</button>
								<BookingButton />
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Services Section */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-6'>
					<ServiceList />
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16 bg-white'>
				<div className='max-w-7xl mx-auto px-6'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-center mb-12'
					>
						<h2 className='text-3xl md:text-4xl font-bold mb-4 text-secondary'>
							Tại Sao Chọn{' '}
							<span className='bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent'>
								Dịch Vụ Của Chúng Tôi?
							</span>
						</h2>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{[
							{
								title: 'Chuyên Gia Hàng Đầu',
								description:
									'Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu',
								icon: '👨‍⚕️',
							},
							{
								title: 'Công Nghệ Hiện Đại',
								description:
									'Trang thiết bị y tế tiên tiến, đảm bảo kết quả chính xác',
								icon: '🔬',
							},
							{
								title: 'Dịch Vụ Tận Tâm',
								description:
									'Chăm sóc khách hàng 24/7 với sự tận tâm và chuyên nghiệp',
								icon: '💝',
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.2 }}
								whileHover={{ y: -5 }}
								className='text-center p-6 rounded-[30px] bg-gradient-to-br from-general to-white shadow-lg hover:shadow-xl transition-all duration-300'
							>
								<div className='text-4xl mb-4'>{feature.icon}</div>
								<h3 className='text-xl font-bold mb-3 text-secondary'>
									{feature.title}
								</h3>
								<p className='text-gray-600'>{feature.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</section>
	)
}
