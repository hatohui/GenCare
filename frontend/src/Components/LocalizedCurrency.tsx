'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

/**
 * Utility component to format currency based on current locale
 */
const LocalizedCurrency = ({
	amount,
	currency = 'VND',
}: {
	amount: number
	currency?: string
}) => {
	const { locale } = useLocale()

	return (
		<>
			{new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
				style: 'currency',
				currency: currency,
			}).format(amount)}
		</>
	)
}

export default LocalizedCurrency
