import { AppointmentsTimetable } from '@/Components/Appointment/AppointmentsTimetable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Lịch hẹn - GenCare',
	description: 'Xem và quản lý lịch hẹn của bạn',
}

const AppointmentsPage = () => {
	return (
		<div className='container mx-auto px-4 py-6'>
			<AppointmentsTimetable />
		</div>
	)
}

export default AppointmentsPage
