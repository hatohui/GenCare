'use client'

import React from 'react'
import { useGetBlogById } from '@/Services/Blog-service'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import ReturnButton from '@/Components/ReturnButton'
import ReactMarkdown from 'react-markdown'
import { CldImage } from 'next-cloudinary'

const BlogDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const router = useRouter()
	const { id } = use(params)
	const { data: blog, isLoading, error } = useGetBlogById(id)

	if (isLoading) {
		return <div className='text-center py-20'>Đang tải bài viết...</div>
	}

	if (error || !blog) {
		router.back()
		return (
			<div className='text-center py-20 text-red-500'>
				Không tìm thấy bài viết.
			</div>
		)
	}

	return (
		<main className='relative min-h-screen bg-[#F7F7F7] text-gray-900 overflow-x-hidden'>
			<FlorageBackground />
			<ReturnButton to='/blog' />
			<div className='max-w-4xl mx-auto py-16 px-4 md:px-8'>
				{/* Blog Header */}
				<div className='mb-8'>
					<h1 className='text-4xl font-extrabold text-main mb-2'>
						{blog.title}
					</h1>
					<div className='flex flex-wrap gap-2 items-center text-sm text-gray-500 mb-2'>
						<span>
							Tác giả:{' '}
							<span className='font-semibold text-accent'>{blog.author}</span>
						</span>
						{blog.publishedAt && (
							<span>
								• {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
							</span>
						)}
					</div>
					<div className='flex flex-wrap gap-2 mb-4'>
						{blog.tagTitle &&
							blog.tagTitle.map((tag: string) => (
								<span
									key={tag}
									className='px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium'
								>
									{tag}
								</span>
							))}
					</div>
					{/* Blog Images */}
					{blog.imageUrls && blog.imageUrls.length > 0 && (
						<div className='flex flex-wrap gap-4 mb-6'>
							{blog.imageUrls.map((url: string, idx: number) => (
								<CldImage
									key={idx}
									src={url}
									alt={`Blog image ${idx + 1}`}
									className='rounded-xl shadow w-full max-w-md object-cover'
								/>
							))}
						</div>
					)}
				</div>
				{/* Blog Content */}
				<div className='bg-white p-8 rounded-2xl shadow-md text-lg text-gray-700 mb-10'>
					<ReactMarkdown>{blog.content}</ReactMarkdown>
				</div>
				{/* Comment Section */}
				<section className='bg-white p-6 rounded-2xl shadow-md'>
					<h2 className='text-xl font-bold text-main mb-4'>Bình luận</h2>
					<div className='text-gray-500 italic mb-2'>
						Chức năng bình luận sẽ sớm ra mắt!
					</div>
					{/* Future: Render comments and add comment form here */}
				</section>
			</div>
		</main>
	)
}

export default BlogDetailPage
