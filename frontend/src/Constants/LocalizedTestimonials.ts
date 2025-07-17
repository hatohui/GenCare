import { useLocale } from '@/Hooks/useLocale'

// This function gets testimonials with localized content
export const useLocalizedTestimonials = () => {
	const { t } = useLocale()

	// Define testimonials with localized content using translation keys
	const testimonials = [
		{
			name: t('testimonials.author1.name'),
			avatar: '/landing/1.jpg',
			content: t('testimonials.author1.content'),
		},
		{
			name: t('testimonials.author2.name'),
			avatar: '/landing/2.jpg',
			content: t('testimonials.author2.content'),
		},
		{
			name: t('testimonials.author3.name'),
			avatar: '/landing/3.jpg',
			content: t('testimonials.author3.content'),
		},
		{
			name: t('testimonials.author4.name'),
			avatar: '/landing/4.jpg',
			content: t('testimonials.author4.content'),
		},
		{
			name: t('testimonials.author5.name'),
			avatar: '/landing/5.JPG',
			content: t('testimonials.author5.content'),
		},
		{
			name: t('testimonials.author6.name'),
			avatar: '/landing/6.jpg',
			content: t('testimonials.author6.content'),
		},
	]

	return testimonials
}

export default useLocalizedTestimonials
