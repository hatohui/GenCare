'use client'

import { useState, FocusEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

type FloatingLabelInputProps = {
	label: string
	id: string
	value: string
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
	type?: string
	required?: boolean
	className?: string
}

export default function FloatingLabelInput({
	label,
	id,
	value,
	onChange,
	type = 'text',
	required = false,
	className = '',
}: FloatingLabelInputProps) {
	const [focused, setFocused] = useState(false)

	const isActive = focused || value.length > 0

	return (
		<div className={clsx('relative w-full', className)}>
			<input
				id={id}
				type={type}
				required={required}
				value={value}
				onFocus={() => setFocused(true)}
				onBlur={(e: FocusEvent<HTMLInputElement>) => setFocused(false)}
				onChange={onChange}
				className={clsx(
					'peer w-full border-b-2 border-gray-300 bg-transparent px-1 pt-6 pb-2 text-base text-black outline-none transition-all focus:border-accent',
					'placeholder-transparent'
				)}
				placeholder={label}
			/>
			<motion.label
				htmlFor={id}
				initial={false}
				animate={'animate'}
				variants={{
					animate: {
						x: 0,
						y: isActive ? 0 : 15,
						fontSize: isActive ? '0.75rem' : '1rem',
						color: isActive ? 'var(--color-accent)' : '#6b7280',
					},
				}}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className='absolute left-0 top-0 origin-[0] cursor-text z-90'
			>
				{label}
			</motion.label>
		</div>
	)
}
