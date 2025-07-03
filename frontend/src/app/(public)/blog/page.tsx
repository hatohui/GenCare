'use client'

import React from 'react'
import { useGetBlogs } from '@/Services/Blog-service'
import Pagination from '@/Components/Management/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import TypedText from '@/Components/TypedText'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import { useAccountStore } from '@/Hooks/useAccount'
import SearchBar from '@/Components/Management/SearchBar'
import BlogCard from '@/Components/Blogs/BlogCard'
import { Blog } from '@/Interfaces/Blogs/Types/Blogs'

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
	const router = useRouter()
	const searchParams = useSearchParams()
	const { data: user } = useAccountStore()

	// Always derive filters from URL
	const search = searchParams?.get('search') || ''
	const selectedTag = searchParams?.get('tag') || null
	const page = Number(searchParams?.get('page')) || 1

	// Fetch blogs
	const { data, isFetching } = useGetBlogs(
		page,
		ITEMS_PER_PAGE,
		search,
		selectedTag
	)
	const blogs = data || []

	// Handlers
	const handleTagClick = (tag: string | null) => {
		const params = new URLSearchParams(searchParams?.toString())
		if (tag) {
			params.set('tag', tag)
		} else {
			params.delete('tag')
		}
		params.set('page', '1') // reset to first page on tag change
		router.push(`/blog?${params.toString()}`)
	}

	const handlePageChange: React.Dispatch<
		React.SetStateAction<number>
	> = value => {
		const newPage = typeof value === 'function' ? value(page) : value
		const params = new URLSearchParams(searchParams?.toString())
		params.set('page', String(newPage))
		router.push(`/blog?${params.toString()}`)
	}

	// Authorization: consultant, staff, manager, admin
	const canCreateBlog =
		user &&
		['consultant', 'staff', 'manager', 'admin'].includes(user.role?.name)

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

			{/* Search Bar */}
			<div className='max-w-md mx-auto px-6 py-7'>
				<SearchBar className='w-full' />
			</div>

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
						{blogs.map((blog: Blog) => (
							<BlogCard key={blog.id} blog={blog} />
						))}
					</div>
					{/* Pagination */}
					<div className='flex justify-center'>
						<Pagination
							currentPage={page}
							isFetching={isFetching}
							setCurrentPage={handlePageChange}
							totalCount={blogs.length}
							itemsPerPage={ITEMS_PER_PAGE}
						/>
					</div>
				</div>
			</section>
		</main>
	)
}

export default BlogPage
