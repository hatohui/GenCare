import React from 'react'
import clsx from 'clsx'
import { GetSlotResponse } from '@/Interfaces/Slot/Schema/slot'
import { format } from 'date-fns'

const SlotList = ({
	data,
	handleDelete,
	handleRestore,
}: {
	data: GetSlotResponse
	handleDelete: (id: string) => void
	handleRestore: (id: string) => void
}) => {
	const formatTime = (timeString: string | undefined) => {
		if (!timeString) return 'N/A'
		try {
			return format(new Date(timeString), 'HH:mm dd/MM/yyyy')
		} catch (error) {
			console.log(error)
			return 'Invalid date'
		}
	}

	return (
		<div className='flex-1 overflow-x-auto px-1'>
			<table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-sm'>
				<thead className='bg-gray-50 border-b border-gray-200'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Số slot
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Thời gian bắt đầu
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Thời gian kết thúc
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Trạng thái
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Tác vụ
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{!data?.slots || data.slots.length === 0 ? (
						<tr>
							<td colSpan={5} className='px-6 py-12 text-center text-gray-500'>
								Không có dữ liệu
							</td>
						</tr>
					) : (
						data.slots.map(slot => (
							<tr
								key={slot.id}
								className='hover:bg-gray-50 transition-colors duration-150'
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									Slot {slot.no}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{formatTime(slot.startAt)}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
									{formatTime(slot.endAt)}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={clsx(
											'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
											slot.isDeleted
												? 'bg-red-100 text-red-800'
												: 'bg-green-100 text-green-800'
										)}
									>
										{slot.isDeleted ? 'Ngừng hoạt động' : 'Đang hoạt động'}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
									<div className='flex space-x-2'>
										{slot.isDeleted ? (
											<button
												onClick={() => handleRestore(slot.id)}
												className='text-green-600 hover:text-green-900 px-3 py-1 rounded border border-green-600 hover:bg-green-50 transition-colors duration-150'
											>
												Khôi phục
											</button>
										) : (
											<button
												onClick={() => handleDelete(slot.id)}
												className='text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors duration-150'
											>
												Xóa
											</button>
										)}
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	)
}

export default SlotList
