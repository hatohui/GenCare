'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

/**
 * Utility component to format dates based on current locale
 */
const LocalizedDate = ({
	date,
	format = 'medium',
}: {
	date: Date | string
	format?: 'short' | 'medium' | 'long' | 'full'
}) => {
	const { locale } = useLocale()
	const dateObj = date instanceof Date ? date : new Date(date)

	const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
		short: { year: 'numeric', month: '2-digit', day: '2-digit' },
		medium: { year: 'numeric', month: 'short', day: 'numeric' },
		long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' },
		full: {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
			hour: '2-digit',
			minute: '2-digit',
		},
	}

	return (
		<>
			{dateObj.toLocaleDateString(
				locale === 'en' ? 'en-US' : 'vi-VN',
				formatOptions[format]
			)}
		</>
	)
}

export default LocalizedDate
