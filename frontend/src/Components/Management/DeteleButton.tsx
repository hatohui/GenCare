import React from 'react'
import { TrashCanSVG } from '../SVGs'

const DeteleButton = ({
	id,
	handleDelete,
}: {
	id: string
	handleDelete: () => void
}) => {
	return (
		<button
			id={`delete_${id}`}
			className='flex items-center gap-1 px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md'
			onClick={handleDelete}
		>
			<label className='text-sm font-semibold'>Delete</label>
			<TrashCanSVG className='w-5 h-5' />
		</button>
	)
}

export default DeteleButton
