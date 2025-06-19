'use client'

import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { CldImage } from 'next-cloudinary'
import React, { useState } from 'react'

const Page = () => {
	const [imageUrl, setImageUrl] = useState<string>('')

	return (
		<div>
			hi
			<CloudinaryButton
				className='h-full mx-auto w-20 flex center-all rounded-md bg-main'
				text='Upload'
				onUploaded={(url: string) => {
					setImageUrl(url)
				}}
				uploadPreset='demo'
			/>
			<CldImage
				src={imageUrl}
				width={300}
				height={300}
				alt='Florage Logo'
				className='rounded-lg shadow-lg'
				loading='lazy'
			/>
		</div>
	)
}

export default Page
