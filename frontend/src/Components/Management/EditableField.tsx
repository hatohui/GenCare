import React, { ChangeEvent } from 'react'
import { CheckSVG } from './CRUDSVG'
import { PencilSVG } from '../SVGs'
import { Service } from '@/Interfaces/Service/Types/Service'
import clsx from 'clsx'

export type EditableFieldProps = {
	name: keyof Service
	type?: 'text' | 'textarea'
	value: string
	onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	editingField: string | null
	handleFieldSave: (field: keyof Service) => Promise<void>
	toggleFieldEdit: (field: keyof Service) => void
	className?: string
}

const EditableField = ({
	name,
	type = 'text',
	value,
	onChange,
	editingField,
	handleFieldSave,
	toggleFieldEdit,
	className = '',
}: EditableFieldProps) => {
	const isEditing = editingField === name

	return (
		<div className={clsx(className, 'relative flex items-center')}>
			{type === 'textarea' ? (
				<textarea
					name={name}
					value={value}
					onChange={onChange}
					readOnly={!isEditing}
					className={`p-2 min-h-[10rem] h-auto w-full resize-none text-wrap overflow-y-scroll scroll-bar bg-gray-100 rounded-md border-none read-only:bg-gray-300 truncate ring-1 ring-blue-500 focus:ring-blue-500 read-only:ring-transparent ${className}`}
				/>
			) : (
				<input
					type='text'
					name={name}
					value={value}
					onChange={onChange}
					readOnly={!isEditing}
					className={`p-2 bg-gray-100 w-full rounded-md border-none read-only:bg-gray-300 truncate ring-1 ring-blue-500 focus:ring-blue-500 read-only:ring-transparent ${className}`}
				/>
			)}

			{isEditing ? (
				<div
					className={clsx('absolute right-2', type === 'textarea' && 'top-2')}
				>
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
				</div>
			) : (
				<div
					className={clsx('absolute right-2', type === 'textarea' && 'top-2')}
				>
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
				</div>
			)}
		</div>
	)
}

export default EditableField
