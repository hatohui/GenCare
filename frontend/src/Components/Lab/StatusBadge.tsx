import React from 'react'

const StatusBadge = ({ status }: { status: 'pending' | 'completed' }) => {
	if (status === 'completed') {
		return (
			<span className='inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs'>
				Hoàn thành
			</span>
		)
	}
	return (
		<span className='inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs'>
			Đang chờ
		</span>
	)
}

export default StatusBadge
