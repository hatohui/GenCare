import React from 'react'
import { Result } from '@/Interfaces/Tests/Types/Tests'
import { useLocale } from '@/Hooks/useLocale'

const DashboardStats = ({ orders }: { orders: Result[] }) => {
	const { t } = useLocale()
	const total = orders.length
	const completed = orders.filter((o: Result) => o.status).length
	const pending = orders.filter((o: Result) => !o.status).length

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
			<div className='bg-blue-50 rounded-xl p-6 text-center shadow'>
				<div className='text-3xl font-bold text-blue-600'>{pending}</div>
				<div className='text-gray-700 mt-2'>{t('lab.dashboard.pending')}</div>
			</div>
			<div className='bg-green-50 rounded-xl p-6 text-center shadow'>
				<div className='text-3xl font-bold text-green-600'>{completed}</div>
				<div className='text-gray-700 mt-2'>{t('lab.dashboard.completed')}</div>
			</div>
			<div className='bg-gray-50 rounded-xl p-6 text-center shadow'>
				<div className='text-3xl font-bold text-gray-800'>{total}</div>
				<div className='text-gray-700 mt-2'>{t('lab.dashboard.total')}</div>
			</div>
		</div>
	)
}

export default DashboardStats
