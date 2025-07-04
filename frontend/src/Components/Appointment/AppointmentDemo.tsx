'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { AppointmentCell } from './AppointmentCell'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'

export const AppointmentDemo = () => {
	const [currentTime, setCurrentTime] = useState(new Date())

	// Create demo appointments at different time intervals
	const createDemoAppointments = (): Appointment[] => {
		const now = new Date()

		return [
			{
				id: '1',
				memberName: 'Nguyễn Văn A',
				memberId: 'member1',
				staffName: 'BS. Trần Thị B',
				staffId: 'staff1',
				scheduleAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
				joinUrl: 'https://meet.google.com/demo-5min',
				isDeleted: false,
				status: 'confirmed',
			},
			{
				id: '2',
				memberName: 'Trần Văn C',
				memberId: 'member2',
				staffName: 'BS. Lê Văn D',
				staffId: 'staff2',
				scheduleAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
				joinUrl: 'https://meet.google.com/demo-15min',
				isDeleted: false,
				status: 'booked',
			},
			{
				id: '3',
				memberName: 'Phạm Thị E',
				memberId: 'member3',
				staffName: 'BS. Hoàng Văn F',
				staffId: 'staff3',
				scheduleAt: new Date(now.getTime() + 35 * 60 * 1000).toISOString(), // 35 minutes from now
				joinUrl: 'https://meet.google.com/demo-35min',
				isDeleted: false,
				status: 'confirmed',
			},
			{
				id: '4',
				memberName: 'Võ Văn G',
				memberId: 'member4',
				staffName: 'BS. Đặng Thị H',
				staffId: 'staff4',
				scheduleAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago (live meeting)
				joinUrl: 'https://meet.google.com/demo-live',
				isDeleted: false,
				status: 'confirmed',
			},
			{
				id: '5',
				memberName: 'Lý Thị I',
				memberId: 'member5',
				staffName: 'BS. Phan Văn J',
				staffId: 'staff5',
				scheduleAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
				joinUrl: 'https://meet.google.com/demo-2h',
				isDeleted: false,
				status: 'pending',
			},
		]
	}

	const demoAppointments = createDemoAppointments()

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='p-6 space-y-6 bg-gray-50 min-h-screen'
		>
			<div className='bg-white rounded-xl p-6 shadow-lg'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4'>
					🧪 Demo: Upcoming Meeting Notifications
				</h2>
				<p className='text-gray-600 mb-6'>
					Thời gian hiện tại:{' '}
					<span className='font-mono font-bold'>
						{currentTime.toLocaleTimeString('vi-VN')}
					</span>
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{demoAppointments.map((appointment, index) => {
						const appointmentTime = new Date(appointment.scheduleAt)
						const timeDiff = appointmentTime.getTime() - currentTime.getTime()
						const minutesDiff = Math.floor(timeDiff / (1000 * 60))

						return (
							<motion.div
								key={appointment.id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								className='bg-gray-100 rounded-lg p-4'
							>
								<div className='mb-3'>
									<h3 className='font-bold text-sm text-gray-800'>
										Demo #{appointment.id}
									</h3>
									<p className='text-xs text-gray-600'>
										Thời gian: {appointmentTime.toLocaleTimeString('vi-VN')}
									</p>
									<p className='text-xs text-gray-600'>
										{minutesDiff > 0
											? `Còn ${minutesDiff} phút`
											: minutesDiff < -15
											? 'Đã kết thúc'
											: 'Đang diễn ra/sắp diễn ra'}
									</p>
								</div>

								<div className='h-20'>
									<AppointmentCell appointments={[appointment]} />
								</div>
							</motion.div>
						)
					})}
				</div>

				<div className='mt-6 p-4 bg-blue-50 rounded-lg'>
					<h3 className='font-bold text-blue-800 mb-2'>Giải thích:</h3>
					<ul className='text-sm text-blue-700 space-y-1'>
						<li>
							• <strong>5 phút:</strong> Nút join màu đỏ, nhấp nháy "THAM GIA
							NGAY"
						</li>
						<li>
							• <strong>15 phút:</strong> Nút join màu đỏ với countdown timer
						</li>
						<li>
							• <strong>35 phút:</strong> Nút join bình thường (ngoài 30 phút)
						</li>
						<li>
							• <strong>Live meeting:</strong> Đang diễn ra, nút màu đỏ với
							"ĐANG DIỄN RA"
						</li>
						<li>
							• <strong>2 giờ:</strong> Chưa trong khoảng 30 phút, nút bình
							thường
						</li>
					</ul>
				</div>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setCurrentTime(new Date())}
					className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
				>
					🔄 Refresh Current Time
				</motion.button>
			</div>
		</motion.div>
	)
}
