import { AppointmentsTimetable } from '@/Components/Appointment/AppointmentsTimetable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Appointments - GenCare',
	description: 'View and manage your appointments',
}

const AppointmentsPage = () => {
	return (
		<div className='container mx-auto px-4 py-6'>
			<AppointmentsTimetable />
		</div>
	)
}

export default AppointmentsPage
