import React from 'react'
import StatusBadge from './StatusBadge'
import { useRouter } from 'next/navigation'
import { Result } from '@/Interfaces/Tests/Types/Tests'

const TestOrderTable = ({ orders }: { orders: Result[] }) => {
	const router = useRouter()
	return (
		<div className='overflow-x-auto bg-white rounded-xl shadow p-4'>
			<table className='min-w-full text-sm'>
				<thead>
					<tr className='text-left border-b'>
						<th className='py-2 px-3'>Mã đơn</th>
						<th className='py-2 px-3'>Ngày đặt</th>
						<th className='py-2 px-3'>Ngày lấy mẫu</th>
						<th className='py-2 px-3'>Ngày trả kết quả</th>
						<th className='py-2 px-3'>Trạng thái</th>
						<th className='py-2 px-3'>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{orders.length === 0 && (
						<tr>
							<td colSpan={6} className='text-center py-6 text-gray-400'>
								Không có dữ liệu
							</td>
						</tr>
					)}
					{orders.map((order: Result) => (
						<tr key={order.orderDetailId} className='border-b hover:bg-gray-50'>
							<td className='py-2 px-3 font-mono'>{order.orderDetailId}</td>
							<td className='py-2 px-3'>
								{order.orderDate.toLocaleDateString('vi-VN')}
							</td>
							<td className='py-2 px-3'>
								{order.sampleDate
									? order.sampleDate.toLocaleDateString('vi-VN')
									: '-'}
							</td>
							<td className='py-2 px-3'>
								{order.resultDate
									? order.resultDate.toLocaleDateString('vi-VN')
									: '-'}
							</td>
							<td className='py-2 px-3'>
								<StatusBadge status={order.status ? 'completed' : 'pending'} />
							</td>
							<td className='py-2 px-3'>
								<button
									className='text-main underline hover:text-accent transition'
									onClick={() =>
										router.push(
											`/dashboard/(staff)/tests/${order.orderDetailId}`
										)
									}
								>
									Xem chi tiết
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default TestOrderTable
