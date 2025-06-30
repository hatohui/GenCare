import React from 'react'

interface TestOrder {
	orderDetailId: string
	patientName: string
	testType: string
	orderDate: string
	sampleDate: string | null
	resultDate: string | null
	status: 'pending' | 'completed'
}

const DashboardStats = ({ orders }: { orders: TestOrder[] }) => {
	const total = orders.length
	const completed = orders.filter(
		(o: TestOrder) => o.status === 'completed'
	).length
	const pending = orders.filter((o: TestOrder) => o.status === 'pending').length

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
			<div className='bg-blue-50 rounded-xl p-6 text-center shadow'>
				<div className='text-3xl font-bold text-blue-600'>{pending}</div>
				<div className='text-gray-700 mt-2'>Đang chờ xử lý</div>
			</div>
			<div className='bg-green-50 rounded-xl p-6 text-center shadow'>
				<div className='text-3xl font-bold text-green-600'>{completed}</div>
				<div className='text-gray-700 mt-2'>Đã hoàn thành</div>
			</div>
			<div className='bg-gray-50 rounded-xl p-6 text-center shadow'>
				<div className='text-3xl font-bold text-gray-800'>{total}</div>
				<div className='text-gray-700 mt-2'>Tổng số xét nghiệm</div>
			</div>
		</div>
	)
}

export default DashboardStats
