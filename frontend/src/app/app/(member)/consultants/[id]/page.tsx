'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAccountStore } from '@/Hooks/useAccount'
import Button from '@/Components/Button'
import clsx from 'clsx'
import React from 'react'
import Calendar from '@/Components/Scheduling/Calendar/Calendar'
import { useConsultantContext } from '@/Components/Consultant/ConsultantContext'
import Image from 'next/image'
import { useCreateAppointment } from '@/Services/appointment-service'
import { convertToISOString, formatDateForDisplay } from '@/Utils/dateTime'
import { toast } from 'react-hot-toast'

const timeSlots = [
	'08:00 AM',
	'09:30 AM',
	'11:00 AM',
	'01:30 PM',
	'03:00 PM',
	'04:30 PM',
]

const BookConsultantPage = () => {
	const { data: userData, isLoading: isUserLoading } = useAccountStore()
	const router = useRouter()
	const params = useParams()
	const consultantId = params?.id as string
	const { consultants } = useConsultantContext()
	const consultantFromContext = consultants.find(c => c.id === consultantId)
	const createAppointmentMutation = useCreateAppointment()

	const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
	const [notes, setNotes] = React.useState('')

	// Loading states
	const isLoading = isUserLoading || createAppointmentMutation.isPending

	if (isUserLoading || (isUserLoading && !consultantFromContext)) {
		return <div className='h-full w-full center-all'>Loading....</div>
	}

	if (!consultantFromContext) {
		return (
			<div className='h-full w-full center-all text-red-500'>
				Consultant not found.
			</div>
		)
	}

	if (!userData) {
		return (
			<div className='h-full w-full center-all text-red-500'>
				User not authenticated.
			</div>
		)
	}

	const fullName =
		`${consultantFromContext.firstName ?? ''} ${
			consultantFromContext.lastName ?? ''
		}`.trim() || 'N/A'
	const initials =
		fullName !== 'N/A'
			? fullName
					.split(' ')
					.map(n => n[0])
					.join('')
					.toUpperCase()
			: 'N/A'

	const handleSubmit = async () => {
		// Validation
		if (!selectedDate || !selectedTime) {
			toast.error('Vui lòng chọn ngày và giờ hẹn.')
			return
		}

		if (!userData) {
			toast.error('Thông tin người dùng không hợp lệ.')
			return
		}

		try {
			// Convert date and time to ISO string
			const scheduleAt = convertToISOString(selectedDate, selectedTime)

			// Prepare request data
			const appointmentData = {
				memberId: userData.id,
				staffId: consultantFromContext.id,
				scheduleAt: scheduleAt,
			}

			// Create appointment
			await createAppointmentMutation.mutateAsync(appointmentData)

			// Show success message
			toast.success('Đặt lịch hẹn thành công!')
		} catch (error) {
			// Error handling is done in the mutation
			console.error('Appointment creation failed:', error)
		}
	}

	const isFormValid = selectedDate && selectedTime

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto p-6 overflow-auto'>
			{/* Booking Form */}
			<div className='bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-2'>
				<button
					onClick={() => router.back()}
					className='text-sm text-blue-600 hover:underline'
					disabled={isLoading}
				>
					← Back
				</button>

				<h2 className='text-xl font-bold text-blue-900'>
					Book with {fullName}
				</h2>

				{/* Selected Date Display */}
				{selectedDate && (
					<div className='bg-blue-50 p-3 rounded-lg'>
						<p className='text-sm text-blue-700'>
							📅 Selected: {formatDateForDisplay(selectedDate)}
						</p>
					</div>
				)}

				{/* Calendar Range */}
				<div className='center-all'>
					<Calendar
						className='bg-none shadow-none'
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
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
								disabled={isLoading}
								className={clsx(
									'py-2 px-3 text-sm rounded-lg border text-center transition-colors',
									selectedTime === slot
										? 'bg-blue-500 text-white border-blue-600'
										: 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50',
									isLoading && 'opacity-50 cursor-not-allowed'
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
						disabled={isLoading}
						className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
						placeholder='E.g. symptoms, language preference, etc.'
					/>
				</div>

				{/* Submit */}
				<div className='text-right'>
					<Button
						label={isLoading ? 'Đang xử lý...' : 'Confirm Booking'}
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
					/>
				</div>

				{/* Error Display */}
				{createAppointmentMutation.isError && (
					<div className='bg-red-50 border border-red-200 rounded-lg p-3'>
						<p className='text-sm text-red-600'>
							{createAppointmentMutation.error instanceof Error
								? createAppointmentMutation.error.message
								: 'Có lỗi xảy ra khi đặt lịch hẹn.'}
						</p>
					</div>
				)}
			</div>

			{/* Consultant Info Card */}
			<div className='bg-blue-50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center'>
				{consultantFromContext.avatarUrl ? (
					<Image
						src={consultantFromContext.avatarUrl}
						alt={fullName}
						width={112}
						height={112}
						className='w-28 h-28 rounded-full object-cover border-4 border-white shadow mb-4'
					/>
				) : (
					<div className='w-28 h-28 rounded-full bg-blue-200 border-4 border-white shadow mb-4 flex items-center justify-center text-blue-600 font-bold text-3xl'>
						{initials}
					</div>
				)}
				<h3 className='text-lg font-semibold text-blue-900'>{fullName}</h3>
				<p className='text-sm text-white bg-gradient-to-l from-main to-secondary px-3 py-1 rounded-full mt-1'>
					{'department' in consultantFromContext
						? consultantFromContext.department
						: (consultantFromContext as any).departmentName ?? ''}
				</p>
				<p className='text-sm text-gray-600 mt-4'>
					{consultantFromContext.biography}
				</p>
				<p className='text-sm text-yellow-600 mt-3 font-medium'>
					⭐ {consultantFromContext.yearOfExperience}+ years
				</p>
			</div>
		</div>
	)
}

export default BookConsultantPage
