'use client'

import React, { useEffect } from 'react'
import { addMonths, subMonths, format } from 'date-fns'
import { stagger, useAnimate } from 'motion/react'
import clsx from 'clsx'

type MonthPickerProps = {
	className?: string
	currentDate: Date
	setCurrentDate: (date: Date) => void
}

const MonthPicker = ({
	currentDate,
	className,
	setCurrentDate,
}: MonthPickerProps) => {
	const [scope, animate] = useAnimate()

	const monthText = format(currentDate, 'MMM yyyy')

	useEffect(() => {
		animate(
			'span',
			{ color: 'var(--color-main)', translate: 0, opacity: 1 },
			{
				duration: 0.25,
				delay: stagger(0.02),
				ease: 'easeInOut',
				mass: 1,
			}
		)
	}, [monthText, scope, animate])

	return (
		<div
			className={clsx('flex justify-between max-h-fit items-center', className)}
			role='month-picker'
			aria-label='month picker'
		>
			<button
				className='calendar-button'
				onClick={() => setCurrentDate(subMonths(currentDate, 1))}
				aria-label='previous month'
			>
				◀
			</button>

			<p className='sr-only'>
				Currently selected month: {currentDate.getMonth()}
			</p>

			<h2
				key={monthText}
				ref={scope}
				aria-hidden
				className='text-lg font-semibold'
			>
				{monthText.split('').map((char, i) => (
					<span
						key={`char-${i}`}
						className='inline-block py-3 -translate-y-1 opacity-0'
					>
						{char === ' ' ? '\u00A0' : char}
					</span>
				))}
			</h2>

			<button
				className='calendar-button'
				onClick={() => setCurrentDate(addMonths(currentDate, 1))}
				aria-label='next month'
			>
				▶
			</button>
		</div>
	)
}

export default MonthPicker
