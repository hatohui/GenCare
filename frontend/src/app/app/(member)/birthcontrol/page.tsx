'use client'

import BirthControlForm from '@/Components/app/BirthControl/BirthControlForm'
import Calendar from '@/Components/app/BirthControl/Calender'
import { useAccountStore } from '@/Hooks/useAccount'
import { useBirthControl } from '@/Hooks/useBirthControl'
import { useGetBirthControl } from '@/Services/birthControl-service'
import React, { useEffect, useState } from 'react'

const Page = () => {
	const { data } = useAccountStore()
	const { data: getBirthControl } = useGetBirthControl(data?.id || '')
	const { birthControl, setBirthControl } = useBirthControl()

	useEffect(() => {
		if (getBirthControl) setBirthControl(getBirthControl)
	}, [getBirthControl, setBirthControl])

	const [month, setMonth] = useState(new Date().getMonth())
	const [year, setYear] = useState(new Date().getFullYear())
	const [showCalendar, setShowCalendar] = useState(false)

	return (
		<div className='space-y-6'>
			<div className='lg:flex items-center justify-between gap-4'>
				<div className='rounded-[30px]  lg:w-1/3 h-full '>
					<BirthControlForm accountID={data?.id || ''} />
				</div>
				<div className='bg-general p-7 rounded-[30px] w-full lg:w-2/3'>
					<div className='flex items-center justify-between'>
						<div className='pb-2 flex justify-between items-center w-full '>
							<div className='mr-4 text-3xl w-full '>
								{new Date(year, month).toLocaleString('default', {
									month: 'long',
								})}{' '}
								{year}
							</div>
							<div className='flex'>
								<button
									className='bg-main px-4 py-2 rounded-[30px] text-white'
									onClick={() => {
										if (month === 0) {
											setMonth(11)
											setYear(year - 1)
										} else {
											setMonth(month - 1)
										}
									}}
								>
									Previous
								</button>
								<button
									className='bg-main px-4 py-2 rounded-[30px] text-white ml-4'
									onClick={() => {
										if (month === 11) {
											setMonth(0)
											setYear(year + 1)
										} else {
											setMonth(month + 1)
										}
									}}
								>
									{' '}
									Next
								</button>
							</div>
						</div>
					</div>

					<Calendar year={year} month={month} cycle={birthControl} />
				</div>
			</div>
			<div className='bg-general p-7 rounded-[30px]'>
				<h2 className='text-lg font-bold mb-4'>
					Thông Tin Kế Hoạch Tránh Thai
				</h2>
				<p className='text-sm text-gray-700'>
					Tại đây, bạn có thể xem thông tin chi tiết về lịch trình tránh thai
					của mình, các ngày quan trọng và các dữ liệu liên quan khác. Hãy sử
					dụng lịch phía trên để chuyển đổi giữa các tháng và theo dõi kế hoạch
					tránh thai cá nhân của bạn.
				</p>
			</div>
		</div>
	)
}

export default Page
