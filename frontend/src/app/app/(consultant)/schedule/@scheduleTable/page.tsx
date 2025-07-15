'use client'

import { AppointmentsTimetable } from '@/Components/Appointment/AppointmentsTimetable'
import useToken from '@/Hooks/Auth/useToken'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import { useAppointments } from '@/Services/appointment-service'
import { decodeToken } from '@/Utils/Auth/decodeToken'
import { useMemo } from 'react'

const ScheduleTable = () => {
	const { accessToken } = useToken()
	const consultantId = useMemo(() => {
		if (!accessToken) return null
		const decoded = decodeToken(accessToken)
		return decoded?.account?.id || null
	}, [accessToken])

	const { data: allAppointments, isLoading, error } = useAppointments()

	// Filter only appointments for this consultant
	const consultantAppointments = useMemo<Appointment[]>(
		() =>
			allAppointments?.filter(
				(a: Appointment) => a.staffId === consultantId && !a.isDeleted
			) || [],
		[allAppointments, consultantId]
	)

	// Debug logging
	console.log('Consultant ID:', consultantId)
	console.log('All appointments:', allAppointments)
	console.log('Filtered appointments:', consultantAppointments)

	return (
		<div className='w-full h-full'>
			{/* Debug info */}
			<div className='p-4 bg-yellow-50 border border-yellow-200 rounded mb-4'>
				<h3 className='font-bold text-yellow-800'>Debug Info:</h3>
				<p>Consultant ID: {consultantId || 'Not found'}</p>
				<p>Total appointments: {allAppointments?.length || 0}</p>
				<p>Filtered appointments: {consultantAppointments.length}</p>
				{consultantAppointments.length > 0 && (
					<div>
						<h4 className='font-semibold mt-2'>Appointments:</h4>
						<ul className='text-sm'>
							{consultantAppointments.slice(0, 3).map(app => (
								<li key={app.id}>
									{app.memberName} - {new Date(app.scheduleAt).toLocaleString()}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<AppointmentsTimetable appointments={consultantAppointments} />
		</div>
	)
}

export default ScheduleTable
