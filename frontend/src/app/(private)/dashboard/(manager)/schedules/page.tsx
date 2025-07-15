'use client'
import { AppointmentsTimetable } from '@/Components/Appointment/AppointmentsTimetable'
import useToken from '@/Hooks/Auth/useToken'
import { Appointment } from '@/Interfaces/Appointment/Types/Appointment'
import { useAppointments } from '@/Services/appointment-service'
import { decodeToken } from '@/Utils/Auth/decodeToken'
import { useMemo } from 'react'

const ScheduleManagementPage = () => {
	const { accessToken } = useToken()
	const userId = useMemo(() => {
		if (!accessToken) return null
		const decoded = decodeToken(accessToken)
		return decoded?.account?.id || null
	}, [accessToken])

	const { data: allAppointments, isLoading, error } = useAppointments()

	// Filter: chỉ lấy appointment của user hiện tại (có thể là staffId hoặc memberId)
	const myAppointments = useMemo<Appointment[]>(
		() =>
			allAppointments?.filter(
				(a: Appointment) =>
					(a.staffId === userId || a.memberId === userId) && !a.isDeleted
			) || [],
		[allAppointments, userId]
	)

	return (
		<div className='w-full h-full'>
			<AppointmentsTimetable appointments={myAppointments} />
		</div>
	)
}

export default ScheduleManagementPage
