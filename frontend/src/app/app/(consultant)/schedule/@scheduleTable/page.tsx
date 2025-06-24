'use client'

import React from 'react'
import clsx from 'clsx'

const TIME_SLOTS = [
	'07:00 - 08:00',
	'08:00 - 09:00',
	'09:00 - 10:00',
	'10:00 - 11:00',
	'13:00 - 14:00',
	'14:00 - 15:00',
	'15:00 - 16:00',
	'16:00 - 17:00',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const ScheduleTable = () => {
	return (
		<div className='w-full overflow-auto text-sm'>
			<div className='grid grid-cols-8 min-w-[900px] border border-gray-300'>
				{/* Header Row */}
				<div className='bg-gray-100 border-b border-r p-2 text-center font-semibold sticky top-0 z-10'>
					Time
				</div>
				{DAYS.map(day => (
					<div
						key={day}
						className='bg-gray-100 border-b border-r p-2 text-center font-semibold sticky top-0 z-10'
					>
						{day}
					</div>
				))}

				{/* Time slots */}
				{TIME_SLOTS.map(time => (
					<React.Fragment key={time}>
						{/* Slot Label */}
						<div className='border-t border-r p-2 text-center text-gray-600 whitespace-nowrap font-medium bg-gray-50'>
							{time}
						</div>

						{/* Day Columns */}
						{DAYS.map(day => (
							<div
								key={`${day}-${time}`}
								className={clsx(
									'border-t border-r h-16 hover:bg-blue-50 cursor-pointer transition-colors'
								)}
							/>
						))}
					</React.Fragment>
				))}
			</div>
		</div>
	)
}

export default ScheduleTable
