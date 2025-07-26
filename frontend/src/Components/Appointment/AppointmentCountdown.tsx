import { useState, useEffect, memo } from 'react'
import { Circle, Timer } from 'lucide-react'
import { useLocale } from '@/Hooks/useLocale'

interface AppointmentCountdownProps {
	scheduleAt: string
	isUpcoming: boolean
}

const AppointmentCountdownComponent = ({
	scheduleAt,
	isUpcoming,
}: AppointmentCountdownProps) => {
	const { t } = useLocale()
	const [timeLeft, setTimeLeft] = useState('')
	const [isLive, setIsLive] = useState(false)

	useEffect(() => {
		const updateCountdown = () => {
			const now = new Date()
			const appointmentTime = new Date(scheduleAt)
			const timeDiff = appointmentTime.getTime() - now.getTime()
			const minutesDiff = timeDiff / (1000 * 60)

			if (minutesDiff <= 0 && minutesDiff > -60) {
				setIsLive(true)
				setTimeLeft(t('appointment.live_now'))
			} else if (minutesDiff > 0) {
				setIsLive(false)
				const hours = Math.floor(minutesDiff / 60)
				const minutes = Math.floor(minutesDiff % 60)

				if (hours > 0) {
					setTimeLeft(
						t('appointment.time_remaining_hours_minutes', {
							0: hours.toString(),
							1: minutes.toString(),
						})
					)
				} else {
					setTimeLeft(
						t('appointment.time_remaining_minutes', { 0: minutes.toString() })
					)
				}
			} else {
				setIsLive(false)
				setTimeLeft(t('appointment.ended'))
			}
		}

		updateCountdown()
		const interval = setInterval(updateCountdown, 1000)
		return () => clearInterval(interval)
	}, [scheduleAt, t])

	if (!isUpcoming && !isLive) return null

	return (
		<div
			className={`text-xs font-bold px-3 py-1.5 rounded-full text-center flex items-center justify-center gap-2 ${
				isLive ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
			}`}
		>
			{isLive ? (
				<Circle className='w-3 h-3 fill-current' />
			) : (
				<Timer className='w-3 h-3' />
			)}
			{timeLeft}
		</div>
	)
}

export const AppointmentCountdown = memo(AppointmentCountdownComponent)
