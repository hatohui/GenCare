'use client'

import BirthControlForm from '@/Components/app/BirthControl/BirthControlForm'
import Calendar from '@/Components/app/BirthControl/Calender'
import { useAccountStore } from '@/Hooks/useAccount'
import React, { useState } from 'react'

const Page = () => {
	const { data } = useAccountStore()

	const [month, setMonth] = useState(new Date().getMonth())
	const [year, setYear] = useState(new Date().getFullYear())
	const [showCalendar, setShowCalendar] = useState(false)

	return (
		<div className='space-y-6'>
			<div className='bg-general p-7 rounded-[30px]'>
				<BirthControlForm accountID={data?.id || ''} />
			</div>
			<div className='bg-general p-7 rounded-[30px]'>
				<div className='flex items-center justify-between'>
					<button
						className='bg-main px-4 py-2 rounded-[30px] text-white'
						onClick={() => {
							setShowCalendar(!showCalendar)
						}}
					>
						{showCalendar ? 'Hide' : 'Show'} Calendar
					</button>
					<div className='flex items-center'>
						{showCalendar && (
							<>
								<div className='mr-4'>
									{new Date(year, month).toLocaleString('default', {
										month: 'long',
									})}{' '}
									{year}
								</div>
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
							</>
						)}
					</div>
				</div>

				{showCalendar && (
					<Calendar year={year} month={month} id={data?.id || ''} />
				)}
			</div>
			<div className='bg-general p-7 rounded-[30px]'>
				<h2 className='text-lg font-bold mb-4'>Birth Control Information</h2>
				<p className='text-sm text-gray-700'>
					Here you can find detailed information about your birth control
					schedule, important dates, and other relevant data. Use the calendar
					above to navigate through months and view your personalized birth
					control plan.
				</p>
			</div>
		</div>
	)
}

export default Page
