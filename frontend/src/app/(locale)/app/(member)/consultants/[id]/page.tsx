'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAccountStore } from '@/Hooks/useAccount'
import Button from '@/Components/Button'
import clsx from 'clsx'
import React from 'react'
import Calendar from '@/Components/Scheduling/Calendar/Calendar'
import { useConsultantStore } from '@/Components/Consultant/ConsultantContext'
import { useCreateAppointmentWithZoom } from '@/Services/appointment-service'
import { useSchedulesByConsultant } from '@/Services/schedule-services'
import { useConsultantById } from '@/Services/consultant-service'
import { convertToISOString, formatDateForDisplay } from '@/Utils/dateTime'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'motion/react'
import { CldImage } from 'next-cloudinary'
import { useLocale } from '@/Hooks/useLocale'
import { isToday, isSameDay } from 'date-fns'
import {
	WORKING_SLOTS,
	getSlotWeekRange,
} from '@/Utils/SlotHelpers/slotTimeHelpers'
import { Star } from 'lucide-react'

const BookConsultantPage = () => {
	const { t } = useLocale()
	const { data: userData, isLoading: isUserLoading } = useAccountStore()
	const router = useRouter()
	const params = useParams()
	const consultantId = params?.id as string

	// Fetch consultant data from API
	const {
		data: consultant,
		isLoading: isConsultantLoading,
		error: consultantError,
	} = useConsultantById(consultantId)

	// Keep context as fallback for now
	const consultants = useConsultantStore(state => state.consultants)
	const consultantFromContext = consultants.find(c => c.id === consultantId)

	// Use API data first, fallback to context data
	const consultantData = consultant || consultantFromContext

	const createAppointmentMutation = useCreateAppointmentWithZoom()

	const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
	const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
	const [notes, setNotes] = React.useState('')

	// Get consultant's schedule for the selected date
	const selectedWeekRange = selectedDate ? getSlotWeekRange(selectedDate) : null
	const scheduleQuery = useSchedulesByConsultant(
		consultantId,
		selectedWeekRange?.startOfWeek.toISOString() || '',
		selectedWeekRange?.endOfWeek.toISOString() || ''
	)

	// Loading states
	const isLoading =
		isUserLoading || isConsultantLoading || createAppointmentMutation.isPending

	// For disabling past time slots
	const now = new Date()
	const isSelectedToday = selectedDate && isToday(selectedDate)

	// Get available time slots for the selected date
	const availableTimeSlots = React.useMemo(() => {
		if (!selectedDate || !scheduleQuery.data?.slots) {
			return []
		}

		// Find slots assigned to this consultant for the selected date
		const assignedSlots = scheduleQuery.data.slots.filter(slot => {
			const slotDate = new Date(slot.startAt)
			return isSameDay(slotDate, selectedDate)
		})

		// Convert to time slot format
		return assignedSlots
			.map(slot => {
				const workingSlot = WORKING_SLOTS.find(ws => ws.no === slot.no)
				return workingSlot ? workingSlot.startTime : null
			})
			.filter(Boolean) as string[]
	}, [selectedDate, scheduleQuery.data])

	// Reset selected time when date changes or available slots change
	React.useEffect(() => {
		if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
			setSelectedTime(null)
		}
	}, [availableTimeSlots, selectedTime])

	if (isUserLoading || isConsultantLoading) {
		return <div className='h-full w-full center-all'>{t('common.loading')}</div>
	}

	if (consultantError || !consultantData) {
		return (
			<div className='h-full w-full center-all text-red-500'>
				{t('consultant.not_found')}
			</div>
		)
	}

	if (!userData) {
		return (
			<div className='h-full w-full center-all text-red-500'>
				{t('auth.user_not_authenticated')}
			</div>
		)
	}

	const fullName =
		`${consultantData.firstName ?? ''} ${
			consultantData.lastName ?? ''
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
			toast.error(t('appointment.booking.selectDateTime'))
			return
		}

		if (!userData) {
			toast.error(t('appointment.booking.invalidUser'))
			return
		}

		if (!consultantData) {
			toast.error(t('appointment.booking.invalidConsultant'))
			return
		}

		try {
			const scheduleAt = convertToISOString(selectedDate, selectedTime)

			const result = await createAppointmentMutation.mutateAsync({
				memberId: userData.id,
				staffId: consultantData.id,
				scheduleAt,
			})

			toast.success(
				<>
					{t('appointment.booking.success')}
					<br />
					<a
						href={result.zoomMeeting.joinUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='underline text-blue-600'
					>
						{t('appointment.booking.joinZoom')}
					</a>
				</>
			)
			router.push('/app/appointments')
		} catch (error: any) {
			toast.error(error.message || t('appointment.booking.failed'))
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
						← {t('common.back')}
					</motion.button>

					<motion.h2
						className='text-xl font-bold text-blue-900'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						{t('appointment.booking.bookWith')} {fullName}
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
									📅 {t('appointment.booking.selected')}:{' '}
									{formatDateForDisplay(selectedDate)}
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
							disablePastDates={true}
						/>
					</motion.div>

					{/* Time Slot */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						<label className='text-sm font-medium text-gray-700 mb-1 block'>
							{t('appointment.booking.chooseTime')}
						</label>

						{!selectedDate ? (
							<div className='text-sm text-gray-500 py-4 text-center'>
								{t('appointment.booking.selectDateFirst')}
							</div>
						) : availableTimeSlots.length === 0 ? (
							<div className='text-sm text-gray-500 py-4 text-center'>
								{scheduleQuery.isLoading
									? t('common.loading')
									: t('appointment.booking.noAvailableSlots')}
							</div>
						) : (
							<div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
								{availableTimeSlots.map((slot, idx) => {
									let slotDisabled = isLoading
									if (isSelectedToday) {
										const [h, m] = slot.split(':').map(Number)
										const slotDate = new Date(selectedDate as Date)
										slotDate.setHours(h, m, 0, 0)
										if (slotDate < now) slotDisabled = true
									}
									return (
										<motion.button
											key={slot}
											onClick={() => setSelectedTime(slot)}
											disabled={slotDisabled}
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
												slotDisabled &&
													'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
											)}
										>
											{slot}
										</motion.button>
									)
								})}
							</div>
						)}
					</motion.div>

					{/* Notes */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
					>
						<label className='text-sm font-medium text-gray-700 mb-1 block'>
							{t('appointment.booking.notes')}
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
							placeholder={t('appointment.booking.notesPlaceholder')}
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
						<div className='hover:scale-105 transition duration-400'>
							{consultantData.avatarUrl ? (
								<CldImage
									src={consultantData.avatarUrl}
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
						</div>

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
							{('department' in consultantData && consultantData.department) ||
								('departmentName' in consultantData &&
									(consultantData as any).departmentName) ||
								'Department not specified'}
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
							{consultantData.biography}
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
								<Star />
							</motion.span>
							{'yearOfExperience' in consultantData
								? consultantData.yearOfExperience
								: 0}
							+ years
						</motion.p>
					</div>
				</motion.div>
			</motion.div>
		</div>
	)
}

export default BookConsultantPage
