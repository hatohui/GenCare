import React, { ChangeEvent } from 'react'
import { CheckSVG } from './CRUDSVG'
import { PencilSVG } from '../SVGs'
import clsx from 'clsx'

export type EditableFieldProps<T extends Record<string, any>> = {
	name: keyof T
	type?: 'text' | 'textarea' | 'number'
	value: string
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

	const baseClass = clsx(
		'p-2 w-full rounded-md border-none truncate ring-1 ring-blue-500 focus:ring-blue-500 read-only:bg-gray-300 read-only:ring-transparent',
		className
	)

	const controlPositionClass = clsx(
		'absolute right-2',
		type === 'textarea' && 'top-2'
	)

	return (
		<>
			<div className={clsx('relative flex items-center', className)}>
				{type === 'textarea' ? (
					<textarea
						name={String(name)}
						value={value}
						onChange={onChange}
						readOnly={!isEditing}
						className={clsx(
							baseClass,
							'min-h-[10rem] h-auto resize-none text-wrap overflow-y-scroll scroll-bar bg-gray-100'
						)}
						aria-label={String(name)}
					/>
				) : (
					<input
						type={type}
						name={String(name)}
						value={value}
						onChange={onChange}
						readOnly={!isEditing}
						className={clsx(baseClass, 'bg-gray-100')}
						aria-label={String(name)}
					/>
				)}

				<div className={controlPositionClass}>
					{isEditing ? (
						<button
							type='button'
							className='group relative flex items-center justify-center hover:text-green-500 hover:scale-105 transition duration-150'
							onClick={() => handleFieldSave(name)}
						>
							<CheckSVG />
							<span className='absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap'>
								Save
							</span>
						</button>
					) : (
						<button
							type='button'
							className='group relative flex items-center justify-center hover:text-blue-500 hover:scale-105 transition duration-150'
							onClick={() => toggleFieldEdit(name)}
						>
							<PencilSVG />
							<span className='absolute bottom-full mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap'>
								Edit
							</span>
						</button>
					)}
				</div>
			</div>
			{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
		</>
	)
}

export default EditableField
