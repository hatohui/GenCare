'use client'
import React from 'react'
import { PencilSVG, RestoreSVG, TrashCanSVG } from '../SVGs'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import StatusLight, { Status } from '../StatusLight'

export type ItemCardProps<T extends object> = {
	id: string
	label: string
	status?: Status
	thirdLabel?: string | Date
	fourthLabel?: string
	path: string
	data: T
	delay: number
	secondaryLabel: string
	handleDelete: (id: string) => void
	isActive: boolean
	handleRestore: (id: string, data: T) => void
}

const ItemCard = <T extends object>({
	id,
	label = 'Your name',
	status,
	data,
	delay,
	path = '/',
	thirdLabel = '00/00/0000',
	fourthLabel = '',
	secondaryLabel = 'aaa',
	handleDelete,
	isActive,
	handleRestore,
}: ItemCardProps<T>) => {
	const router = useRouter()

	if (thirdLabel instanceof Date) {
		thirdLabel = thirdLabel.toString()
	}

	const handleEditFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		router.push(`${path}/${id}`)
	}

	const handleDeleteFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		handleDelete(id)
	}

	const handleRestoreFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		handleRestore(id, data)
	}

	return (
		<motion.button
			id={id}
			className='bg-gradient-to-r pl-4 border border-white hover:border-teal-300 from-white to-general w-full flex justify-between drop-shadow-sm transition-colors duration-300 items-center round relative overflow-hidden'
			aria-label={`Item card for ${label}`}
			onClick={() => router.push(`${path}/${id}`)}
			initial={{ translateY: -40, opacity: 0 }}
			animate={{ translateY: 0, opacity: 1 }}
			transition={{ delay: delay / 15, type: 'spring' }}
			tabIndex={0}
		>
			{/* Background overlay */}
			<div className='absolute inset-0 opacity-30 asfaltBackground pointer-events-none' />

			{/* 1. Status + Label */}
			<div className='flex items-center gap-3 flex-3/12'>
				<StatusLight status={status} />
				<p className='font-semibold text-sm truncate text-slate-900'>{label}</p>
			</div>

			{/* 2. Secondary Label */}
			<div className='secondary-item-card-button hidden flex-3/12 text-left sm:flex'>
				{secondaryLabel}
			</div>

			{/* 3. Fixed "Role" Text */}
			<div className='secondary-item-card-button hidden justify-center flex-1/12 xl:flex'>
				{fourthLabel}
			</div>

			{/* 4. Third Label */}
			<div className='secondary-item-card-button hidden justify-center flex-2/12 xl:flex'>
				{thirdLabel}
			</div>

			{/* 5. Action Buttons */}
			<div className='flex items-center justify-end flex-1/12 gap-2 py-2 pr-4'>
				<div
					className='itemCardButton bg-gradient-to-r from-amber-300 to-amber-400 hover:shadow-[0_0_15px_rgba(253,224,71,0.7)]'
					onClick={handleEditFunc}
					tabIndex={1}
				>
					<PencilSVG className='size-5 text-violet-950' />
				</div>
				{isActive ? (
					<div
						className='itemCardButton bg-gradient-to-r from-green-400 to-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.7)]'
						onClick={handleRestoreFunc}
						tabIndex={1}
					>
						<RestoreSVG />
					</div>
				) : (
					<div
						className='itemCardButton bg-gradient-to-r from-red-400 to-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]'
						onClick={handleDeleteFunc}
						tabIndex={1}
					>
						<TrashCanSVG className='size-5 text-white' />
					</div>
				)}
			</div>
		</motion.button>
	)
}

export default ItemCard
