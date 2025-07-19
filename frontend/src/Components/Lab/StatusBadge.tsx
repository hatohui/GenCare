import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

const StatusBadge = ({ status }: { status: 'pending' | 'completed' }) => {
	const { t } = useLocale()

	if (status === 'completed') {
		return (
			<span className='inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs'>
				{t('common.status.completed')}
			</span>
		)
	}
	return (
		<span className='inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs'>
			{t('common.status.pending')}
		</span>
	)
}

export default StatusBadge
