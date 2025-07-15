import React, { ChangeEvent } from 'react'
import clsx from 'clsx'

export type EditableFieldProps<T extends Record<string, any>> = {
	name: keyof T
	type?: 'text' | 'textarea' | 'number'
	value: string | number
	onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	editingField: keyof T | null
	handleFieldSave: (field: keyof T) => Promise<void>
	toggleFieldEdit: (field: keyof T) => void
	className?: string
	error?: string | null
}

const EditableField = <T extends Record<string, any>>({
	name,
	type = 'text',
	value,
	onChange,
	editingField,
	handleFieldSave,
	toggleFieldEdit,
	className = '',
	error,
}: EditableFieldProps<T>) => {
	const isEditing = editingField === name

	// Handle value display and input value based on type
	const getDisplayValue = () => {
		if (type === 'number' && !isEditing && typeof value === 'number') {
			return value.toLocaleString()
		}
		return String(value)
	}

	const getInputValue = () => {
		return String(value)
	}

	// Determine the actual input type to render
	const getInputType = () => {
		if (!isEditing) return 'text' // Always text when not editing
		return type === 'number' ? 'number' : 'text'
	}

	const baseClass = clsx(
		'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
		{
			'bg-gray-50 border-gray-200 text-gray-700 cursor-pointer hover:bg-gray-100':
				!isEditing,
			'bg-white border-gray-300 shadow-sm': isEditing,
		},
		className
	)

	const controlPositionClass = clsx(
		'absolute right-3',
		type === 'textarea' ? 'top-3' : 'top-1/2 -translate-y-1/2'
	)

	return (
		<>
			<div className={clsx('relative flex items-center', className)}>
				{type === 'textarea' ? (
					<textarea
						name={String(name)}
						value={getInputValue()}
						onChange={onChange}
						readOnly={!isEditing}
						className={clsx(
							baseClass,
							'min-h-[140px] resize-none pr-12 leading-relaxed'
						)}
						aria-label={String(name)}
						placeholder={isEditing ? 'Enter description...' : ''}
					/>
				) : (
					<input
						type={getInputType()}
						name={String(name)}
						value={isEditing ? getInputValue() : getDisplayValue()}
						onChange={onChange}
						readOnly={!isEditing}
						className={clsx(baseClass, 'pr-12')}
						aria-label={String(name)}
						placeholder={isEditing ? `Enter ${String(name)}...` : ''}
						{...(type === 'number' &&
							isEditing && {
								step: 'any',
								min: '0',
								inputMode: 'numeric',
							})}
					/>
				)}

				<div className={controlPositionClass}>
					{isEditing ? (
						<button
							type='button'
							className='group relative flex items-center justify-center w-9 h-9 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md'
							onClick={() => handleFieldSave(name)}
						>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 13l4 4L19 7'
								/>
							</svg>
							<span className='absolute bottom-full mb-2 px-3 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10'>
								Save Changes
							</span>
						</button>
					) : (
						<button
							type='button'
							className='group relative flex items-center justify-center w-9 h-9 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-full transition-all duration-200 shadow-sm hover:shadow-md'
							onClick={() => toggleFieldEdit(name)}
						>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
								/>
							</svg>
							<span className='absolute bottom-full mb-2 px-3 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10'>
								Edit Field
							</span>
						</button>
					)}
				</div>
			</div>
			{error && (
				<div className='mt-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
					<p className='text-sm text-red-600 font-medium'>{error}</p>
				</div>
			)}
		</>
	)
}

export default EditableField
