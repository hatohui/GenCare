'use client'

import React from 'react'
import { LocaleProvider } from '@/Hooks/useLocale'

interface LocaleLayoutProps {
	children: React.ReactNode
}

const LocaleLayout = ({ children }: LocaleLayoutProps) => {
	return <LocaleProvider>{children}</LocaleProvider>
}

export default LocaleLayout
