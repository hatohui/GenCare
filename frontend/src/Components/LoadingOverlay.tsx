'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

interface LoadingOverlayProps {
	isVisible: boolean
	message?: string
	className?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
	isVisible,
	message,
	className = '',
}) => {
	const { t } = useLocale()
	const displayMessage = message || t('common.loading_data')

	if (!isVisible) return null

	return (
		<div
			className={`absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 ${className}`}
		>
			<div className='text-center'>
				<div className='animate-pulse text-lg font-medium text-slate-700 drop-shadow-lg'>
					{displayMessage}
				</div>
			</div>
		</div>
	)
}

interface ErrorOverlayProps {
	isVisible: boolean
	message?: string
	className?: string
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
	isVisible,
	message = 'Internal Server Error.',
	className = '',
}) => {
	if (!isVisible) return null

	return (
		<div
			className={`absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 ${className}`}
		>
			<div className='text-center text-red-500 font-medium bg-white/90 px-6 py-3 rounded-lg shadow-lg border border-red-200'>
				{message}
			</div>
		</div>
	)
}

export { LoadingOverlay, ErrorOverlay }
export default LoadingOverlay
