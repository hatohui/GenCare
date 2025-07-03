import { Blog } from '@/Interfaces/Blogs/Types/Blogs'
import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const BlogCard = ({ blog }: { blog: Blog }) => {
	const router = useRouter()
	return (
		<article
			key={blog.id}
			className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300'
		>
			<div className='h-48 bg-gradient-to-br from-main to-secondary flex items-center justify-center'>
				{blog.imageUrls && blog.imageUrls[0] ? (
					<CldImage
						src={blog.imageUrls[0]}
						alt={blog.title}
						className='object-cover w-full h-full'
					/>
				) : (
					<span className='text-white text-sm'>Hình ảnh bài viết</span>
				)}
			</div>
			<div className='p-6'>
				<div className='flex items-center gap-4 mb-3 flex-wrap'>
					{blog.tagTitle &&
						blog.tagTitle.map((tag: string) => (
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
				<div className='text-gray-600 mb-4 text-sm line-clamp-3'>
					<ReactMarkdown>{blog.content?.slice(0, 120) || ''}</ReactMarkdown>
				</div>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 bg-general rounded-full'></div>
						<div>
							<p className='font-medium text-main text-sm'>{blog.author}</p>
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
	)
}

export default BlogCard
