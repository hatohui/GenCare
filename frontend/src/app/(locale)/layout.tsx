'use client'

import React from 'react'
import { LocaleProvider } from '@/Hooks/useLocale'
import AIChatPopup from '@/Components/Chat/AIChatPopup'

interface LocaleLayoutProps {
	children: React.ReactNode
}

const LocaleLayout = ({ children }: LocaleLayoutProps) => {
	return (
		<>
			<LocaleProvider>
				{children}
				<AIChatPopup />
			</LocaleProvider>
		</>
	)
}

export default LocaleLayout
