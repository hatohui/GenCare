'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useCreateBlog } from '@/Services/Blog-service'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import { useLocale } from '@/Hooks/useLocale'
import Head from 'next/head'

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

const BlogCreatePage = () => {
	const { t } = useLocale()
	const [imageUrls, setImageUrls] = React.useState<string[]>([])
	const createBlog = useCreateBlog()
	const router = useRouter()

	const handleSubmit = (data: BlogCreateInput) => {
		const formData = { ...data, imageUrls }
		console.log('Submitting blog form:', formData)
		createBlog.mutate(formData, {
			onSuccess: () => {
				// Redirect to blog list after successful creation
				setTimeout(() => {
					router.push('/blog')
				}, 2000)
			},
		})
	}

	return (
		<>
			<Head>
				<title>{t('blog.create_post')} - GenCare</title>
				<meta name='description' content={t('blog.create_post_description')} />
				<meta property='og:title' content={t('blog.create_post')} />
				<meta
					property='og:description'
					content={t('blog.create_post_description')}
				/>
				<meta property='og:type' content='website' />
			</Head>
			<main className='relative min-h-screen bg-gray-50 pt-20'>
				<FlorageBackground />

				{/* Back Button */}
				<div className='max-w-7xl mx-auto px-6 py-4'>
					<button
						onClick={() => router.back()}
						className='flex items-center gap-2 text-gray-600 hover:text-accent transition-colors mb-6'
					>
						<ArrowLeft className='w-5 h-5' />
						{t('blog.back_to_forum')}
					</button>
				</div>

				{/* Success/Error Messages */}
				{createBlog.isSuccess && (
					<div className='max-w-7xl mx-auto px-6 mb-6'>
						<div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3'>
							<CheckCircle className='w-5 h-5 text-green-600' />
							<div>
								<h3 className='font-semibold text-green-800'>
									{t('blog.post_created_successfully')}
								</h3>
								<p className='text-green-700 text-sm'>
									{t('blog.redirecting_to_forum')}
								</p>
							</div>
						</div>
					</div>
				)}

				{createBlog.isError && (
					<div className='max-w-7xl mx-auto px-6 mb-6'>
						<div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3'>
							<AlertCircle className='w-5 h-5 text-red-600' />
							<div>
								<h3 className='font-semibold text-red-800'>
									{t('blog.cannot_create_post')}
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
					<BlogForm
						onSubmit={handleSubmit}
						loading={createBlog.isPending}
						imageUrls={imageUrls}
						onImageUrlsChange={setImageUrls}
					/>
				</div>
			</main>
		</>
	)
}

export default BlogCreatePage
