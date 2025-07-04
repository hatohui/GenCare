import { useState, useEffect, memo, useRef, useCallback } from 'react'

interface AppointmentCountdownProps {
	scheduleAt: string
	isUpcoming: boolean
}

const AppointmentCountdownComponent = ({
	scheduleAt,
	isUpcoming,
}: AppointmentCountdownProps) => {
	const [timeLeft, setTimeLeft] = useState('')
	const [isLive, setIsLive] = useState(false)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const updateCountdown = useCallback(() => {
		const now = new Date()
		const appointmentTime = new Date(scheduleAt)
		const timeDiff = appointmentTime.getTime() - now.getTime()
		const minutesDiff = timeDiff / (1000 * 60)

		let newTimeLeft = ''
		let newIsLive = false

		if (minutesDiff <= 0 && minutesDiff > -60) {
			// Meeting is happening now (up to 1 hour after start)
			newIsLive = true
			newTimeLeft = 'ĐANG DIỄN RA'
		} else if (minutesDiff > 0) {
			// Meeting is in the future
			newIsLive = false
			const hours = Math.floor(minutesDiff / 60)
			const minutes = Math.floor(minutesDiff % 60)

			if (hours > 0) {
				newTimeLeft = `${hours}h ${minutes}p`
			} else {
				newTimeLeft = `${minutes} phút`
			}
		} else {
			// Meeting has passed
			newIsLive = false
			newTimeLeft = 'ĐÃ KẾT THÚC'
		}

		// Batch state updates to prevent multiple re-renders
		setTimeLeft(prevTime => (prevTime !== newTimeLeft ? newTimeLeft : prevTime))
		setIsLive(prevLive => (prevLive !== newIsLive ? newIsLive : prevLive))
	}, [scheduleAt])

	useEffect(() => {
		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
		}

		updateCountdown()
		intervalRef.current = setInterval(updateCountdown, 1000)

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [updateCountdown])

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

export const AppointmentCountdown = memo(AppointmentCountdownComponent)
