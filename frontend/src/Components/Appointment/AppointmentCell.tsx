import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import { AppointmentCountdown } from './AppointmentCountdown'

interface AppointmentCellProps {
	appointments: Appointment[]
	isHighlighted?: boolean
}

// Helper function to check if appointment is within 60 minutes
const isWithin60Minutes = (scheduleAt: string): boolean => {
	const now = new Date()
	const appointmentTime = new Date(scheduleAt)
	const timeDiff = appointmentTime.getTime() - now.getTime()
	const minutesDiff = timeDiff / (1000 * 60)

	// Show join button if appointment is within 60 minutes and hasn't passed (up to 15 minutes after)
	const isUpcoming = minutesDiff <= 60 && minutesDiff > -15

	// Debug: uncomment to see timing info
	// console.log(`Appointment ${appointmentTime.toLocaleTimeString()}: ${minutesDiff.toFixed(1)} minutes away, isUpcoming: ${isUpcoming}`)

	return isUpcoming
}

export const AppointmentCell = ({
	appointments,
	isHighlighted = false,
}: AppointmentCellProps) => {
	// Update current time every 30 seconds for better accuracy
	useEffect(() => {
		const interval = setInterval(() => {
			// This effect is used to trigger re-renders for countdown updates
			// The actual current time is calculated in the AppointmentCountdown component
		}, 30000) // Update every 30 seconds

		return () => clearInterval(interval)
	}, [])

	if (appointments.length === 0) {
		return (
			<div
				className={`h-16 sm:h-20 border-r border-gray-100  transition-colors duration-300 overflow-visible flex items-stretch ${
					isHighlighted
						? 'animate-pulse-ring border-2 border-yellow-400 z-20'
						: ''
				}`}
			></div>
		)
	}

	return (
		<div
			className={`h-16 sm:h-20 border-r border-gray-100 relative transition-colors duration-300 overflow-visible flex items-stretch ${
				isHighlighted
					? 'animate-pulse-ring border-2 border-yellow-400 z-20'
					: ''
			}`}
		>
			<AnimatePresence mode='wait'>
				{appointments.map(appointment => {
					const isUpcoming = isWithin60Minutes(appointment.scheduleAt)
					const hasJoinUrl = appointment.joinUrl && !appointment.isDeleted
					const status = (appointment.status || '')
						.toString()
						.trim()
						.toLowerCase()
					console.log('Appointment status:', appointment.status, status)

					// Nếu là sắp tới hẹn và có joinUrl, click toàn bộ ô sẽ join
					const handleCellClick = () => {
						if (isUpcoming && hasJoinUrl) {
							window.open(appointment.joinUrl, '_blank')
						}
					}

					return (
						<div
							key={appointment.id}
							className={`h-full w-full rounded-lg text-xs flex flex-col justify-between relative overflow-hidden group p-1 sm:p-2 ${
								isUpcoming && hasJoinUrl
									? 'bg-gradient-to-br from-blue-100 to-blue-200 cursor-pointer'
									: status === 'confirmed' || status === 'booked'
									? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
									: status === 'pending'
									? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200'
									: status === 'cancelled'
									? 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200'
									: 'bg-gradient-to-br from-gray-100 to-gray-100 border border-gray-100'
							}`}
							onClick={handleCellClick}
						>
							{/* Background pattern */}
							<div className='absolute inset-0 opacity-5'>
								<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 to-transparent'></div>
							</div>

							{/* Content */}
							<div className='relative z-10 p-1.5 sm:p-2 space-y-1'>
								{/* Upcoming Meeting Alert - Đặt lên đầu, nhỏ gọn, không che thông tin */}
								{isUpcoming && hasJoinUrl && (
									<div
										className='flex items-center gap-1 mb-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded px-2 py-0.5 border border-blue-200 w-fit cursor-pointer'
										title='Bấm để tham gia cuộc hẹn'
										style={{ zIndex: 1 }}
									>
										<span className='text-base'>🔔</span>
										<span>Sắp đến giờ hẹn, bấm để tham gia</span>
									</div>
								)}
								{/* Countdown Timer */}
								<AppointmentCountdown
									scheduleAt={appointment.scheduleAt}
									isUpcoming={isUpcoming}
								/>
								{/* Staff Name */}
								<div
									className={`font-semibold text-xs sm:text-sm truncate ${
										isUpcoming && hasJoinUrl ? 'text-blue-900' : 'text-gray-800'
									}`}
									title={appointment.staffName}
								>
									👨‍⚕️ {appointment.staffName}
								</div>
								{/* Time */}
								<div
									className={`text-xs flex items-center ${
										isUpcoming && hasJoinUrl
											? 'text-blue-800 font-bold'
											: 'text-gray-600'
									}`}
								>
									🕐{' '}
									{new Date(appointment.scheduleAt).toLocaleTimeString(
										'vi-VN',
										{
											hour: '2-digit',
											minute: '2-digit',
										}
									)}
								</div>
								{/* Status Badge */}
								{!isUpcoming && (
									<div className='flex items-center justify-center'>
										<span
											className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full shadow-sm ${
												status === 'confirmed' || status === 'booked'
													? 'bg-green-500 text-white'
													: status === 'pending'
													? 'bg-yellow-500 text-white'
													: status === 'cancelled'
													? 'bg-red-500 text-white'
													: 'bg-gray-500 text-white'
											}`}
										>
											{status === 'booked'
												? '✓ Đã đặt'
												: status === 'confirmed'
												? '✓ Xác nhận'
												: status === 'pending'
												? '⏳ Chờ'
												: '✗ Hủy'}
										</span>
									</div>
								)}
							</div>

							{/* Join Button */}
							{hasJoinUrl && (
								<button
									onClick={e => {
										e.stopPropagation()
										window.open(appointment.joinUrl, '_blank')
									}}
									className={`w-full text-white text-xs font-bold py-1.5 px-2 m-1 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center space-x-1 ${
										isUpcoming
											? 'bg-gradient-to-r from-red-500 to-red-600'
											: 'bg-gradient-to-r from-blue-500 to-blue-600'
									}`}
								>
									<span>{isUpcoming ? '🔔' : '🎥	'}</span>
									<span className='hidden sm:inline'>
										{isUpcoming ? 'THAM GIA NGAY' : 'Tham gia'}
									</span>
									<span className='sm:hidden'>
										{isUpcoming ? 'JOIN NOW' : 'Join'}
									</span>
								</button>
							)}

							{/* Hover overlay - disabled */}
							{/* <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg'></div> */}
						</div>
					)
				})}
			</AnimatePresence>
		</div>
	)
}
