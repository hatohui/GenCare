import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import { AnimatePresence } from 'motion/react'
import { AppointmentCountdown } from './AppointmentCountdown'
import { Bell, Clock, User, Check, X, Loader2, Video } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { parseUTCToLocal } from '@/Utils/Appointment/timeSlotHelpers'

interface AppointmentCellProps {
	appointments: Appointment[]
	isHighlighted?: boolean
}

// Helper function to check if appointment is within 60 minutes (properly handling UTC)
const isWithin60Minutes = (scheduleAt: string): boolean => {
	const now = new Date()
	// Parse UTC time and convert to local time for comparison
	const appointmentTime = parseUTCToLocal(scheduleAt)
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
	const [showModal, setShowModal] = useState(false)

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

	if (appointments.length > 1) {
		return (
			<div
				className={`h-16 sm:h-20 border-r border-gray-100 relative transition-colors duration-300 overflow-visible flex items-center justify-center cursor-pointer ${
					isHighlighted
						? 'animate-pulse-ring border-2 border-yellow-400 z-20'
						: ''
				}`}
				onClick={() => setShowModal(true)}
			>
				<div className='flex flex-col items-center w-full'>
					<span className='text-base font-semibold text-blue-700'>
						{appointments.length} lịch hẹn
					</span>
					<span className='inline-block bg-blue-600 text-white text-sm rounded-full px-3 py-1 mt-2'>
						Nhấn để xem
					</span>
				</div>
				{showModal &&
					createPortal(
						<div
							className='fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm'
							onClick={() => setShowModal(false)}
						>
							<div
								className='bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full mx-4 overflow-y-auto max-h-[95vh] relative'
								onClick={e => e.stopPropagation()}
							>
								<button
									className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold'
									onClick={() => setShowModal(false)}
									aria-label='Đóng'
								>
									×
								</button>
								<div className='p-8'>
									<h3 className='text-3xl font-bold mb-8 text-blue-700 text-center'>
										Danh sách lịch hẹn ({appointments.length})
									</h3>
									<ul className='divide-y divide-gray-200'>
										{appointments.map(appointment => {
											const isUpcoming = isWithin60Minutes(
												appointment.scheduleAt
											)
											const hasJoinUrl =
												appointment.joinUrl && !appointment.isDeleted
											const status = (appointment.status || '')
												.toString()
												.trim()
												.toLowerCase()
											return (
												<li
													key={appointment.id}
													className='py-6 flex flex-col gap-3 text-lg'
												>
													<div className='flex items-center gap-4'>
														<User className='w-6 h-6 text-gray-500' />
														<span
															className='font-semibold text-xl text-gray-800 truncate'
															title={appointment.staffName}
														>
															{appointment.staffName}
														</span>
													</div>
													<div className='flex items-center gap-3 text-base text-gray-600'>
														<Clock className='w-5 h-5' />
														{new Date(
															appointment.scheduleAt
														).toLocaleTimeString('vi-VN', {
															hour: '2-digit',
															minute: '2-digit',
														})}
													</div>
													<div className='flex items-center gap-4 mt-3'>
														{hasJoinUrl && (
															<button
																onClick={() =>
																	window.open(appointment.joinUrl, '_blank')
																}
																className={`px-6 py-2 rounded-xl text-lg font-bold flex items-center gap-2 shadow-sm transition-all duration-200 ${
																	isUpcoming
																		? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
																		: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
																}`}
															>
																{isUpcoming ? (
																	<Bell className='w-5 h-5' />
																) : (
																	<Video className='w-5 h-5' />
																)}
																<span>
																	{isUpcoming ? 'THAM GIA NGAY' : 'Tham gia'}
																</span>
															</button>
														)}
														<span
															className={`inline-flex items-center px-4 py-2 text-lg font-medium rounded-full shadow-sm ${
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
																? 'Đã đặt'
																: status === 'confirmed'
																? 'Xác nhận'
																: status === 'pending'
																? 'Chờ'
																: 'Hủy'}
														</span>
													</div>
												</li>
											)
										})}
									</ul>
								</div>
							</div>
						</div>,
						document.body
					)}
			</div>
		)
	}

	// Default: single appointment, show as before
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
										className='flex items-center gap-2 mb-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded px-3 py-1 border border-blue-200 w-fit cursor-pointer'
										title='Bấm để tham gia cuộc hẹn'
										style={{ zIndex: 1 }}
									>
										<Bell className='w-3 h-3' />
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
									<User className='w-3 h-3 inline mr-2' />
									{appointment.staffName}
								</div>
								{/* Time */}
								<div
									className={`text-xs flex items-center ${
										isUpcoming && hasJoinUrl
											? 'text-blue-800 font-bold'
											: 'text-gray-600'
									}`}
								>
									<Clock className='w-3 h-3 mr-2' />
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
											className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full shadow-sm ${
												status === 'confirmed' || status === 'booked'
													? 'bg-green-500 text-white'
													: status === 'pending'
													? 'bg-yellow-500 text-white'
													: status === 'cancelled'
													? 'bg-red-500 text-white'
													: 'bg-gray-500 text-white'
											}`}
										>
											{status === 'booked' ? (
												<>
													<Check className='w-3 h-3 mr-2' />
													Đã đặt
												</>
											) : status === 'confirmed' ? (
												<>
													<Check className='w-3 h-3 mr-2' />
													Xác nhận
												</>
											) : status === 'pending' ? (
												<>
													<Loader2 className='w-3 h-3 mr-2' />
													Chờ
												</>
											) : (
												<>
													<X className='w-3 h-3 mr-2' />
													Hủy
												</>
											)}
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
									className={`w-full text-white text-xs font-bold py-2 px-3 m-1 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center space-x-2 ${
										isUpcoming
											? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
											: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
									}`}
								>
									{isUpcoming ? (
										<Bell className='w-4 h-4' />
									) : (
										<Video className='w-4 h-4' />
									)}
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
