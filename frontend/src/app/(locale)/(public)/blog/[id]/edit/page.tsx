'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useGetBlogById, useUpdateBlog } from '@/Services/Blog-service'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import { useAccountStore } from '@/Hooks/useAccount'
import { useLocale } from '@/Hooks/useLocale'

// Dynamically import BlogForm to prevent SSR issues with Cloudinary
const BlogForm = dynamic(
	() =>
		import('@/Components/Blogs/BlogForm').then(mod => ({
			default: mod.BlogForm,
		})),
	{
		ssr: false,
		loading: () => (
			<div className='flex items-center justify-center p-8'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent'></div>
			</div>
		),
	}
)

// Import the type separately
import type { BlogCreateInput } from '@/Components/Blogs/BlogForm'

const BlogEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = React.use(params)
	const { t } = useLocale()
	const [imageUrls, setImageUrls] = React.useState<string[]>([])
	const { data: blog, isLoading } = useGetBlogById(id)
	const updateBlog = useUpdateBlog()
	const router = useRouter()
	const { data: user } = useAccountStore()

	// Check if user has permission to edit (not member or consultant)
	const canEdit = user && !['member', 'consultant'].includes(user.role?.name)

	React.useEffect(() => {
		if (blog?.imageUrls) {
			setImageUrls(blog.imageUrls)
		}
	}, [blog])

	// Redirect if user doesn't have permission
	React.useEffect(() => {
		if (user && !canEdit) {
			router.push('/403')
		}
	}, [user, canEdit, router])

	const handleSubmit = (data: BlogCreateInput) => {
		const formData = { ...data, imageUrls }
		console.log('Updating blog form:', formData)
		updateBlog.mutate(
			{ id, data: formData },
			{
				onSuccess: () => {
					// Redirect to blog detail after successful update
					setTimeout(() => {
						router.push(`/blog/${id}`)
					}, 2000)
				},
			}
		)
	}

	if (isLoading) {
		return (
			<main className='relative min-h-screen bg-gray-50 pt-20'>
				<FlorageBackground />
				<div className='max-w-7xl mx-auto px-6 py-8'>
					<div className='animate-pulse'>
						<div className='h-8 bg-gray-200 rounded w-1/4 mb-6'></div>
						<div className='h-4 bg-gray-200 rounded w-1/2 mb-8'></div>
						<div className='h-96 bg-gray-200 rounded'></div>
					</div>
				</div>
			</main>
		)
	}

	if (!blog) {
		return (
			<main className='relative min-h-screen bg-gray-50 pt-20'>
				<FlorageBackground />
				<div className='max-w-7xl mx-auto px-6 py-8'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold text-gray-900 mb-4'>
							Bài viết không tồn tại
						</h1>
						<button
							onClick={() => router.push('/blog')}
							className='px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors'
						>
							{t('blog.back_to_forum')}
						</button>
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className='relative min-h-screen bg-gray-50 pt-20'>
			<FlorageBackground />

			{/* Back Button */}
			<div className='max-w-7xl mx-auto px-6 py-4'>
				<button
					onClick={() => router.push(`/blog/${id}`)}
					className='flex items-center gap-2 text-gray-600 hover:text-accent transition-colors mb-6'
				>
					<ArrowLeft className='w-5 h-5' />
					Quay lại bài viết
				</button>
			</div>

			{/* Success/Error Messages */}
			{updateBlog.isSuccess && (
				<div className='max-w-7xl mx-auto px-6 mb-6'>
					<div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3'>
						<CheckCircle className='w-5 h-5 text-green-600' />
						<div>
							<h3 className='font-semibold text-green-800'>
								Bài viết đã được cập nhật thành công!
							</h3>
							<p className='text-green-700 text-sm'>
								Bạn sẽ được chuyển hướng về bài viết trong giây lát...
							</p>
						</div>
					</div>
				</div>
			)}

			{updateBlog.isError && (
				<div className='max-w-7xl mx-auto px-6 mb-6'>
					<div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3'>
						<AlertCircle className='w-5 h-5 text-red-600' />
						<div>
							<h3 className='font-semibold text-red-800'>
								Không thể cập nhật bài viết
							</h3>
							<p className='text-red-700 text-sm'>
								{t('error.occurred_try_again')}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Blog Form */}
			<div className='max-w-7xl mx-auto px-6 pb-10'>
				<div className='mb-6'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						{t('blog.edit_post_title')}
					</h1>
					<p className='text-gray-600'>
						Cập nhật nội dung và thông tin của bài viết
					</p>
				</div>
				<BlogForm
					onSubmit={handleSubmit}
					loading={updateBlog.isPending}
					imageUrls={imageUrls}
					onImageUrlsChange={setImageUrls}
					initialData={{
						title: blog.title,
						content: blog.content,
						author: blog.author,
						tagTitles: blog.tagTitles || [],
					}}
				/>
			</div>
		</main>
	)
}

export default BlogEditPage
