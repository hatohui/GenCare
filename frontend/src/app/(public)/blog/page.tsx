'use client'

import React, { useState } from 'react'
import { useGetBlogs } from '@/Services/Blog-service'
import Pagination from '@/Components/Management/Pagination'
import { usePagination } from '@/Hooks/List/usePagination'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import TypedText from '@/Components/TypedText'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import { useAccountStore } from '@/Hooks/useAccount'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'

// Tag suggestions (reuse from BlogForm)
const TAG_SUGGESTIONS = [
	'health',
	'wellness',
	'nutrition',
	'fitness',
	'mental health',
	'exercise',
	'diet',
	'lifestyle',
	'self-care',
	'motivation',
	'productivity',
	'mindfulness',
	'stress',
	'happiness',
	'sleep',
	'workout',
	'yoga',
	'meditation',
	'recipes',
	'tips',
	'advice',
]

const ITEMS_PER_PAGE = 6

const BlogPage = () => {
	const [search, setSearch] = useState('')
	const [selectedTag, setSelectedTag] = useState<string | null>(null)
	const [page, setPage] = useState(1)
	const router = useRouter()
	const { data: user } = useAccountStore()

	// Authorization: consultant, staff, manager, admin
	const canCreateBlog =
		user &&
		['consultant', 'staff', 'manager', 'admin'].includes(user.role?.name)

	// Fetch blogs
	const { data, isFetching } = useGetBlogs(
		page,
		ITEMS_PER_PAGE,
		search,
		selectedTag
	)
	const blogs = data || []

	// Handlers
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
		setPage(1)
	}

	const handleTagClick = (tag: string | null) => {
		setSelectedTag(tag)
		setPage(1)
	}

	// Pagination logic for array-only API
	const canGoNext = blogs.length === ITEMS_PER_PAGE
	const canGoPrev = page > 1

	return (
		<main className='min-h-screen bg-gradient-to-b from-white to-general pt-20'>
			{/* Floating Create Blog Button */}
			{canCreateBlog && (
				<button
					onClick={() => router.push('/blog/create')}
					className='fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-accent/30 transition text-2xl group'
					title='Thêm Blog Mới'
					aria-label='Thêm Blog Mới'
				>
					<Plus className='w-8 h-8' />
					<span className='sr-only'>Thêm Blog Mới</span>
					<span className='absolute bottom-20 right-0 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none'>
						Thêm Blog Mới
					</span>
				</button>
			)}
			{/* Hero Section */}
			<section className='py-20 bg-gradient-to-r from-main to-secondary text-white relative overflow-hidden'>
				<div className='absolute inset-0 florageBackground' />
				<div className='max-w-6xl mx-auto px-6 text-center relative z-10 backdrop-blur-sm'>
					<h3 className='font-semibold mb-4 text-white text-shadow-2xs'>
						<span>KIẾN THỨC Y TẾ & TƯ VẤN SỨC KHỎE</span>
					</h3>
					<h1 className='text-5xl font-bold mb-6 text-shadow-2xs'>
						<TypedText
							typeSpeed={10}
							className='bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent'
							strings={['Blog Sức Khỏe GenCare']}
						/>
					</h1>
					<p className='text-xl mb-8 max-w-3xl mx-auto text-shadow-2xs'>
						<TypedText
							typeSpeed={8}
							className='bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent'
							strings={[
								'Chia sẻ kiến thức y tế, tư vấn sức khỏe và những thông tin hữu ích từ đội ngũ chuyên gia hàng đầu',
							]}
						/>
					</p>
					{/* Search Bar */}
					<div className='max-w-md mx-auto'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Tìm kiếm bài viết...'
								value={search}
								onChange={handleSearchChange}
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
					</div>
				</div>
				<FlorageBackground />
			</section>

			{/* Tag Filter */}
			<section className='py-8 bg-white border-b'>
				<div className='max-w-6xl mx-auto px-6'>
					<div className='flex flex-wrap gap-4 justify-center'>
						<button
							onClick={() => handleTagClick(null)}
							className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
								!selectedTag
									? 'bg-accent text-white'
									: 'bg-general text-main hover:bg-secondary hover:text-white'
							}`}
						>
							Tất cả
						</button>
						{TAG_SUGGESTIONS.map(tag => (
							<button
								key={tag}
								onClick={() => handleTagClick(tag)}
								className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
									selectedTag === tag
										? 'bg-accent text-white'
										: 'bg-general text-main hover:bg-secondary hover:text-white'
								}`}
							>
								{tag}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Blog List */}
			<section className='py-16 bg-general'>
				<div className='max-w-6xl mx-auto px-6'>
					<h2 className='text-3xl font-bold mb-8 text-center text-secondary'>
						Bài Viết Mới Nhất
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{blogs.length === 0 && !isFetching && (
							<div className='col-span-full text-center text-gray-500'>
								Không có bài viết nào.
							</div>
						)}
						{blogs.map((blog: any) => (
							<article
								key={blog.id}
								className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300'
							>
								<div className='h-48 bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
									{blog.imageUrls && blog.imageUrls[0] ? (
										<img
											src={blog.imageUrls[0]}
											alt={blog.title}
											className='object-cover w-full h-full'
										/>
									) : (
										<span className='text-white text-sm'>
											Hình ảnh bài viết
										</span>
									)}
								</div>
								<div className='p-6'>
									<div className='flex items-center gap-4 mb-3 flex-wrap'>
										{blog.tagId &&
											blog.tagId.map((tag: string) => (
												<span
													key={tag}
													className='px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium'
												>
													{tag}
												</span>
											))}
									</div>
									<h3 className='text-xl font-bold mb-3 text-main line-clamp-2'>
										{blog.title}
									</h3>
									<p className='text-gray-600 mb-4 text-sm line-clamp-3'>
										{blog.content?.slice(0, 120) || ''}...
									</p>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<div className='w-8 h-8 bg-general rounded-full'></div>
											<div>
												<p className='font-medium text-main text-sm'>
													{blog.author}
												</p>
												<p className='text-xs text-gray-500'>
													{blog.publishedAt
														? new Date(blog.publishedAt).toLocaleDateString()
														: ''}
												</p>
											</div>
										</div>
										<button
											className='px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/80 transition-colors'
											onClick={() => router.push(`/blog/${blog.id}`)}
										>
											Đọc thêm
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
					{/* Pagination */}
					{(canGoPrev || canGoNext) && (
						<div className='mt-12 flex justify-center gap-4'>
							<button
								className='px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-50'
								onClick={() => setPage(p => Math.max(1, p - 1))}
								disabled={!canGoPrev || isFetching}
							>
								Trang trước
							</button>
							<span className='px-4 py-2 text-main font-medium'>
								Trang {page}
							</span>
							<button
								className='px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-50'
								onClick={() => setPage(p => p + 1)}
								disabled={!canGoNext || isFetching}
							>
								Trang sau
							</button>
						</div>
					)}
				</div>
			</section>
		</main>
	)
}

export default BlogPage
