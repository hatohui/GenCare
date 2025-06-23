'use client'

import BirthControlForm from '@/Components/app/BirthControl/BirthControlForm'
import Calendar from '@/Components/app/BirthControl/Calender'
import { useAccountStore } from '@/Hooks/useAccount'
import { useGetBirthControl } from '@/Services/birthControl-service'
import React, { useState } from 'react'

const Page = () => {
	const { data } = useAccountStore()
	const { data: birthControlData } = useGetBirthControl(data?.id || '')

	const [month, setMonth] = useState(new Date().getMonth())
	const [year] = useState(new Date().getFullYear())

	console.log(birthControlData)

	return (
		<div className='space-y-6'>
			<div className='bg-general p-7 rounded-[30px]'>
				<BirthControlForm accountID={data?.id || ''} />
			</div>
			<div className='bg-general p-7 rounded-[30px]'>
				{birthControlData && (
					<div className='flex items-center justify-between'>
						<button
							className='bg-main px-4 py-2 rounded-[30px] text-white'
							onClick={() => setMonth(month - 1)}
						>
							Previous
						</button>
						<div>
							{new Date(year, month).toLocaleString('default', {
								month: 'long',
							})}{' '}
							{year}
						</div>
						<button
							className='bg-main px-4 py-2 rounded-[30px] text-white'
							onClick={() => setMonth(month + 1)}
						>
							Next
						</button>
					</div>
				)}
				{birthControlData && (
					<Calendar year={year} month={month} id={data?.id || ''} />
				)}
			</div>
		</div>
	)
}

export default Page
