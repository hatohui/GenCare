import { CldImage } from 'next-cloudinary'
import React, { useEffect, useState } from 'react'

type AutoCarouselProps = {
	imageUrls: { url: string; id: string }[] | string[] | undefined
}

const AutoCarousel: React.FC<AutoCarouselProps> = ({ imageUrls }) => {
	const [current, setCurrent] = useState(0)
	const [isPaused, setIsPaused] = useState(false)

	// Normalize the imageUrls to always have id and url properties
	const normalizedImages =
		imageUrls?.map((img, index) => {
			if (typeof img === 'string') {
				return { id: `img-${index}`, url: img }
			}
			return img
		}) || []

	useEffect(() => {
		if (!normalizedImages || normalizedImages.length <= 1 || isPaused) return
		const interval = setInterval(() => {
			setCurrent(prev => (prev + 1) % normalizedImages.length)
		}, 3000)
		return () => clearInterval(interval)
	}, [normalizedImages, isPaused])

	if (!normalizedImages || normalizedImages.length === 0) {
		return (
			<div className='bg-gray-200 h-96 w-full flex items-center justify-center rounded-lg shadow-lg p-2'>
				<p className='text-gray-500'>No Image Available</p>
			</div>
		)
	}

	return (
		<div
			className='relative h-96 w-full rounded-lg overflow-hidden shadow-lg'
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{normalizedImages.map((img, index) => (
				<div
					key={img.id}
					className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
						current === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
					}`}
				>
					<CldImage
						width={500}
						height={500}
						src={img.url}
						alt={`Service image ${index + 1}`}
						className='object-contain h-full mx-auto'
					/>
				</div>
			))}
		</div>
	)
}

export default AutoCarousel
