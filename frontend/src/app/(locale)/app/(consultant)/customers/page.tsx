'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useLocale } from '@/Hooks/useLocale'

const customers = [
	{
		id: 1,
		name: 'Alex Johnson',
		email: 'alex.johnson@example.com',
		status: 'Active',
	},
	{
		id: 2,
		name: 'Maria Gomez',
		email: 'maria.gomez@example.com',
		status: 'Inactive',
	},
	{
		id: 3,
		name: 'David Lee',
		email: 'david.lee@example.com',
		status: 'Pending',
	},
	{
		id: 4,
		name: 'Tina Chen',
		email: 'tina.chen@example.com',
		status: 'Active',
	},
]

const Customers = () => {
	const router = useRouter()
	const { t } = useLocale()

	return (
		<main className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>{t('customer.list')}</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white shadow rounded-lg'>
					<thead className='bg-gray-100 text-gray-600 uppercase text-sm leading-normal'>
						<tr>
							<th className='py-3 px-6 text-left'>{t('customer.name')}</th>
							<th className='py-3 px-6 text-left'>{t('customer.email')}</th>
							<th className='py-3 px-6 text-center'>{t('customer.status')}</th>
							<th className='py-3 px-6 text-center'>{t('customer.actions')}</th>
						</tr>
					</thead>
					<tbody className='text-gray-700 text-sm divide-y divide-gray-200'>
						{customers.map(customer => (
							<tr key={customer.id}>
								<td className='py-3 px-6'>{customer.name}</td>
								<td className='py-3 px-6'>{customer.email}</td>
								<td className='py-3 px-6 text-center'>
									<span
										className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
								</td>
								<td className='py-3 px-6 text-center'>
									<button
										className='text-blue-600 hover:underline text-sm'
										onClick={() => router.push('/app/customers/:id')}
									>
										{t('customer.view')}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	)
}

export default Customers
