'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAccountStore } from '@/Hooks/useAccount'
import Button from '@/Components/Button'
import clsx from 'clsx'
import React from 'react'
import Calendar from '@/Components/Scheduling/Calendar/Calendar'
import { useConsultantContext } from '@/Components/Consultant/ConsultantContext'
import Image from 'next/image'
import { useCreateAppointmentWithZoom } from '@/Services/appointment-service'
import { convertToISOString, formatDateForDisplay } from '@/Utils/dateTime'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'

const timeSlots = [
	'08:00',
	'10:00',
	'12:00',
	'14:00',
	'16:00',
	'18:00',
	'20:00',
]

const BookConsultantPage = () => {
	const { data: userData, isLoading: isUserLoading } = useAccountStore()
	const router = useRouter()
	const params = useParams()
	const consultantId = params?.id as string
	const { consultants } = useConsultantContext()
	const consultantFromContext = consultants.find(c => c.id === consultantId)
	const createAppointmentMutation = useCreateAppointmentWithZoom()

	const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
	const [notes, setNotes] = React.useState('')
	const [joinUrl, setJoinUrl] = React.useState<string | null>(null)

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

		if (!consultantFromContext) {
			toast.error('Thông tin tư vấn viên không hợp lệ.')
			return
		}

		try {
			const scheduleAt = convertToISOString(selectedDate, selectedTime)

			// Create appointment with Zoom integration
			const result = await createAppointmentMutation.mutateAsync({
				memberId: userData.id,
				staffId: consultantFromContext.id,
				scheduleAt,
			})

			// Show success message with Zoom link
			toast.success(
				<>
					Đặt lịch hẹn thành công!
					<br />
					<a
						href={result.zoomMeeting.joinUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='underline text-blue-600'
					>
						Join Zoom Meeting
					</a>
				</>
			)

			// Store the join URL
			setJoinUrl(result.zoomMeeting.joinUrl)

			// Chuyển hướng về trang lịch hẹn mới
			router.push('/app/appointments')

			// Optionally redirect to a success page or dashboard
			// router.push('/appointments')
		} catch (error: any) {
			toast.error(error.message || 'Appointment creation failed.')
			console.error(error)
		}
	}

	const isFormValid = selectedDate && selectedTime

	return (
		<div className='relative min-h-screen overflow-hidden'>
			<motion.div
				className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto p-4 sm:p-6 overflow-auto relative z-20'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.6,
					type: 'spring',
					stiffness: 100,
					damping: 15,
				}}
			>
				{/* Booking Form */}
				<motion.div
					className='bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-2'
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						duration: 0.6,
						delay: 0.2,
						type: 'spring',
						stiffness: 100,
					}}
				>
					<motion.button
						onClick={() => router.back()}
						className='text-sm text-blue-600 hover:underline'
						disabled={isLoading}
						whileHover={{ x: -5, scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						← Back
					</motion.button>

					<motion.h2
						className='text-xl font-bold text-blue-900'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						Book with {fullName}
					</motion.h2>

					{/* Selected Date Display */}
					<AnimatePresence mode='wait'>
						{selectedDate && (
							<motion.div
								className='bg-blue-50 p-3 rounded-lg'
								initial={{ opacity: 0, scale: 0.8, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.8, y: -20 }}
								transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
							>
								<p className='text-sm text-blue-700'>
									📅 Selected: {formatDateForDisplay(selectedDate)}
								</p>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Calendar Range */}
					<motion.div
						className='center-all'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Calendar
							className='bg-none shadow-none'
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					</motion.div>

					{/* Time Slot */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						<label className='text-sm font-medium text-gray-700 mb-1 block'>
							Choose Time
						</label>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
							{timeSlots.map((slot, idx) => (
								<motion.button
									key={slot}
									onClick={() => setSelectedTime(slot)}
									disabled={isLoading}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
									whileHover={{
										scale: 1.05,
										boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
										transition: { duration: 0.2 },
									}}
									whileTap={{ scale: 0.95 }}
									className={clsx(
										'py-2 px-3 text-sm rounded-lg border text-center transition-colors',
										selectedTime === slot
											? 'bg-blue-500 text-white border-blue-600'
											: 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50',
										isLoading && 'opacity-50 cursor-not-allowed'
									)}
								>
									{slot}
								</motion.button>
							))}
						</div>
					</motion.div>

					{/* Notes */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
					>
						<label className='text-sm font-medium text-gray-700 mb-1 block'>
							Notes (optional)
						</label>
						<motion.textarea
							value={notes}
							onChange={e => setNotes(e.target.value)}
							rows={3}
							disabled={isLoading}
							whileFocus={{
								scale: 1.02,
								boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
								transition: { duration: 0.2 },
							}}
							className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
							placeholder='E.g. symptoms, language preference, etc.'
						/>
					</motion.div>

					{/* Submit */}
					<motion.div
						className='text-right'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.8 }}
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							<Button
								label={isLoading ? 'Đang xử lý...' : 'Confirm Booking'}
								onClick={handleSubmit}
								disabled={!isFormValid || isLoading}
							/>
						</motion.div>
					</motion.div>

					{/* Error Display */}
					<AnimatePresence mode='wait'>
						{createAppointmentMutation.isError && (
							<motion.div
								className='bg-red-50 border border-red-200 rounded-lg p-3'
								initial={{ opacity: 0, y: 20, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -20, scale: 0.9 }}
								transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
							>
								<p className='text-sm text-red-600'>
									{createAppointmentMutation.error instanceof Error
										? createAppointmentMutation.error.message
										: 'Có lỗi xảy ra khi đặt lịch hẹn.'}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Consultant Info Card */}
				<motion.div
					className='bg-blue-50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden'
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						duration: 0.6,
						delay: 0.3,
						type: 'spring',
						stiffness: 100,
					}}
				>
					<div className='relative z-10'>
						<motion.div
							whileHover={{
								rotate: 360,
								scale: 1.1,
								transition: { duration: 0.6, type: 'spring' },
							}}
						>
							{consultantFromContext.avatarUrl ? (
								<Image
									src={consultantFromContext.avatarUrl}
									alt={fullName}
									width={112}
									height={112}
									className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg mb-4'
								/>
							) : (
								<div className='w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white shadow-lg mb-4 flex items-center justify-center text-white font-bold text-3xl'>
									{initials}
								</div>
							)}
						</motion.div>

						<motion.h3
							className='text-lg font-semibold text-blue-900'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							whileHover={{
								scale: 1.05,
								color: '#1e40af',
								transition: { duration: 0.2 },
							}}
						>
							{fullName}
						</motion.h3>

						<motion.p
							className='text-sm px-3 py-1 rounded-full mt-1 relative'
							style={{
								background: 'linear-gradient(to left, #067dad, #038474)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								color: '#067dad',
							}}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.7 }}
							whileHover={{
								scale: 1.1,
								boxShadow: '0 4px 12px rgba(6, 125, 173, 0.4)',
								transition: { duration: 0.2 },
							}}
						>
							{'department' in consultantFromContext
								? consultantFromContext.department
								: (consultantFromContext as any).departmentName ?? ''}
						</motion.p>

						<motion.p
							className='text-sm text-gray-600 mt-4'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.8 }}
							whileHover={{
								color: '#374151',
								transition: { duration: 0.2 },
							}}
						>
							{consultantFromContext.biography}
						</motion.p>

						<motion.p
							className='text-sm text-yellow-600 mt-3 font-medium flex items-center justify-center gap-1'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.9 }}
							whileHover={{
								scale: 1.1,
								color: '#f59e0b',
								transition: { duration: 0.2 },
							}}
						>
							<motion.span
								animate={{ rotate: [0, 10, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
							>
								⭐
							</motion.span>
							{consultantFromContext.yearOfExperience}+ years
						</motion.p>
					</div>
				</motion.div>
			</motion.div>
		</div>
	)
}

export default BookConsultantPage
