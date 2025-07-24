'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

const customer = {
	id: 1,
	name: 'Alex Johnson',
	email: 'alex.johnson@example.com',
	phone: '+1 555-123-4567',
	status: 'Active',
	address: '123 Main St, San Francisco, CA',
	joinedAt: '2024-11-02',
	notes: 'Prefers email communication. High-value client.',
}

const CustomerDetailPage = () => {
	const { t } = useLocale()

	return (
		<main className='p-6 max-w-3xl mx-auto'>
			<h1 className='text-2xl font-bold mb-4'>{t('customer.details')}</h1>

			<div className='bg-white shadow-md rounded-lg p-6 space-y-4 border'>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<p className='text-sm text-gray-500'>{t('customer.full_name')}</p>
						<p className='text-lg font-medium text-gray-800'>{customer.name}</p>
					</div>

					<div>
						<p className='text-sm text-gray-500'>{t('customer.email')}</p>
						<p className='text-lg font-medium text-gray-800'>
							{customer.email}
						</p>
					</div>

					<div>
						<p className='text-sm text-gray-500'>{t('customer.phone')}</p>
						<p className='text-lg font-medium text-gray-800'>
							{customer.phone}
						</p>
					</div>

					<div>
						<p className='text-sm text-gray-500'>{t('customer.status')}</p>
						<span
							className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
								customer.status === 'Active'
									? 'bg-green-100 text-green-600'
									: customer.status === 'Inactive'
									? 'bg-gray-100 text-gray-500'
									: 'bg-yellow-100 text-yellow-600'
							}`}
						>
							{customer.status === 'Active'
								? t('customer.active')
								: customer.status === 'Inactive'
								? t('customer.inactive')
								: t('customer.pending')}
						</span>
					</div>

					<div className='sm:col-span-2'>
						<p className='text-sm text-gray-500'>{t('customer.address')}</p>
						<p className='text-lg font-medium text-gray-800'>
							{customer.address}
						</p>
					</div>

					<div>
						<p className='text-sm text-gray-500'>{t('customer.joined')}</p>
						<p className='text-lg font-medium text-gray-800'>
							{customer.joinedAt}
						</p>
					</div>
				</div>

				<div>
					<p className='text-sm text-gray-500'>{t('customer.notes')}</p>
					<p className='text-gray-700 mt-1'>{customer.notes}</p>
				</div>
			</div>
		</main>
	)
}

export default CustomerDetailPage
