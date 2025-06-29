'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import TypedText from '@/Components/TypedText'
import FlorageBackground from '@/Components/Landing/FlorageBackground'

// Mock blog data
const blogPosts = [
	{
		id: 1,
		title: 'Những Điều Cần Biết Về Sức Khỏe Sinh Sản',
		excerpt:
			'Tìm hiểu về các vấn đề sức khỏe sinh sản phổ biến và cách phòng ngừa hiệu quả...',
		content:
			'Sức khỏe sinh sản là một phần quan trọng trong cuộc sống của mỗi người. Việc hiểu biết về các vấn đề sức khỏe sinh sản không chỉ giúp bạn bảo vệ sức khỏe của mình mà còn có thể hỗ trợ người thân và bạn bè...',
		author: 'Dr. Nguyễn Thị Hương',
		date: '2024-01-15',
		category: 'Sức Khỏe Sinh Sản',
		image: '/images/blog1.jpg',
		readTime: '5 phút',
		featured: true,
	},
	{
		id: 2,
		title: 'Hướng Dẫn Khám Sức Khỏe Định Kỳ',
		excerpt:
			'Khám sức khỏe định kỳ là việc làm cần thiết để phát hiện sớm các bệnh lý...',
		content:
			'Khám sức khỏe định kỳ là một trong những biện pháp quan trọng nhất để bảo vệ sức khỏe. Việc khám sức khỏe thường xuyên giúp phát hiện sớm các bệnh lý...',
		author: 'Dr. Trần Văn Minh',
		date: '2024-01-10',
		category: 'Khám Sức Khỏe',
		image: '/images/blog2.jpg',
		readTime: '7 phút',
		featured: false,
	},
	{
		id: 3,
		title: 'Dinh Dưỡng Cho Phụ Nữ Mang Thai',
		excerpt:
			'Chế độ dinh dưỡng hợp lý đóng vai trò quan trọng trong sự phát triển của thai nhi...',
		content:
			'Dinh dưỡng trong thai kỳ là yếu tố quan trọng quyết định sự phát triển khỏe mạnh của thai nhi. Một chế độ ăn uống cân bằng và đầy đủ chất dinh dưỡng...',
		author: 'Dr. Lê Thị Lan',
		date: '2024-01-08',
		category: 'Dinh Dưỡng',
		image: '/images/blog3.jpg',
		readTime: '6 phút',
		featured: false,
	},
	{
		id: 4,
		title: 'Cách Phòng Ngừa Bệnh Phụ Khoa',
		excerpt:
			'Những thói quen sinh hoạt lành mạnh giúp phòng ngừa các bệnh phụ khoa hiệu quả...',
		content:
			'Bệnh phụ khoa là những bệnh lý thường gặp ở phụ nữ. Việc phòng ngừa các bệnh này không chỉ giúp bảo vệ sức khỏe mà còn nâng cao chất lượng cuộc sống...',
		author: 'Dr. Phạm Thị Mai',
		date: '2024-01-05',
		category: 'Phụ Khoa',
		image: '/images/blog4.jpg',
		readTime: '4 phút',
		featured: false,
	},
	{
		id: 5,
		title: 'Tâm Lý Trong Thai Kỳ',
		excerpt:
			'Những thay đổi tâm lý trong thai kỳ và cách vượt qua những khó khăn này...',
		content:
			'Thai kỳ là giai đoạn có nhiều thay đổi về cả thể chất và tâm lý. Việc hiểu rõ những thay đổi này sẽ giúp các mẹ bầu chuẩn bị tâm lý tốt hơn...',
		author: 'Dr. Hoàng Thị Hoa',
		date: '2024-01-03',
		category: 'Tâm Lý',
		image: '/images/blog5.jpg',
		readTime: '8 phút',
		featured: false,
	},
	{
		id: 6,
		title: 'Chăm Sóc Sức Khỏe Sau Sinh',
		excerpt:
			'Hướng dẫn chi tiết về cách chăm sóc sức khỏe cho mẹ và bé sau khi sinh...',
		content:
			'Giai đoạn sau sinh là thời kỳ quan trọng cần được chăm sóc đặc biệt. Cả mẹ và bé đều cần được quan tâm để đảm bảo sức khỏe tốt nhất...',
		author: 'Dr. Vũ Thị Nga',
		date: '2024-01-01',
		category: 'Chăm Sóc Sau Sinh',
		image: '/images/blog6.jpg',
		readTime: '9 phút',
		featured: false,
	},
]

const categories = [
	'Sức Khỏe Sinh Sản',
	'Khám Sức Khỏe',
	'Dinh Dưỡng',
	'Phụ Khoa',
	'Tâm Lý',
	'Chăm Sóc Sau Sinh',
]

