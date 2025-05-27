'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckedState } from '@radix-ui/react-checkbox'
import { FC } from 'react'

const CheckIcon = () => (
	<motion.svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='#007DB3'
		strokeWidth='3'
		strokeLinecap='round'
		strokeLinejoin='round'
		className='w-4 h-4'
		initial={{ pathLength: 0 }}
		animate={{ pathLength: 1 }}
		exit={{ pathLength: 0 }}
		transition={{ duration: 0.3, ease: 'easeInOut' }}
	>
		<motion.path d='M5 13l4 4L19 7' />
	</motion.svg>
)

type MotionCheckboxProps = {
	label: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

const MotionCheckbox: FC<MotionCheckboxProps> = ({
	label,
	checked,
	onCheckedChange,
}) => {
	const handleChange = (checkedState: CheckedState) => {
		if (checkedState === 'indeterminate') return
		onCheckedChange(checkedState)
	}

	return (
		<label className='flex items-center gap-2 cursor-pointer'>
			<Checkbox.Root
				className='w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center bg-white'
				checked={checked}
				onCheckedChange={handleChange}
			>
				<AnimatePresence>
					{checked && (
						<motion.div
							key='check'
							initial={{ scale: 0.6, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.6, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<CheckIcon />
						</motion.div>
					)}
				</AnimatePresence>
			</Checkbox.Root>
			<span className='text-sm text-gray-800'>{label}</span>
		</label>
	)
}

export default MotionCheckbox
