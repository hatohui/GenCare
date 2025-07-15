'use client'

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'

/**
 * A button component that opens a Cloudinary upload widget for multiple images.
 *
 * @param {string} className - The CSS class to apply to the button.
 * @param {string} text - The text to display on the button.
 * @param {string} [uploadPreset='gencare'] - The upload preset configuration for Cloudinary.
 * @param {(urls: string[], publicIds: string[]) => void} [onUploaded] - Callback function to be called with the uploaded files' URLs and public IDs upon successful upload.
 * @param {number} [maxFiles=5] - Maximum number of files to upload.
 */

export const CloudinaryMultiButton = ({
	className,
	text,
	uploadPreset = 'gencare',
	onUploaded,
	maxFiles = 5,
}: {
	className?: string
	text: string
	uploadPreset?: string
	onUploaded: (urls: string[], publicIds: string[]) => void
	maxFiles?: number
}) => (
	<CldUploadWidget
		options={{
			sources: ['local', 'google_drive'],
			multiple: true,
			maxFiles: maxFiles,
			clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
		}}
		signatureEndpoint='/api/sign-image'
		uploadPreset={uploadPreset}
		onSuccess={(result: CloudinaryUploadWidgetResults) => {
			if (Array.isArray(result.info)) {
				// Multiple files uploaded
				const urls = result.info.map((info: any) => info.secure_url)
				const publicIds = result.info.map((info: any) => info.public_id)
				console.log('CloudinaryMultiButton Uploaded successfully:', urls)
				onUploaded(urls, publicIds)
			} else {
				// Single file uploaded
				const info = result.info as {
					secure_url: string
					public_id: string
				}
				console.log('CloudinaryMultiButton Uploaded successfully:', [
					info.secure_url,
				])
				onUploaded([info.secure_url], [info.public_id])
			}
		}}
	>
		{({ open }) => (
			<button type='button' className={className} onClick={() => open()}>
				{text}
			</button>
		)}
	</CldUploadWidget>
)
