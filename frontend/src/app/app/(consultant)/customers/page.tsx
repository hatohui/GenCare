'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

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

	return (
		<main className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Customer List</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white shadow rounded-lg'>
					<thead className='bg-gray-100 text-gray-600 uppercase text-sm leading-normal'>
						<tr>
							<th className='py-3 px-6 text-left'>Name</th>
							<th className='py-3 px-6 text-left'>Email</th>
							<th className='py-3 px-6 text-center'>Status</th>
							<th className='py-3 px-6 text-center'>Actions</th>
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
										{customer.status}
									</span>
								</td>
								<td className='py-3 px-6 text-center'>
									<button
										className='text-blue-600 hover:underline text-sm'
										onClick={() => router.push('/app/customers/:id')}
									>
										View
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
