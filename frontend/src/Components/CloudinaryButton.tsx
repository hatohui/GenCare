'use client'

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'

/**
 * A button component that opens a Cloudinary upload widget.
 *
 * @param {string} className - The CSS class to apply to the button.
 * @param {string} text - The text to display on the button.
 * @param {string} [uploadPreset='gencare'] - The upload preset configuration for Cloudinary.
 * @param {(url: string, publicId: string) => void} [onUploaded] - Callback function to be called with the uploaded file's URL and public ID upon successful upload.
 */

export const CloudinaryButton = ({
	className,
	text,
	uploadPreset = 'gencare',
	onUploaded,
}: {
	className?: string
	text: string
	uploadPreset?: string
	onUploaded: (url: string, publicId: string) => void
}) => (
	<CldUploadWidget
		options={{ sources: ['local', 'google_drive'] }}
		signatureEndpoint='/api/sign-image'
		uploadPreset={uploadPreset}
		onSuccess={(result: CloudinaryUploadWidgetResults) => {
			const info = result.info as {
				secure_url: string
				public_id: string
			}

			console.log('CloudinaryButton Uploaded successfully:', info.secure_url)

			onUploaded(info.secure_url, info.public_id)
		}}
	>
		{({ open }) => (
			<button type='button' className={className} onClick={() => open()}>
				{text}
			</button>
		)}
	</CldUploadWidget>
)
