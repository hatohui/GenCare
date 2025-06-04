'use client'
import clsx from 'clsx'
import React from 'react'
import { PencilSVG, TrashCanSVG } from '../SVGs'
import { useRouter } from 'next/navigation'

export type Status = 'SUCCESS' | 'PENDING' | 'FAILED'

export type ItemCardProps = {
	id: string
	label: string
	status?: Status
	date: string | Date
	path: string
	secondaryLabel: string
	handleDelete: () => void
}

const ItemCard = ({
	id,
	label = 'Your name',
	status,
	path = '/',
	date = '00/00/0000',
	secondaryLabel = 'aaa',
	handleDelete,
}: ItemCardProps) => {
	const router = useRouter()
	let statusClass = ''

	if (date instanceof Date) {
		date = date.toString()
	}

	switch (status) {
		case 'SUCCESS':
			statusClass = 'bg-green-600 shadow-green-500/50'
			break
		case 'PENDING':
			statusClass = 'bg-yellow-500 shadow-yellow-500/50'
			break
		case 'FAILED':
			statusClass = 'bg-red-500 shadow-red-500/50'
			break
		default:
	}

	const handleEditFunc = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()

		router.push(`${path}/edit/${id}`)
	}

	const handleDeleteFunc = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		handleDelete()
	}

	return (
		<div
			id={id}
			className='bg-gray-300  w-full h-full flex justify-between px-2 drop-shadow-xs border-transparent hover:border-slate-800 transition-colors duration-300 border items-center rounded-[30px]'
			aria-label={`Item card for ${label}`}
			onClick={() => router.push(`${path}/${id}`)}
		>
			<div className='flex items-center gap-3 text-shadow-sm p-3'>
				<div
					className={clsx(
						'rounded-full size-4 transition-all animate-pulse duration-300',
						statusClass ? statusClass : 'bg-slate-900',
						statusClass && 'hover:shadow-[0_0_10px] shadow-[0px_0px_10px]'
					)}
					role='status'
					aria-label={`Status: ${status}`}
				/>
				<p className='font-bold truncate text-slate-950'>{label}</p>
			</div>
			<p className='hidden sm:block text-slate-700 truncate'>
				{secondaryLabel}
			</p>
			<div className='center-all gap-2'>
				<p className='truncate text-slate-950 hidden sm:block'>{date}</p>
				<div className='flex gap-2 p-3'>
					<button
						className='bg-amber-200 py-2 z-50 center-all px-4 rounded-[30px] transition duration-200 ease-in hover:scale-105 hover:shadow-[0_0_15px_rgba(253,224,71,0.7)]'
						onClick={handleEditFunc}
					>
						<PencilSVG className='size-5 text-slate-950' />
					</button>
					<button
						className='bg-red-400 py-2 center-all z-50 px-4 rounded-[30px] transition duration-200 ease-in hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]'
						onClick={handleDeleteFunc}
					>
						<TrashCanSVG className='size-5 text-slate-950' />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ItemCard
