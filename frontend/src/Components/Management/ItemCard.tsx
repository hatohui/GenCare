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
			statusClass = 'bg-lime-500 shadow-lime-400/50'
			break
		case 'PENDING':
			statusClass = 'bg-yellow-500 shadow-yellow-500/50'
			break
		case 'FAILED':
			statusClass = 'bg-red-500 shadow-rose-500/50'
			break
		default:
	}

	const handleEditFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		router.push(`${path}/edit/${id}`)
	}

	const handleDeleteFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		handleDelete()
	}

	return (
		<button
			id={id}
			className='bg-gradient-to-r border border-white hover:border-teal-300 from-white to-general w-full flex justify-between drop-shadow-sm transition-colors duration-300 items-center rounded-[30px]'
			aria-label={`Item card for ${label}`}
			onClick={() => router.push(`${path}/${id}`)}
			tabIndex={0}
		>
			<div className='absolute h-full w-full opacity-60 asfaltBackground' />
			<div className='flex flex-1 items-center gap-3 text-shadow-sm p-3'>
				<div
					className={clsx(
						'rounded-full size-4 transition-all animate-pulse duration-300',
						statusClass ? statusClass : 'bg-slate-900',
						statusClass && 'hover:shadow-[0_0_10px] shadow-[0px_0px_10px]'
					)}
					role='status'
					aria-label={`Status: ${status}`}
				/>
				<p className='font-semibold truncate text-slate-900'>{label}</p>
			</div>

			<p className='hidden text-sm flex-1 sm:block text-slate-700 text-left truncate font-light'>
				{secondaryLabel}
			</p>

			<div className='xl:justify-center items-center flex justify-end gap-2 flex-1'>
				<p className='truncate text-slate-950 text-left flex-1 font-mono hidden xl:block'>
					{date}
				</p>
				<div className='flex gap-2 p-3 justify-end'>
					<div
						className='itemCardButton bg-gradient-to-r from-amber-300 to-amber-400 hover:shadow-[0_0_15px_rgba(253,224,71,0.7)]'
						onClick={handleEditFunc}
						tabIndex={1}
					>
						<PencilSVG className='size-5 text-violet-950' />
					</div>
					<div
						className='itemCardButton bg-gradient-to-r from-red-400 to-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]'
						onClick={handleDeleteFunc}
						tabIndex={1}
					>
						<TrashCanSVG className='size-5 text-white' />
					</div>
				</div>
			</div>
		</button>
	)
}

export default ItemCard
