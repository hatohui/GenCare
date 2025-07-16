'use client'

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import React from 'react'

/**
 * A button component that opens a Cloudinary upload widget.
 *
 * @param {string} className - The CSS class to apply to the button.
 * @param {string} text - The text to display on the button.
 * @param {string} [uploadPreset='gencare'] - The upload preset configuration for Cloudinary.
 * @param {(url: string, publicId: string) => void} [onUploaded] - Callback function to be called with the uploaded file's URL and public ID upon successful upload.
 * @param {(error: string) => void} [onError] - Callback function to be called when upload fails.
 */

export const CloudinaryButton = ({
	className,
	text,
	uploadPreset = 'gencare',
	onUploaded,
	onError,
}: {
	className?: string
	text: string
	uploadPreset?: string
	onUploaded: (url: string, publicId: string) => void
	onError?: (error: string) => void
}) => {
	const [isUploading, setIsUploading] = useState(false)

	// Timeout fallback to prevent stuck uploading state
	React.useEffect(() => {
		let timeoutId: NodeJS.Timeout

		if (isUploading) {
			timeoutId = setTimeout(() => {
				console.warn('CloudinaryButton: Upload timeout, resetting state')
				setIsUploading(false)
			}, 30000) // 30 seconds timeout
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [isUploading])

	return (
		<CldUploadWidget
			options={{
				sources: ['local', 'google_drive'],
				multiple: false,
				maxFiles: 1,
				clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
			}}
			signatureEndpoint='/api/sign-image'
			uploadPreset={uploadPreset}
			onOpen={() => {
				console.log('CloudinaryButton: Widget opened')
				setIsUploading(true)
			}}
			onClose={() => {
				console.log('CloudinaryButton: Widget closed')
				setIsUploading(false)
			}}
			onSuccess={(result: CloudinaryUploadWidgetResults) => {
				const info = result.info as {
					secure_url: string
					public_id: string
				}

				console.log('CloudinaryButton Uploaded successfully:', info.secure_url)
				setIsUploading(false)
				onUploaded(info.secure_url, info.public_id)
			}}
			onError={error => {
				console.error('CloudinaryButton Upload error:', error)
				setIsUploading(false)
				const errorMessage =
					typeof error === 'string'
						? error
						: error?.statusText || 'Upload failed'
				onError?.(errorMessage)
			}}
		>
			{({ open }) => (
				<button
					type='button'
					className={`flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white font-semibold shadow hover:bg-blue-700 focus:ring-2 focus:ring-accent/50 transition ${
						className || ''
					}`}
					onClick={() => open()}
					disabled={isUploading}
				>
					{typeof UploadCloud !== 'undefined' && (
						<UploadCloud className='w-5 h-5' />
					)}
					<span>{isUploading ? 'Uploading...' : text}</span>
				</button>
			)}
		</CldUploadWidget>
	)
}
