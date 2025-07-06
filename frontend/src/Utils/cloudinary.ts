/**
 * Utility functions for handling Cloudinary URLs
 */

/**
 * Check if a URL is a Cloudinary URL
 * @param url - The URL to check
 * @returns boolean - True if it's a Cloudinary URL, false otherwise
 */
export const isCloudinaryUrl = (url: string): boolean => {
	if (!url || typeof url !== 'string') return false

	// Check for common Cloudinary URL patterns
	const cloudinaryPatterns = [
		/^https?:\/\/res\.cloudinary\.com\//,
		/^https?:\/\/.*\.cloudinary\.com\//,
		/^https?:\/\/cloudinary\.com\//,
		/^https?:\/\/.*\.cloudinary\.com\/.*\/upload\//,
		/^https?:\/\/res\.cloudinary\.com\/.*\/image\/upload\//,
	]

	return cloudinaryPatterns.some(pattern => pattern.test(url))
}

/**
 * Check if a URL is an external URL (not Cloudinary)
 * @param url - The URL to check
 * @returns boolean - True if it's an external URL, false if it's Cloudinary
 */
export const isExternalUrl = (url: string): boolean => {
	if (!url || typeof url !== 'string') return false

	// If it's not a Cloudinary URL, it's considered external
	return !isCloudinaryUrl(url)
}

/**
 * Get the appropriate image component based on URL type
 * @param url - The image URL
 * @param cloudinaryComponent - The Cloudinary component to render
 * @param fallbackComponent - The fallback component for external URLs
 * @returns JSX.Element - The appropriate component
 */
export const getImageComponent = (
	url: string,
	cloudinaryComponent: React.ReactNode,
	fallbackComponent: React.ReactNode
): React.ReactNode => {
	if (isCloudinaryUrl(url)) {
		return cloudinaryComponent
	}
	return fallbackComponent
}
