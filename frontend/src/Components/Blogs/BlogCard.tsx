import { Blog } from '@/Interfaces/Blogs/Types/Blogs'
import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Heart, MessageCircle } from 'lucide-react'
import { useLikeBlog } from '@/Services/Blog-service'
import { useAccountStore } from '@/Hooks/useAccount'

const BlogCard = ({ blog }: { blog: Blog }) => {
	const router = useRouter()
	const { data: user } = useAccountStore()
	const likeBlog = useLikeBlog()
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
					{blog.tagTitles &&
						blog.tagTitles.map((tag: string) => (
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
					<div className='flex items-center gap-4'>
						{/* Stats */}
						<div className='flex items-center gap-3 text-gray-500 text-sm'>
							<div className='flex items-center gap-1'>
								<MessageCircle className='w-4 h-4' />
								<span>{blog.comments || 0}</span>
							</div>
							{user ? (
								<button
									onClick={e => {
										e.stopPropagation()
										likeBlog.mutate(blog.id)
									}}
									disabled={likeBlog.isPending}
									className='flex items-center gap-1 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
								>
									<Heart className='w-4 h-4' />
									<span>{blog.likes || 0}</span>
								</button>
							) : (
								<button
									onClick={e => {
										e.stopPropagation()
										router.push('/login')
									}}
									className='flex items-center gap-1 hover:text-red-500 transition-colors'
								>
									<Heart className='w-4 h-4' />
									<span>{blog.likes || 0}</span>
								</button>
							)}
						</div>
						<button
							className='px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent/80 transition-colors'
							onClick={() => router.push(`/blog/${blog.id}`)}
						>
							Đọc thêm
						</button>
					</div>
				</div>
			</div>
		</article>
	)
}

export default BlogCard
