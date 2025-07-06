'use client'

import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import { isCloudinaryUrl } from '@/Utils/cloudinary'

interface ConditionalCldImageProps {
	src: string
	alt: string
	width: number
	height: number
	className?: string
	fallbackSrc?: string
	fallbackComponent?: React.ReactNode
	onError?: () => void
	priority?: boolean
	quality?: number
	fill?: boolean
	sizes?: string
}

export const ConditionalCldImage: React.FC<ConditionalCldImageProps> = ({
	src,
	alt,
	width,
	height,
	className = '',
	fallbackSrc = '/images/default_avatar.png',
	fallbackComponent,
	onError,
	priority = false,
	quality = 75,
	fill = false,
	sizes,
}) => {
	// If it's a Cloudinary URL, use CldImage
	if (isCloudinaryUrl(src)) {
		return (
			<CldImage
				src={src}
				alt={alt}
				width={width}
				height={height}
				className={className}
				onError={onError}
				priority={priority}
				quality={quality}
				fill={fill}
				sizes={sizes}
			/>
		)
	}

	// If a custom fallback component is provided, use it
	if (fallbackComponent) {
		return <>{fallbackComponent}</>
	}

	// Otherwise, use Next.js Image with fallback
	return (
		<Image
			src={src || fallbackSrc}
			alt={alt}
			width={width}
			height={height}
			className={className}
			onError={onError}
			priority={priority}
			quality={quality}
			fill={fill}
			sizes={sizes}
		/>
	)
}
