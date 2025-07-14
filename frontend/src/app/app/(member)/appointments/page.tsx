import { AppointmentsTimetable } from '@/Components/Appointment/AppointmentsTimetable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Lịch hẹn của tôi - GenCare',
	description: 'Xem lịch hẹn của bạn',
}

const MemberAppointmentsPage = () => {
	return (
		<div className='container mx-auto px-4 py-6'>
			<AppointmentsTimetable />
		</div>
	)
}

export default MemberAppointmentsPage