const Page = () => {
	const [selectedCategory, setSelectedCategory] = useState('Tất cả')
	const [searchTerm, setSearchTerm] = useState('')
	const [typing, setTyping] = useState(false)

	const filteredPosts = blogPosts.filter(post => {
		const matchesCategory =
			selectedCategory === 'Tất cả' || post.category === selectedCategory
		const matchesSearch =
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
		return matchesCategory && matchesSearch
	})

	const featuredPost = blogPosts.find(post => post.featured)
	const regularPosts = filteredPosts.filter(post => !post.featured)

	return (
		<main className='min-h-screen bg-gradient-to-b from-white to-general pt-20'>
			{/* Hero Section */}
			<section className='py-20 bg-gradient-to-r from-main to-secondary text-white relative overflow-hidden'>
				{/* Background overlay for better text contrast */}
				<div className='absolute inset-0 bg-black/10'></div>

				<div className='max-w-6xl mx-auto px-6 text-center relative z-10 backdrop-blur-sm'>
					<motion.h3
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='font-semibold mb-4 text-white text-shadow-2xs'
					>
						<span>KIẾN THỨC Y TẾ & TƯ VẤN SỨC KHỎE</span>
					</motion.h3>

					<motion.h1
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-5xl font-bold mb-6 text-shadow-2xs'
					>
						<TypedText
							typeSpeed={10}
							className='bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent'
							strings={['Blog Sức Khỏe GenCare']}
							onComplete={() => setTyping(true)}
						/>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className='text-xl mb-8 max-w-3xl mx-auto text-shadow-2xs'
					>
						{typing && (
							<TypedText
								typeSpeed={8}
								className='bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent'
								strings={[
									'Chia sẻ kiến thức y tế, tư vấn sức khỏe và những thông tin hữu ích từ đội ngũ chuyên gia hàng đầu',
								]}
							/>
						)}
					</motion.p>

					{/* Search Bar */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className='max-w-md mx-auto'
					>
						<div className='relative'>
							<input
								type='text'
								placeholder='Tìm kiếm bài viết...'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='w-full px-4 py-3 rounded-full text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white bg-white/90 backdrop-blur-md'
							/>
							<svg
								className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
					</motion.div>
				</div>

				{/* FlorageBackground */}
				<FlorageBackground />
			</section>

			{/* Categories */}
			<section className='py-8 bg-white border-b'>
				<div className='max-w-6xl mx-auto px-6'>
					<div className='flex flex-wrap gap-4 justify-center'>
						{['Tất cả', ...categories].map(category => (
							<motion.button
								key={category}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setSelectedCategory(category)}
								className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
									selectedCategory === category
										? 'bg-accent text-white'
										: 'bg-general text-main hover:bg-secondary hover:text-white'
								}`}
							>
								{category}
							</motion.button>
						))}
					</div>
				</div>
			</section>

			{/* Featured Post */}
			{featuredPost && (
				<section className='py-16 bg-white'>
					<div className='max-w-6xl mx-auto px-6'>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='text-3xl font-bold mb-8 text-center text-secondary'
						>
							Bài Viết Nổi Bật
						</motion.h2>

						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300'
						>
							<div className='md:flex'>
								<div className='md:w-1/2'>
									<div className='h-64 md:h-full bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
										<span className='text-white text-lg'>
											Hình ảnh bài viết
										</span>
									</div>
								</div>
								<div className='md:w-1/2 p-8'>
									<div className='flex items-center gap-4 mb-4'>
										<span className='px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium'>
											{featuredPost.category}
										</span>
										<span className='text-gray-500 text-sm'>
											{featuredPost.readTime}
										</span>
									</div>
									<h3 className='text-2xl font-bold mb-4 text-main'>
										{featuredPost.title}
									</h3>
									<p className='text-gray-600 mb-6 leading-relaxed'>
										{featuredPost.excerpt}
									</p>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 bg-general rounded-full'></div>
											<div>
												<p className='font-medium text-main'>
													{featuredPost.author}
												</p>
												<p className='text-sm text-gray-500'>
													{featuredPost.date}
												</p>
											</div>
										</div>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className='px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent/80 transition-colors'
										>
											Đọc thêm
										</motion.button>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</section>
			)}

			{/* Blog Posts Grid */}
			<section className='py-16 bg-general'>
				<div className='max-w-6xl mx-auto px-6'>
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-3xl font-bold mb-8 text-center text-secondary'
					>
						Bài Viết Mới Nhất
					</motion.h2>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{regularPosts.map((post, index) => (
							<motion.article
								key={post.id}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, delay: index * 0.1 }}
								whileHover={{ y: -5 }}
								className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl  duration-300'
							>
								<div className='h-48 bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
									<span className='text-white text-sm'>Hình ảnh bài viết</span>
								</div>
								<div className='p-6'>
									<div className='flex items-center gap-4 mb-3'>
										<span className='px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium'>
											{post.category}
										</span>
										<span className='text-gray-500 text-xs'>
											{post.readTime}
										</span>
									</div>
									<h3 className='text-xl font-bold mb-3 text-main line-clamp-2'>
										{post.title}
									</h3>
									<p className='text-gray-600 mb-4 text-sm line-clamp-3'>
										{post.excerpt}
									</p>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<div className='w-8 h-8 bg-general rounded-full'></div>
											<div>
												<p className='font-medium text-main text-sm'>
													{post.author}
												</p>
												<p className='text-xs text-gray-500'>{post.date}</p>
											</div>
										</div>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className='px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/80 transition-colors'
										>
											Đọc thêm
										</motion.button>
									</div>
								</div>
							</motion.article>
						))}
					</div>

					{/* Load More Button */}
					{regularPosts.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='text-center mt-12'
						>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className='px-8 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/80 transition-colors'
							>
								Tải thêm bài viết
							</motion.button>
						</motion.div>
					)}
				</div>
			</section>

			{/* Newsletter Signup */}
			<section className='py-16 bg-gradient-to-r from-main to-secondary text-white'>
				<div className='max-w-4xl mx-auto px-6 text-center'>
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-3xl font-bold mb-4'
					>
						Đăng Ký Nhận Tin Tức
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='text-lg mb-8'
					>
						Nhận những bài viết mới nhất về sức khỏe và tư vấn y tế từ GenCare
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'
					>
						<input
							type='email'
							placeholder='Nhập email của bạn'
							className='flex-1 px-4 py-3 rounded-full text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white'
						/>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className='px-6 py-3 bg-white text-main rounded-full font-medium hover:bg-gray-100 transition-colors'
						>
							Đăng ký
						</motion.button>
					</motion.div>
				</div>
			</section>
		</main>
	)
}

export default Page
