'use client'

import { useRouter } from 'next/navigation'
import { useAccountStore } from '@/Hooks/useAccount'
import Button from '@/Components/Button'
import clsx from 'clsx'
import React from 'react'
import RangeCalendar from '@/Components/Scheduling/Calendar/RangeCalendar'
import Calendar from '@/Components/Scheduling/Calendar/Calendar'

const timeSlots = [
	'08:00 AM',
	'09:30 AM',
	'11:00 AM',
	'01:30 PM',
	'03:00 PM',
	'04:30 PM',
]

const BookConsultantPage = () => {
	const { data, isLoading } = useAccountStore()
	const router = useRouter()

	const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
	const [notes, setNotes] = React.useState('')

	if (isLoading || !data)
		return <div className='h-full w-full center-all'>Loading....</div>

	const consultantFake = {
		accountId: '1',
		name: 'Dr. Nguyen Van A',
		specialization: 'General Practitioner',
		rating: 4.8,
		biography: '10+ years of experience providing comprehensive primary care.',
	}

	const handleSubmit = () => {
		if (!selectedDate || !selectedTime) {
			alert('Please select a date and time.')
			return
		}

		console.log({
			bookedBy: data.id,
			role: data.role.name,
			consultantId: consultantFake.accountId,
			date: selectedDate.toISOString(),
			time: selectedTime,
			notes,
		})

		router.push('/app/appointments/confirmation')
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto p-6'>
			{/* Booking Form */}
			<div className='bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-6'>
				<button
					onClick={() => router.back()}
					className='text-sm text-blue-600 hover:underline'
				>
					← Back
				</button>

				<h2 className='text-xl font-bold text-blue-900'>
					Book with {consultantFake.name}
				</h2>

				{/* Calendar Range */}
				<div>
					<label className='text-sm font-medium text-gray-700 mb-1 block'>
						Choose Date
					</label>
					<div className='center-all'>
						<Calendar
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					</div>
				</div>

				{/* Time Slot */}
				<div>
					<label className='text-sm font-medium text-gray-700 mb-1 block'>
						Choose Time
					</label>
					<div className='grid grid-cols-3 gap-3'>
						{timeSlots.map(slot => (
							<button
								key={slot}
								onClick={() => setSelectedTime(slot)}
								className={clsx(
									'py-2 px-3 text-sm rounded-lg border text-center',
									selectedTime === slot
										? 'bg-blue-500 text-white border-blue-600'
										: 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-400'
								)}
							>
								{slot}
							</button>
						))}
					</div>
				</div>

				{/* Notes */}
				<div>
					<label className='text-sm font-medium text-gray-700 mb-1 block'>
						Notes (optional)
					</label>
					<textarea
						value={notes}
						onChange={e => setNotes(e.target.value)}
						rows={3}
						className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm'
						placeholder='E.g. symptoms, language preference, etc.'
					/>
				</div>

				{/* Submit */}
				<div className='text-right'>
					<Button label='Confirm Booking' onClick={handleSubmit} />
				</div>
			</div>

			{/* Consultant Info Card */}
			<div className='bg-blue-50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center'>
				<img
					src={`https://randomuser.me/api/portraits/med/${
						+consultantFake.accountId % 2 === 0 ? 'women' : 'men'
					}/${consultantFake.accountId}.jpg`}
					alt='consultant'
					className='w-28 h-28 rounded-full object-cover border-4 border-white shadow mb-4'
				/>
				<h3 className='text-lg font-semibold text-blue-900'>
					{consultantFake.name}
				</h3>
				<p className='text-sm text-white bg-gradient-to-l from-main to-secondary px-3 py-1 rounded-full mt-1'>
					{consultantFake.specialization}
				</p>
				<p className='text-sm text-gray-600 mt-4'>{consultantFake.biography}</p>
				<p className='text-sm text-yellow-600 mt-3 font-medium'>
					⭐ {consultantFake.rating.toFixed(1)} / 5.0
				</p>
			</div>
		</div>
	)
}

export default BookConsultantPage
