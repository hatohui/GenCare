'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

const Loading = () => {
	const { t } = useLocale()
	return <div>{t('common.loading')}</div>
}

export default Loading
