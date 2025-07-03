'use client'

import React from 'react'
import { BlogForm, BlogCreateInput } from '@/Components/Blogs/BlogForm'

const BlogCreatePage = () => {
	const [imageUrls, setImageUrls] = React.useState<string[]>([])
	const handleSubmit = (data: BlogCreateInput) => {
		const formData = { ...data, imageUrls }
		// TODO: Send formData to your API
		console.log('Blog create data:', formData)
		// Optionally reset form or redirect
	}

	return (
		<div className='flex flex-col gap-4 p-10 pt-30'>
			<BlogForm
				onSubmit={handleSubmit}
				loading={false}
				imageUrls={imageUrls}
				onImageUrlsChange={setImageUrls}
			/>
		</div>
	)
}

export default BlogCreatePage
