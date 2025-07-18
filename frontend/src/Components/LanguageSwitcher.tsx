'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'
import clsx from 'clsx'

interface LanguageSwitcherProps {
	className?: string
	onTop?: boolean
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
	className = '',
	onTop,
}) => {
	const { locale, setLocale, t } = useLocale()

	const toggleLanguage = () => {
		setLocale(locale === 'en' ? 'vi' : 'en')
	}

	return (
		<button
			onClick={toggleLanguage}
			className={clsx(
				'p-2 rounded-md transition-colors',
				onTop !== undefined
					? onTop
						? 'hover:bg-white/10 text-white'
						: 'hover:bg-gray-100 text-gray-800'
					: 'hover:bg-gray-100 text-gray-800',
				className
			)}
			aria-label={
				locale === 'en'
					? t('language.switchToVietnamese')
					: t('language.switchToEnglish')
			}
		>
			<span className='font-medium'>
				{locale === 'en'
					? '🇺🇸 ' + t('language.english')
					: '🇻🇳 ' + t('language.vietnamese')}
			</span>
		</button>
	)
}

export default LanguageSwitcher
