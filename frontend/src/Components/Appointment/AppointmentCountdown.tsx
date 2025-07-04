import { useState, useEffect, memo } from 'react'

interface AppointmentCountdownProps {
	scheduleAt: string
	isUpcoming: boolean
}

export const AppointmentCountdown = memo(
	({ scheduleAt, isUpcoming }: AppointmentCountdownProps) => {
		const [timeLeft, setTimeLeft] = useState('')
		const [isLive, setIsLive] = useState(false)

		useEffect(() => {
			const updateCountdown = () => {
				const now = new Date()
				const appointmentTime = new Date(scheduleAt)
				const timeDiff = appointmentTime.getTime() - now.getTime()
				const minutesDiff = timeDiff / (1000 * 60)

				if (minutesDiff <= 0 && minutesDiff > -60) {
					// Meeting is happening now (up to 1 hour after start)
					setIsLive(true)
					setTimeLeft('ĐANG DIỄN RA')
				} else if (minutesDiff > 0) {
					// Meeting is in the future
					setIsLive(false)
					const hours = Math.floor(minutesDiff / 60)
					const minutes = Math.floor(minutesDiff % 60)

					if (hours > 0) {
						setTimeLeft(`${hours}h ${minutes}p`)
					} else {
						setTimeLeft(`${minutes} phút`)
					}
				} else {
					// Meeting has passed
					setIsLive(false)
					setTimeLeft('ĐÃ KẾT THÚC')
				}
			}

			updateCountdown()
			const interval = setInterval(updateCountdown, 1000) // Update every second

			return () => clearInterval(interval)
		}, [scheduleAt])

		if (!isUpcoming && !isLive) return null

		return (
			<div
				className={`text-xs font-bold px-2 py-1 rounded-full text-center ${
					isLive ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
				}`}
			>
				{isLive ? '🔴 ' : '⏱️ '}
				{timeLeft}
			</div>
		)
	}
)
