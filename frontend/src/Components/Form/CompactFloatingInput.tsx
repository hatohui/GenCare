'use client'
import React, { useState } from 'react'
import clsx from 'clsx'

interface CompactFloatingInputProps {
	id: string
	label: string
	type?: string
	value: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	className?: string
	placeholder?: string
	disabled?: boolean
	required?: boolean
	'aria-label'?: string
}

const CompactFloatingInput: React.FC<CompactFloatingInputProps> = ({
	id,
	label,
	type = 'text',
	value,
	onChange,
	className = '',
	placeholder = '',
	disabled = false,
	required = false,
	'aria-label': ariaLabel,
}) => {
	const [isFocused, setIsFocused] = useState(false)
	const hasValue = value && value.length > 0
	const isLabelFloating = isFocused || hasValue

	return (
		<div className={clsx('relative', className)}>
			<input
				id={id}
				type={type}
				value={value}
				onChange={onChange}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				disabled={disabled}
				required={required}
				placeholder={isFocused ? placeholder : ''}
				aria-label={ariaLabel}
				className={clsx(
					'w-full px-3 py-2 text-sm border border-white round',
					'bg-gradient-to-r from-white to-general backdrop-blur-sm',
					'transition-all duration-200 ease-in-out',
					'focus:outline-none focus:ring-2 focus:ring-main/30 focus:border-main',
					'hover:border-secondary/50',
					'placeholder-transparent',
					disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
					'peer'
				)}
			/>
			<label
				htmlFor={id}
				className={clsx(
					'absolute left-3 transition-all duration-200 ease-in-out cursor-text',
					'text-text select-none pointer-events-none',
					isLabelFloating
						? 'top-0 -translate-y-1/2 text-xs bg-white px-1 text-main font-medium'
						: 'top-1/2 -translate-y-1/2 text-sm',
					disabled && 'text-gray-400'
				)}
			>
				{label}
				{required && <span className='text-red-500 ml-1'>*</span>}
			</label>
		</div>
	)
}

export default CompactFloatingInput
