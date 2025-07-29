'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAppointments } from '@/Services/appointment-service'
import { AppointmentCell } from './AppointmentCell'
import { CurrentTimeLine } from './CurrentTimeLine'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import { Clock, Briefcase, Moon, BarChart3, TrendingUp } from 'lucide-react'
import {
	getWeekRange,
	getWeekDays,
	generateTimeSlots,
	groupAppointmentsByDateTime,
	filterAppointmentsForWeek,
	formatWeekRange,
	parseUTCToLocal,
} from '@/Utils/Appointment/timeSlotHelpers'
import { useLocale } from '@/Hooks/useLocale'

export const AppointmentsTimetable = () => {
	const { t, locale } = useLocale()
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const { data, isLoading, error, refetch } = useAppointments()
	const [pastTimeSlots, setPastTimeSlots] = useState<Set<string>>(new Set())
	const [highlightedSlot, setHighlightedSlot] = useState<string | null>(null)
	const cellRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({})

	const { startOfWeek, endOfWeek } = getWeekRange(currentWeek)

	// Memoize weekDays to prevent recreation on every render
	const weekDays = useMemo(() => getWeekDays(startOfWeek), [startOfWeek])

	// Filter appointments for current week
	const weekAppointments = useMemo(
		() => (data ? filterAppointmentsForWeek(data, startOfWeek, endOfWeek) : []),
		[data, startOfWeek, endOfWeek]
	)

	// Generate all time slots and group appointments - memoize to prevent recreation
	const timeSlots = useMemo(() => generateTimeSlots(), [])
	const groupedAppointments = useMemo(
		() => groupAppointmentsByDateTime(weekAppointments),
		[weekAppointments]
	)

	// Helper để tạo local date key
	const getLocalDateKey = useCallback((date: Date) => {
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		return `${year}-${month}-${day}`
	}, [])

	// Handle time slot status changes from CurrentTimeLine - optimized to prevent unnecessary updates
	const handleTimeSlotStatusChange = useCallback(
		(day: Date, timeSlot: string, isPast: boolean) => {
			const dateKey = getLocalDateKey(day)
			const slotKey = `${dateKey}-${timeSlot}`

			setPastTimeSlots(prev => {
				// Only update if the status actually changed
				const currentStatus = prev.has(slotKey)
				if (currentStatus === isPast) {
					return prev // No change needed
				}

				const newSet = new Set(prev)
				if (isPast) {
					newSet.add(slotKey)
				} else {
					newSet.delete(slotKey)
				}
				return newSet
			})
		},
		[getLocalDateKey]
	)

	// Check if a specific time slot is past
	const isTimeSlotPast = useCallback(
		(day: Date, timeSlot: string): boolean => {
			const dateKey = getLocalDateKey(day)
			const slotKey = `${dateKey}-${timeSlot}`
			return pastTimeSlots.has(slotKey)
		},
		[pastTimeSlots]
	)

	// Helper function to check if an appointment is in the future (properly handling UTC)
	const isAppointmentInFuture = useCallback(
		(appointment: Appointment): boolean => {
			const now = new Date()
			// Parse UTC time and compare with current local time
			const appointmentDate = parseUTCToLocal(appointment.scheduleAt)
			return appointmentDate > now
		},
		[]
	)

	// Filter to get only future appointments
	const futureAppointments = useMemo(
		() => (data ? data.filter(isAppointmentInFuture) : []),
		[data, isAppointmentInFuture]
	)
	const futureWeekAppointments = useMemo(
		() => weekAppointments.filter(isAppointmentInFuture),
		[weekAppointments, isAppointmentInFuture]
	)

	const goToPreviousWeek = useCallback(() => {
		const prevWeek = new Date(currentWeek)
		prevWeek.setDate(currentWeek.getDate() - 7)
		setCurrentWeek(prevWeek)
	}, [currentWeek])

	const goToNextWeek = useCallback(() => {
		const nextWeek = new Date(currentWeek)
		nextWeek.setDate(currentWeek.getDate() + 7)
		setCurrentWeek(nextWeek)
	}, [currentWeek])

	const goToCurrentWeek = useCallback(() => {
		setCurrentWeek(new Date())
	}, [])

	const goToFirstAppointmentWeek = useCallback(() => {
		if (futureAppointments && futureAppointments.length > 0) {
			// Find the earliest future appointment date (properly handling UTC)
			const earliest = futureAppointments.reduce(
				(min: Appointment, curr: Appointment) => {
					const minDate = parseUTCToLocal(min.scheduleAt)
					const currDate = parseUTCToLocal(curr.scheduleAt)
					return currDate < minDate ? curr : min
				}
			)
			const earliestDate = parseUTCToLocal(earliest.scheduleAt)
			setCurrentWeek(earliestDate)

			// Highlight the slot for a few seconds
			const dateKey = getLocalDateKey(earliestDate)
			const hour = earliestDate.getHours().toString().padStart(2, '0')
			const slotKey = `${dateKey}-${hour}:00`
			setHighlightedSlot(slotKey)
			setTimeout(() => setHighlightedSlot(null), 4000)
		}
	}, [futureAppointments])

	useEffect(() => {
		if (highlightedSlot && cellRefs.current[highlightedSlot]) {
			cellRefs.current[highlightedSlot]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			})
		}
	}, [highlightedSlot])

	if (isLoading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='flex flex-col items-center justify-center min-h-[400px] space-y-4'
			>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
					className='rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600'
				/>
				<motion.span
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-gray-600 text-lg font-medium'
				>
					{t('appointment.loading_appointments')}
				</motion.span>
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
					className='w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full'
				/>
			</motion.div>
		)
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className='flex flex-col items-center justify-center min-h-[400px] space-y-6 p-8'
			>
				<motion.div
					initial={{ y: -20 }}
					animate={{ y: 0 }}
					className='text-red-600 text-center space-y-2'
				>
					<motion.div
						animate={{ rotate: [0, -5, 5, 0] }}
						transition={{ duration: 0.5, repeat: 2 }}
						className='text-6xl mb-4'
					>
						😔
					</motion.div>
					<div className='text-xl font-bold text-gray-800'>
						{t('appointment.error_occurred')}
					</div>
					<div className='text-sm text-gray-600 max-w-md'>{error.message}</div>
				</motion.div>
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => refetch()}
					className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg font-medium flex items-center space-x-2'
				>
					<span>🔄</span>
					<span>{t('appointment.try_again')}</span>
				</motion.button>
			</motion.div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='space-y-4 sm:space-y-6'
		>
			{/* Header with navigation */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-blue-100'
			>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
						📅 {t('appointment.my_appointments')}
					</h1>
					<p className='text-gray-600 mt-1 text-sm sm:text-base'>
						{t('appointment.week')} {formatWeekRange(startOfWeek, endOfWeek)}
					</p>
				</motion.div>

				{/* Navigation Buttons */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className='flex flex-wrap items-center gap-2 sm:gap-3'
				>
					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={goToPreviousWeek}
						className='px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium'
					>
						←{' '}
						<span className='hidden sm:inline'>
							{t('appointment.previous_week')}
						</span>
					</motion.button>

					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={goToCurrentWeek}
						className='px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-200 shadow-md text-xs sm:text-sm font-medium'
					>
						🏠{' '}
						<span className='hidden sm:inline'>{t('appointment.current')}</span>
					</motion.button>

					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={goToNextWeek}
						className='px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium'
					>
						<span className='hidden sm:inline'>
							{t('appointment.next_week')}
						</span>{' '}
						→
					</motion.button>

					<AnimatePresence>
						{futureAppointments && futureAppointments.length > 0 && (
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{
									opacity: 1,
									scale: 1,
									// Make it pulse when there are no appointments in current week
									...(futureWeekAppointments.length === 0
										? {
												boxShadow: [
													'0 0 0 0 rgba(34, 197, 94, 0.7)',
													'0 0 0 10px rgba(34, 197, 94, 0)',
													'0 0 0 0 rgba(34, 197, 94, 0)',
												],
												scale: [1, 1.05, 1],
										  }
										: {}),
								}}
								exit={{ opacity: 0, scale: 0.8 }}
								whileTap={{ scale: 0.95 }}
								onClick={goToFirstAppointmentWeek}
								transition={{
									duration: futureWeekAppointments.length === 0 ? 2 : 0.3,
									repeat: futureWeekAppointments.length === 0 ? Infinity : 0,
									repeatType: 'reverse',
								}}
								className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 shadow-md text-xs sm:text-sm font-medium ${
									futureWeekAppointments.length === 0
										? 'bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse'
										: 'bg-gradient-to-r from-green-500 to-green-600 text-white'
								}`}
							>
								🔍{' '}
								<span className='hidden sm:inline'>
									{futureWeekAppointments.length === 0
										? t('appointment.go_to_appointment')
										: t('appointment.find_appointment')}
								</span>
								<span className='sm:hidden'>
									{futureWeekAppointments.length === 0
										? t('appointment.find')
										: t('appointment.find')}
								</span>
							</motion.button>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>

			{/* Timetable */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden appointment-timetable'
			>
				{/* No appointments in current week message */}
				{futureAppointments &&
					futureAppointments.length > 0 &&
					futureWeekAppointments.length === 0 && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded-lg'
						>
							<div className='flex items-center space-x-3'>
								<div className='text-yellow-600 text-2xl'>📅</div>
								<div>
									<h3 className='text-yellow-800 font-semibold'>
										{t('appointment.no_appointments_this_week')}
									</h3>
									<p className='text-yellow-700 text-sm mt-1'>
										{t('appointment.upcoming_appointments_info', {
											0: futureAppointments.length.toString(),
										})}{' '}
										<span className='font-semibold text-green-600'>
											&quot;🔍 {t('appointment.find_appointment')}&quot;
										</span>{' '}
										{t('appointment.go_to_first_appointment')}
									</p>
								</div>
							</div>
						</motion.div>
					)}

				<div className='overflow-x-auto max-h-[70vh] sm:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-200 relative scroll-container'>
					{/* Current Time Line Overlay */}
					<CurrentTimeLine
						timeSlots={timeSlots}
						weekDays={weekDays}
						onTimeSlotStatusChange={handleTimeSlotStatusChange}
					/>

					<motion.table
						initial={{ opacity: 0.95 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
						className='w-full min-w-[320px] sm:min-w-[800px] table-fixed'
						style={{
							tableLayout: 'fixed',
							minWidth: '800px',
						}}
					>
						{/* Header with days */}
						<thead className='sticky top-0 z-50 sticky-header'>
							<motion.tr
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
								className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300'
							>
								<motion.th
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.7 }}
									className='w-16 sm:w-24 px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-bold text-gray-800 border-b border-gray-300 sticky left-0 z-40 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg sticky-time-col'
									style={{
										width: '100px',
										minWidth: '100px',
										maxWidth: '100px',
									}}
								>
									<Clock className='w-4 h-4 inline mr-2' />
									<span className='hidden sm:inline'>
										{t('appointment.time')}
									</span>
								</motion.th>
								{weekDays.map((day, index) => (
									<motion.th
										key={day.toISOString()}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.7 + index * 0.05 }}
										className='px-1 sm:px-2 py-3 text-center text-xs sm:text-sm font-bold text-gray-800 border-b border-gray-300 min-w-[100px] sm:min-w-[150px] bg-gradient-to-r from-gray-50 to-gray-100 relative z-30'
										style={{
											width: `calc((100% - 100px) / 7)`,
											minWidth: '120px',
										}}
									>
										<div className='flex flex-col items-center space-y-1'>
											<span className='text-xs text-gray-600'>
												{new Date(day)
													.toLocaleDateString(
														locale === 'vi' ? 'vi-VN' : 'en-US',
														{ weekday: 'short' }
													)
													.toUpperCase()}
											</span>
											<span className='font-bold text-gray-900'>
												{new Date(day).toLocaleDateString(
													locale === 'vi' ? 'vi-VN' : 'en-US',
													{
														day: '2-digit',
														month: '2-digit',
													}
												)}
											</span>
										</div>
									</motion.th>
								))}
							</motion.tr>
						</thead>

						{/* Body with time slots */}
						<motion.tbody
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
						>
							{timeSlots.map((timeSlot, index) => {
								// Show all time slots, but visually distinguish working hours
								const isWorkingHours =
									timeSlot >= '08:00' && timeSlot <= '22:00'
								return (
									<motion.tr
										key={timeSlot}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.9 + index * 0.02 }}
										className='border-b border-gray-200 group'
									>
										<motion.td
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 1 + index * 0.02 }}
											className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold border-r border-gray-200 sticky left-0 z-20 transition-all duration-200 shadow-md sticky-time-col ${
												isWorkingHours
													? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900'
													: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
											}`}
											style={{
												width: '100px',
												minWidth: '100px',
												maxWidth: '100px',
											}}
										>
											<span className='flex items-center space-x-2'>
												{isWorkingHours ? (
													<Briefcase className='w-4 h-4' />
												) : (
													<Moon className='w-4 h-4' />
												)}
												<span>{timeSlot}</span>
											</span>
										</motion.td>
										{weekDays.map((day, dayIndex) => {
											const dateKey = getLocalDateKey(day)
											const appointmentsForSlot =
												groupedAppointments[dateKey]?.[timeSlot] || []
											const isSlotPast = isTimeSlotPast(day, timeSlot)
											const isSlotHighlighted =
												highlightedSlot === `${dateKey}-${timeSlot}`
											return (
												<motion.td
													key={`${dateKey}-${timeSlot}`}
													ref={el => {
														cellRefs.current[`${dateKey}-${timeSlot}`] = el
													}}
													initial={{ opacity: 0, scale: 0.9 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{
														delay: 1.1 + index * 0.02 + dayIndex * 0.01,
													}}
													className={`p-0 relative z-10 appointment-cell ${
														isSlotPast ? 'bg-gray-300' : ''
													}`}
													style={{
														width: `calc((100% - 100px) / 7)`,
														minWidth: '120px',
													}}
												>
													<AppointmentCell
														appointments={appointmentsForSlot}
														isHighlighted={isSlotHighlighted}
													/>
												</motion.td>
											)
										})}
									</motion.tr>
								)
							})}
						</motion.tbody>
					</motion.table>
				</div>
			</motion.div>

			{/* Summary */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.5, duration: 0.5 }}
				className='bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm'
			>
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 1.6 }}
						className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm'
					>
						<div className='flex items-center space-x-3'>
							<BarChart3 className='w-6 h-6 text-blue-600' />
							<span className='text-gray-700'>
								{t('appointment.this_week')}:{' '}
								<span className='font-bold text-blue-600 text-lg'>
									{futureWeekAppointments.length}
								</span>{' '}
								{t('appointment.appointments_count')}
							</span>
						</div>
						<div className='flex items-center space-x-3'>
							<TrendingUp className='w-6 h-6 text-purple-600' />
							<span className='text-gray-700'>
								{t('appointment.upcoming')}:{' '}
								<span className='font-bold text-purple-600 text-lg'>
									{futureAppointments?.length || 0}
								</span>{' '}
								{t('appointment.upcoming_appointments')}
							</span>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 1.7 }}
						className='flex flex-wrap items-center gap-3 sm:gap-4'
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 1.8, type: 'spring' }}
							className='flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm'
						>
							<motion.div
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 2, repeat: Infinity }}
								className='w-3 h-3 bg-green-500 rounded-full'
							></motion.div>
							<span className='text-xs sm:text-sm text-gray-700 font-medium'>
								{t('appointment.confirmed')}
							</span>
						</motion.div>

						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 1.9, type: 'spring' }}
							className='flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm'
						>
							<motion.div
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
								className='w-3 h-3 bg-yellow-500 rounded-full'
							></motion.div>
							<span className='text-xs sm:text-sm text-gray-700 font-medium'>
								{t('appointment.pending_confirmation')}
							</span>
						</motion.div>

						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 2, type: 'spring' }}
							className='flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm'
						>
							<motion.div
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 2, repeat: Infinity, delay: 1 }}
								className='w-3 h-3 bg-red-500 rounded-full'
							></motion.div>
							<span className='text-xs sm:text-sm text-gray-700 font-medium'>
								{t('appointment.cancelled')}
							</span>
						</motion.div>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	)
}
