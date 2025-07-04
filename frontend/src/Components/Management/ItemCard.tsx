'use client'
import React, { useState } from 'react'
import { PencilSVG, RestoreSVG, TrashCanSVG } from '../SVGs'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import StatusLight, { Status } from '../StatusLight'
import EditModal from './EditModal'
import ConfirmationModal from '../Common/ConfirmationModal'
import { Account } from '@/Interfaces/Auth/Types/Account'

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
	onUpdate?: (id: string, data: any) => void
	enableModal?: boolean
	modalType?: 'account' | 'service'
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
	onUpdate,
	enableModal = false,
	modalType = 'account',
}: ItemCardProps<T>) => {
	const router = useRouter()
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isUpdating, setIsUpdating] = useState(false)
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
	const [currentAction, setCurrentAction] = useState<
		'delete' | 'restore' | null
	>(null)

	if (thirdLabel instanceof Date) {
		thirdLabel = thirdLabel.toString()
	}

	const handleEditFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		if (enableModal) {
			setIsEditModalOpen(true)
		} else {
			router.push(`${path}/${id}`)
		}
	}

	const handleModalSave = async (updateData: any) => {
		if (onUpdate) {
			setIsUpdating(true)
			try {
				await onUpdate(id, updateData)
				setIsEditModalOpen(false)
			} catch (error) {
				console.error('Failed to update:', error)
			} finally {
				setIsUpdating(false)
			}
		}
	}

	const handleDeleteFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		setCurrentAction('delete')
		setIsConfirmationOpen(true)
	}

	// Check if this is an admin account (only for account modal type)
	const isAdminAccount =
		modalType === 'account' &&
		(data as Account)?.role?.name?.toLowerCase() === 'admin'

	const handleRestoreFunc = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		setCurrentAction('restore')
		setIsConfirmationOpen(true)
	}

	const handleConfirmation = () => {
		if (currentAction === 'delete') {
			handleDelete(id)
		} else if (currentAction === 'restore') {
			handleRestore(id, data)
		}
		setIsConfirmationOpen(false)
		setCurrentAction(null)
	}

	return (
		<>
			<motion.button
				id={id}
				className='bg-gradient-to-r pl-4 border border-white hover:border-teal-300 from-white to-general w-full flex justify-between drop-shadow-sm transition-colors duration-300 items-center round relative overflow-hidden'
				aria-label={`Item card for ${label}`}
				onClick={() => router.push(`${path}/${id}`)}
				initial={{ translateY: -60, opacity: 0 }}
				animate={{ translateY: 0, opacity: 1 }}
				transition={{
					delay: delay / 15,
					type: 'spring',
					stiffness: 80,
					damping: 20,
					opacity: { duration: 0.8, ease: 'easeOut' },
					translateY: { duration: 0.6, ease: 'easeOut' },
				}}
				tabIndex={0}
			>
				{/* Background overlay */}
				<div className='absolute inset-0 opacity-30 asfaltBackground pointer-events-none' />

				{/* 1. Status + Label */}
				<div className='flex items-center gap-3 flex-3/12'>
					<StatusLight status={status} />
					<p className='font-semibold text-sm truncate text-slate-900'>
						{label}
					</p>
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
					{/* Edit Button - Yellow for Edit */}
					<div
						className={`itemCardButton ${
							isAdminAccount
								? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:shadow-none'
								: 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(234,179,8,0.7)] cursor-pointer'
						}`}
						onClick={isAdminAccount ? undefined : handleEditFunc}
						tabIndex={isAdminAccount ? -1 : 1}
					>
						<PencilSVG className='size-5 text-white' />
					</div>
					{isActive ? (
						// Restore Button - Green for Restore
						<div
							className={`itemCardButton ${
								isAdminAccount
									? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:shadow-none'
									: 'bg-green-500 hover:bg-green-600 hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] cursor-pointer'
							}`}
							onClick={isAdminAccount ? undefined : handleRestoreFunc}
							tabIndex={isAdminAccount ? -1 : 1}
						>
							<RestoreSVG className='size-5 text-white' />
						</div>
					) : (
						<div
							className={`itemCardButton ${
								isAdminAccount
									? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400 hover:shadow-none'
									: 'bg-red-500 hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] cursor-pointer'
							}`}
							onClick={isAdminAccount ? undefined : handleDeleteFunc}
							tabIndex={isAdminAccount ? -1 : 1}
						>
							<TrashCanSVG className='size-5 text-white' />
						</div>
					)}
				</div>
			</motion.button>

			{/* Edit Modal */}
			{enableModal && (
				<EditModal
					id={id}
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					type={modalType}
					onSave={handleModalSave}
					isLoading={isUpdating}
				/>
			)}

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={isConfirmationOpen}
				onClose={() => setIsConfirmationOpen(false)}
				onConfirm={handleConfirmation}
				confirmText={currentAction === 'delete' ? 'Delete' : 'Restore'}
				cancelText='Cancel'
				title={`Are you sure you want to ${currentAction} this item?`}
				message={`This action will ${currentAction} the item. Do you want to proceed?`}
			/>
		</>
	)
}

export default ItemCard
