'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import clsx from 'clsx'
import { motion } from 'motion/react'

export type FloatingLabelErrorData = {
	errors: string[]
}

export type FloatingLabelInputProps = {
	label: string
	id: string
	value: string
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
	type?: string
	required?: boolean
	className?: string
	name?: string
	error?: FloatingLabelErrorData
	autocomplete?: string
}

export default function FloatingLabelInput({
	label,
	id,
	value,
	onChange,
	type = 'text',
	required = false,
	className = '',
	name = '',
	error,
	autocomplete,
}: FloatingLabelInputProps) {
	const [focused, setFocused] = useState(false)
	const [isFirst, setIsFirst] = useState(true)
	const isActive = focused || value !== ''
	const isCorrect = value !== '' && error == undefined

	const handleOnClick = () => {
		if (typeof window !== 'undefined') {
			const inputElement = document.getElementById(id)
			if (inputElement instanceof HTMLInputElement) {
				inputElement.focus()
				setFocused(true)
			}
		}
	}

	useEffect(() => {
		setIsFirst(false)
	}, [value])

	const handleFocus = () => {
		setFocused(true)
	}

	return (
		<div
			className={clsx('relative h-fit w-full pt-2', className)}
			onClick={handleOnClick}
		>
			<motion.label
				htmlFor={id}
				initial={false}
				animate={'animate'}
				variants={{
					animate: {
						x: 0,
						y: isActive ? -10 : 5,
						fontSize: isActive ? '0.75rem' : '0.875rem',
						color: !isFirst
							? isActive
								? isCorrect
									? 'var(--color-green-500)'
									: 'var(--color-red-500)'
								: 'var(--color-text)'
							: '',
					},
				}}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className='absolute font-semibold left-0 cursor-text transform-gpu pointer-events-none select-none'
			>
				{label}
			</motion.label>
			<input
				id={id}
				type={type}
				name={name}
				required={required}
				value={value}
				onFocus={handleFocus}
				onBlur={() => setFocused(false)}
				onChange={onChange}
				autoComplete={autocomplete ?? ''}
				className={clsx(
					'peer w-full pt-2 border-b-2 border-gray-300 bg-transparent',
					'text-base text-gray-900 placeholder-transparent',
					'transition-all duration-200 ease-in-out',
					'focus:border-blue-500 focus:outline-none',
					!isFirst
						? isCorrect
							? 'border-green-500'
							: 'focus:border-red-500'
						: '',
					error ? 'border-red-500' : ''
				)}
			/>

			<div className='mt-1 text-xs text-red-500 h-[1rem]'>
				{error?.errors?.join(', ')}
			</div>
		</div>
	)
}
