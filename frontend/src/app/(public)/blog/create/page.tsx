'use client'

import React from 'react'
import { BlogForm, BlogCreateInput } from '@/Components/Blogs/BlogForm'
import { useCreateBlog } from '@/Services/Blog-service'

const BlogCreatePage = () => {
	const [imageUrls, setImageUrls] = React.useState<string[]>([])
	const createBlog = useCreateBlog()

	const handleSubmit = (data: BlogCreateInput) => {
		const formData = { ...data, imageUrls }
		console.log('Submitting blog form:', formData)
		createBlog.mutate(formData)
	}

	return (
		<div className='flex flex-col gap-4 p-10 pt-30'>
			<BlogForm
				onSubmit={handleSubmit}
				loading={createBlog.isPending}
				imageUrls={imageUrls}
				onImageUrlsChange={setImageUrls}
			/>
			{/* Optionally show success/error messages */}
			{createBlog.isSuccess && (
				<p className='text-green-600 mt-4'>Blog created successfully!</p>
			)}
			{createBlog.isError && (
				<p className='text-red-600 mt-4'>
					Failed to create blog. Please try again.
				</p>
			)}
		</div>
	)
}

export default BlogCreatePage
